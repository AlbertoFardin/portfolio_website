import { last } from "lodash-es";
import { IFolder, IFileDetail, ISort, SheetLayout } from "../../interfaces";
import { FOLDER_ROOT_ID, FOLDER_ROOT_LABEL } from "../../constants";
import downloadMedia from "../../utils/downloadMedia";
import { ISortOrder } from "../../componentsBase/StickyGrid";
import { IUseResultEs } from "./useSearchEs";
import apiUrls from "../../api/endpoints";

const PAGINATIONS = [250, 2500];
export const SORTS = [
  {
    id: "name",
    label: "Name",
    order: ISortOrder.ASC,
    keyword: true,
  },
  {
    id: "createdOn",
    label: "Creation Date",
    order: ISortOrder.ASC,
    keyword: false,
  },
];

export enum ACTION {
  SET = "SET",
  ITEMS_CONTEXT = "ITEMS_CONTEXT",
  ITEMS_SELECT = "ITEM_SELECT",
  ITEMS_DESELECT = "ITEMS_DESELECT",
  ITEM_LAST_SELECTED_INDEX = "ITEM_LAST_SELECTED_INDEX",
  PAGINATION_SET_VALUE = "PAGINATION_SET_VALUE",
  PAGINATION_SET_SIZE = "PAGINATION_SET_SIZE",
  SORT_ORDER = "SORT_ORDER",
  SORT_ID = "SORT_ID",
  SHEET_LAYOUT = "SHEET_LAYOUT",
  RESET = "RESET",
  DETAILS = "DETAILS",
  FOLDER_OPEN = "FOLDER_OPEN",
  BREADCRUMB = "BREADCRUMB",
  KEYBOARD_DOWN = "KEYBOARD_DOWN",
  DOWNLOAD = "DOWNLOAD",
}

interface IReducerState {
  initializing: boolean;
  keyboardDown: number;
  items: IFileDetail[];
  itemsTotal: number;
  itemsIdSelected: string[];
  itemLastSelectedIndex: number;
  folders: IFolder[];
  sort: ISort;
  paginationValue: number;
  paginationSize: number;
  error: string;
  detailSheet: SheetLayout;
  assetDataId: string;
}

export const reducerInitState: IReducerState = {
  initializing: true,
  keyboardDown: -1,
  items: [],
  itemsTotal: 0,
  itemsIdSelected: [],
  itemLastSelectedIndex: 0,
  folders: [{ id: FOLDER_ROOT_ID, label: FOLDER_ROOT_LABEL }],
  sort: SORTS[0],
  paginationValue: 1,
  paginationSize: last(PAGINATIONS),
  error: "",
  detailSheet: SheetLayout.CLOSED,
  assetDataId: "",
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACTION.KEYBOARD_DOWN:
      newState.keyboardDown = action.key;
      return newState;
    case ACTION.ITEMS_CONTEXT: {
      const { id } = action;
      const selected = new Set(newState.itemsIdSelected).has(id);
      if (!selected) {
        newState.itemsIdSelected = [id];
        newState.assetDataId = id;
      }
      return newState;
    }
    case ACTION.ITEMS_SELECT:
      newState.itemsIdSelected = action.itemsIdSelected;
      newState.assetDataId = action.assetDataId;
      return newState;
    case ACTION.ITEMS_DESELECT:
      if (newState.detailSheet === SheetLayout.FULLSCREEN) {
        newState.detailSheet = SheetLayout.OPENED;
      }
      newState.itemsIdSelected = reducerInitState.itemsIdSelected;
      newState.assetDataId = reducerInitState.assetDataId;
      return newState;
    case ACTION.ITEM_LAST_SELECTED_INDEX:
      newState.itemLastSelectedIndex = action.payload;
      return newState;
    case ACTION.PAGINATION_SET_VALUE:
      newState.paginationValue = action.payload;
      return newState;
    case ACTION.PAGINATION_SET_SIZE:
      newState.paginationValue = 1;
      newState.paginationSize = action.payload;
      return newState;
    case ACTION.SORT_ORDER: {
      const newSort = { ...newState.sort };
      newSort.order =
        newSort.order === ISortOrder.ASC ? ISortOrder.DESC : ISortOrder.ASC;
      newState.sort = newSort;
      return newState;
    }
    case ACTION.SORT_ID: {
      const { id } = action;
      const newSort = SORTS.find((s) => s.id === id);
      newSort.order = newState.sort.order;
      newState.sort = newSort;
      return newState;
    }
    case ACTION.DETAILS:
      newState.detailSheet = SheetLayout.OPENED;
      return newState;
    case ACTION.SHEET_LAYOUT:
      newState.detailSheet = action.layout;
      if (action.layout === SheetLayout.FULLSCREEN) {
        newState.itemsIdSelected = [newState.assetDataId];
      }
      return newState;
    case ACTION.FOLDER_OPEN:
      newState.folders = action.value;
      newState.paginationSize = reducerInitState.paginationSize;
      newState.paginationValue = reducerInitState.paginationValue;
      newState.itemsIdSelected = reducerInitState.itemsIdSelected;
      newState.assetDataId = reducerInitState.assetDataId;
      return newState;
    case ACTION.BREADCRUMB:
      const { id } = action;
      const { folders } = newState;
      const indexToSlice = folders.findIndex((o) => o.id === `${id}`) + 1;
      const newFolders = folders.slice(0, indexToSlice);
      newState.folders = newFolders;
      newState.paginationSize = reducerInitState.paginationSize;
      newState.paginationValue = reducerInitState.paginationValue;
      newState.itemsIdSelected = reducerInitState.itemsIdSelected;
      newState.assetDataId = reducerInitState.assetDataId;
      return newState;
    case ACTION.DOWNLOAD: {
      const { items, itemsIdSelected } = newState;
      const file = items.find(({ id }) => id === itemsIdSelected[0]);
      const srcUrl = apiUrls.getRenditionPublic.url(
        location.search.replace("?link=", ""),
        file.documentRepoId
      );
      downloadMedia(file.name, srcUrl);
      return newState;
    }
    case ACTION.SET:
      const a: IUseResultEs = action;
      return {
        ...newState,
        initializing: false,
        ...a,
      };
    case ACTION.RESET:
      return reducerInitState;
    default:
      console.error(`no action ${action.type}`);
      return state;
  }
};

export default reducer;
