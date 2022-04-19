import {
  IFilter,
  IFile,
  ISort,
  FiltersCondition,
  SheetLayout,
  IAggregation,
  IPath,
} from "../../interfaces";
import downloadMedia from "../../utils/downloadMedia";
import last from "lodash-es/last";
import concat from "lodash-es/concat";
import { ISortOrder } from "../../componentsBase/StickyGrid";
import { ISearchFilesResult } from "./useSearchFiles/ISearch";
import isEmpty from "lodash-es/isEmpty";
import {
  multiSelectCtrl,
  multiSelectShift,
} from "../../componentsBase/utils/grid";
import {
  PAGINATIONS,
  SORTS,
  FILTERS,
  FOLDER_MYFILE,
  FOLDER_SHARED,
  ROOT_SHARED_ID,
} from "./constants";
import apiUrls from "../../api/endpoints";

export enum ACT_VPORT {
  REFRESH = "REFRESH",
  SET = "SET",
  ITEMS_SELECT_ALL = "ITEMS_SELECT_ALL",
  ITEMS_SELECT = "ITEMS_SELECT",
  ITEMS_DESELECT = "ITEMS_DESELECT",
  PAGINATION_SET_VALUE = "PAGINATION_SET_VALUE",
  PAGINATION_SET_SIZE = "PAGINATION_SET_SIZE",
  SORT_ORDER = "SORT_ORDER",
  SORT_ID = "SORT_ID",
  SHEET_LAYOUT = "SHEET_LAYOUT",
  FOLDER_NAVIGATE = "FOLDER_NAVIGATE",
  FILTERS_SET = "FILTERS_SET",
  FILTER_CHANGE = "FILTER_CHANGE",
  CHANGE_FILTERING_CONDITIONS = "CHANGE_FILTERING_CONDITIONS",
  CHANGE_FILTERING_THISFOLDER = "CHANGE_FILTERING_THISFOLDER",
  CUTTED = "CUTTED",
  PASTED = "PASTED",
  MODAL_CREATE_FOLDER = "MODAL_CREATE_FOLDER",
  MODAL_DELETE = "MODAL_DELETE",
  MODAL_RENAME = "MODAL_RENAME",
  MODAL_SHARE_LINK = "MODAL_SHARE_LINK",
  MODAL_SHARE_PRIVATE = "MODAL_SHARE_PRIVATE",
  MODAL_COPYRIGHT = "MODAL_COPYRIGHT",
  MODAL_TAG = "MODAL_TAG",
  DETAILS = "DETAILS",
  DOWNLOAD = "DOWNLOAD",
  DOWNLOAD_FILES = "DOWNLOAD_FILES",
  DOWNLOAD_RESET = "DOWNLOAD_RESET",
  TAG_MANAGEMENT = "TAG_MANAGEMENT",
  WB_IDS_TO_UPDATE = "WB_IDS_TO_UPDATE",
}

export interface IDownloadItem {
  id: string;
  documentRepoId: string;
  path: { id: string; name: string }[];
  name?: string;
  mimeType?: string;
}

interface IReducerState {
  refreshTime: number;
  items: IFile[];
  itemsTotal: number;
  itemsIdSelected: string[];
  downloadItems: IDownloadItem[];
  cuttedFile: IFile[];
  cuttedPath: string;
  pastingItems: boolean;
  filters: IFilter[];
  filtersConditions: FiltersCondition;
  filtersThisFolder: boolean;
  path: IPath[];
  sort: ISort;
  paginationValue: number;
  paginationSize: number;
  modalCreateFolder: boolean;
  modalDelete: boolean;
  modalRename: boolean;
  modalShareLink: boolean;
  modalSharePrivate: boolean;
  modalCopyright: boolean;
  modalTag: boolean;
  modalTagManagement: boolean;
  detailSheet: SheetLayout;
}

export const reducerInitState: IReducerState = {
  refreshTime: 0,
  items: [],
  itemsTotal: 0,
  itemsIdSelected: [],
  downloadItems: [],
  cuttedFile: [],
  cuttedPath: "",
  pastingItems: false,
  filters: FILTERS,
  filtersConditions: FiltersCondition.AND,
  filtersThisFolder: false,
  path: [],
  sort: SORTS[0],
  paginationValue: 1,
  paginationSize: last(PAGINATIONS),
  modalCreateFolder: false,
  modalDelete: false,
  modalRename: false,
  modalShareLink: false,
  modalSharePrivate: false,
  modalCopyright: false,
  modalTag: false,
  modalTagManagement: false,
  detailSheet: SheetLayout.CLOSED,
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACT_VPORT.REFRESH:
      newState.refreshTime = new Date().getTime();
      if (!isEmpty(action.ids)) {
        newState.itemsIdSelected = action.ids;
      }
      return newState;
    case ACT_VPORT.ITEMS_SELECT_ALL:
      newState.itemsIdSelected = newState.items.map(({ id }) => id);
      return newState;
    case ACT_VPORT.ITEMS_SELECT: {
      const { items, itemsIdSelected } = newState;
      const { itemId, keyCtrlDown, keyShiftDown } = action;
      const assetDataId = last(itemsIdSelected);

      const indexItemClick = items.findIndex((i) => i.id === itemId);
      const indexItemSelected = items.findIndex((i) => i.id === assetDataId);
      const contentItemsSelected = itemsIdSelected.map((i) => ({ id: i }));
      let newItemsIdSel: string[] = [itemId];

      if (keyShiftDown) {
        newItemsIdSel = multiSelectShift({
          indexItemSelected,
          indexItemClick,
          itemsSelected: contentItemsSelected,
          items,
        }).map((i: IFile) => i.id);
      }

      if (keyCtrlDown) {
        newItemsIdSel = multiSelectCtrl({
          itemsSelected: contentItemsSelected,
          items,
          selected: !!itemsIdSelected.find((i) => i === itemId),
          data: items.find((i) => i.id === itemId),
        }).map((i: IFile) => i.id);
      }

      newState.itemsIdSelected = newItemsIdSel;
      return newState;
    }
    case ACT_VPORT.ITEMS_DESELECT:
      if (newState.detailSheet === SheetLayout.FULLSCREEN) {
        newState.detailSheet = SheetLayout.OPENED;
      }
      newState.itemsIdSelected = reducerInitState.itemsIdSelected;
      return newState;
    case ACT_VPORT.PAGINATION_SET_VALUE:
      newState.paginationValue = action.payload;
      return newState;
    case ACT_VPORT.PAGINATION_SET_SIZE:
      newState.paginationValue = 1;
      newState.paginationSize = action.payload;
      return newState;
    case ACT_VPORT.CHANGE_FILTERING_CONDITIONS: {
      newState.itemsIdSelected = reducerInitState.itemsIdSelected;
      newState.paginationValue = reducerInitState.paginationValue;
      newState.paginationSize = reducerInitState.paginationSize;
      newState.filtersConditions = action.payload;
      return newState;
    }
    case ACT_VPORT.CHANGE_FILTERING_THISFOLDER: {
      newState.itemsIdSelected = reducerInitState.itemsIdSelected;
      newState.paginationValue = reducerInitState.paginationValue;
      newState.paginationSize = reducerInitState.paginationSize;
      newState.filtersThisFolder = action.payload;
      return newState;
    }
    case ACT_VPORT.FILTERS_SET:
      newState.path = reducerInitState.path;
      newState.filters = action.payload;
      newState.itemsIdSelected = reducerInitState.itemsIdSelected;
      newState.paginationValue = reducerInitState.paginationValue;
      newState.paginationSize = reducerInitState.paginationSize;
      return newState;
    case ACT_VPORT.FILTER_CHANGE:
      newState.path = reducerInitState.path;
      newState.itemsIdSelected = reducerInitState.itemsIdSelected;
      newState.paginationValue = reducerInitState.paginationValue;
      newState.paginationSize = reducerInitState.paginationSize;
      newState.filters = newState.filters.map((f) => {
        return action.payload.id !== f.id
          ? f
          : {
              ...f,
              ...action.payload,
            };
      });
      return newState;
    case ACT_VPORT.SORT_ORDER: {
      const newSort = { ...newState.sort };
      newSort.order =
        newSort.order === ISortOrder.ASC ? ISortOrder.DESC : ISortOrder.ASC;
      newState.sort = newSort;
      newState.items = reducerInitState.items;
      newState.itemsTotal = reducerInitState.itemsTotal;
      newState.paginationValue = reducerInitState.paginationValue;
      newState.paginationSize = reducerInitState.paginationSize;
      return newState;
    }
    case ACT_VPORT.SORT_ID: {
      const { id } = action;
      const newSort = SORTS.find((s) => s.id === id);
      newSort.order = newState.sort.order;
      newState.sort = newSort;
      return newState;
    }
    case ACT_VPORT.SHEET_LAYOUT:
      newState.detailSheet = action.layout;
      return newState;
    case ACT_VPORT.SET: {
      const {
        queryUserId,
        queryPathId,
        items,
        total,
        path,
        aggregations,
      }: ISearchFilesResult = action.data;

      const isSharedWithMe =
        queryPathId === ROOT_SHARED_ID ||
        (!isEmpty(path) && path[0].owner !== queryUserId);
      const pathBase = isSharedWithMe ? FOLDER_SHARED : FOLDER_MYFILE;

      newState.path = concat(pathBase, path);
      newState.items = items;
      newState.itemsTotal = total;
      newState.filters = newState.filters.map((f) => {
        const aggs: IAggregation = aggregations.find((a) => a.id === f.id) || {
          id: "",
          items: [],
          sum_other_doc_count: 0,
        };
        return {
          ...f,
          aggs: aggs.items,
          aggsMore: aggs.sum_other_doc_count,
        };
      });
      return newState;
    }
    case ACT_VPORT.CUTTED:
      newState.cuttedFile = newState.itemsIdSelected.map((id) => {
        return newState.items.find((i) => i.id === id);
      });
      newState.cuttedPath = last(newState.path).id;
      return newState;
    case ACT_VPORT.PASTED:
      if (action.ids) {
        newState.pastingItems = reducerInitState.pastingItems;
        newState.cuttedFile = reducerInitState.cuttedFile;
        newState.cuttedPath = reducerInitState.cuttedPath;
        newState.itemsIdSelected = action.ids;
        newState.refreshTime = new Date().getTime();
      } else {
        newState.pastingItems = true;
      }
      return newState;
    case ACT_VPORT.MODAL_CREATE_FOLDER:
      if (action.refresh) {
        newState.refreshTime = new Date().getTime();
        newState.modalCreateFolder = false;
      } else {
        newState.modalCreateFolder = !newState.modalCreateFolder;
      }
      return newState;
    case ACT_VPORT.MODAL_COPYRIGHT:
      newState.modalCopyright = !newState.modalCopyright;
      return newState;
    case ACT_VPORT.MODAL_RENAME:
      if (action.refresh) {
        newState.refreshTime = new Date().getTime();
        newState.modalRename = false;
      } else {
        newState.modalRename = !newState.modalRename;
      }
      return newState;
    case ACT_VPORT.MODAL_DELETE:
      if (action.refresh) {
        newState.refreshTime = new Date().getTime();
        newState.itemsIdSelected = reducerInitState.itemsIdSelected;
        newState.modalDelete = false;
      } else {
        newState.modalDelete = !newState.modalDelete;
      }
      return newState;
    case ACT_VPORT.MODAL_SHARE_LINK:
      newState.modalShareLink = !newState.modalShareLink;
      newState.itemsIdSelected = action.ids || newState.itemsIdSelected;
      // alla chiusura della modela effettuo il refresh del content dell'Area
      if (!newState.modalShareLink) {
        newState.refreshTime = new Date().getTime();
        if (!isEmpty(action.ids)) {
          newState.itemsIdSelected = action.ids;
        }
      }
      return newState;
    case ACT_VPORT.MODAL_SHARE_PRIVATE:
      if (action.ids) {
        newState.itemsIdSelected = action.ids;
      }
      if (action.refresh) {
        newState.refreshTime = new Date().getTime();
        newState.modalSharePrivate = false;
      } else {
        newState.modalSharePrivate = !newState.modalSharePrivate;
      }
      return newState;
    case ACT_VPORT.MODAL_TAG:
      newState.modalTag = !newState.modalTag;
      return newState;
    case ACT_VPORT.DETAILS:
      newState.detailSheet = SheetLayout.OPENED;
      return newState;
    case ACT_VPORT.DOWNLOAD: {
      const { items, itemsIdSelected } = newState;
      const file = items.find(({ id }) => id === itemsIdSelected[0]);
      const srcUrl = apiUrls.getDownloadDAMedia.url(file.documentRepoId);
      downloadMedia(file.name, srcUrl);
      return newState;
    }
    case ACT_VPORT.DOWNLOAD_FILES:
      newState.downloadItems = newState.itemsIdSelected.reduce(
        (acc: IDownloadItem[], c) => {
          const file = newState.items.find((i) => i.id === c);
          const { id, documentRepoId, mimeType, name } = file;
          acc.push({
            id,
            documentRepoId,
            name,
            mimeType,
            path: newState.path,
          });
          return acc;
        },
        []
      );
      return newState;
    case ACT_VPORT.DOWNLOAD_RESET:
      newState.downloadItems = reducerInitState.downloadItems;
      return newState;
    case ACT_VPORT.FOLDER_NAVIGATE:
      newState.refreshTime = new Date().getTime();
      newState.items = reducerInitState.items;
      newState.itemsTotal = reducerInitState.itemsTotal;
      newState.itemsIdSelected = reducerInitState.itemsIdSelected;
      newState.filters = reducerInitState.filters;
      newState.paginationValue = reducerInitState.paginationValue;
      newState.paginationSize = reducerInitState.paginationSize;
      return newState;
    case ACT_VPORT.WB_IDS_TO_UPDATE: {
      const itemIdsToUpdate = new Set(action.ids as string[]);
      const areItemsInContent = !!newState.items.find(({ id }) => {
        return itemIdsToUpdate.has(id);
      });
      if (areItemsInContent) newState.refreshTime = new Date().getTime();
      return newState;
    }
    case ACT_VPORT.TAG_MANAGEMENT:
      newState.modalTagManagement = !newState.modalTagManagement;
      return newState;
    default:
      console.error(`no action ${action.type}`);
      return state;
  }
};

export default reducer;
