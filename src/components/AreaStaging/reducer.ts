import {
  IItemStagingArea,
  IContentSort,
  IColumnSc,
  IFilter,
  IHashItemsSets,
  HASH_ITEMSSSETS,
  IHashColumnsSets,
  HASH_COLUMNSSETS,
  SheetLayout,
  IItemEs,
  FiltersCondition,
} from "../../interfaces";
import { IColumnsSets } from "../../componentsBase/StickyGrid";
import {
  multiSelectCtrl,
  multiSelectShift,
} from "../../componentsBase/utils/grid";
import isEmpty from "lodash-es/isEmpty";
import { IUseResultEs } from "./useSearchEs";
import last from "lodash-es/last";
import getSortDefault from "../AreaProducts/getSortDefault";

export const PAGINATION_SIZES = [50, 100];

export enum ACT_VPORT {
  INIT = "INIT",
  SET = "SET",
  RESET = "RESET",
  PAGINATION_SET_VALUE = "PAGINATION_SET_VALUE",
  PAGINATION_SET_SIZE = "PAGINATION_SET_SIZE",
  HASHSETS_COLUMNS_SET = "HASHSETS_COLUMNS_SET",
  HASHSETS_COLUMNS_SET_DRAFT = "HASHSETS_COLUMNS_SET_DRAFT",
  HASHSETS_COLUMNS_SAVE = "HASHSETS_COLUMNS_SAVE",
  HASHSETS_FILTERS_SET = "HASHSETS_FILTERS_SET",
  HASHSETS_FILTERS_SAVE = "HASHSETS_FILTERS_SAVE",
  SORTS_DEFAULT_SET = "SORTS_DEFAULT_SET",
  SORTS_CONTENT_SET = "SORTS_CONTENT_SET",
  ITEMS_REMOVE = "ITEMS_REMOVE",
  UPDATEITEMS_CHECK = "",
  ITEMS_SELECT = "ITEMS_SELECT",
  ITEMS_SELECT_ALL = "ITEMS_SELECT_ALL",
  ITEMS_DESELECT = "ITEMS_DESELECT",
  ITEM_IMAGE_DOUBLECLICK = "ITEM_IMAGE_DOUBLECLICK",
  FILTERS_SET = "FILTERS_SET",
  FILTERS_CONDITION = "FILTERS_CONDITION",
  SHEET_LAYOUT = "SHEET_LAYOUT",
  SORT_CHECK_LOADING = "SORT_CHECK_LOADING",
  ROW_ITEM_CLICK = "ROW_ITEM_CLICK",
  LOAD_ONLY_SELECTED = "LOAD_ONLY_SELECTED",
  SNACKBAR_TO_UPDATE = "SNACKBAR_TO_UPDATE",
}

interface IReducerState {
  initialized: boolean;
  paginationValue: number;
  paginationSize: number;
  hashColumnsSets: IHashColumnsSets;
  columnsSetsDraft: IColumnsSets[];
  hashFiltersSets: IHashItemsSets;
  sortsContent: IContentSort[];
  sortsDefault: IContentSort[];
  sortsLoading: boolean;
  sortsToCheck: IContentSort[];
  columns: IColumnSc[];
  items: IItemEs<IItemStagingArea>[];
  itemsTotal: number;
  itemsIdSelected: string[];
  filters: IFilter[];
  filtersCondition: FiltersCondition;
  detailSheet: SheetLayout;
  loadOnlySelected: boolean;
  snackbarToUpdate: boolean;
}

export const reducerInitState: IReducerState = {
  initialized: false,
  paginationValue: 1,
  paginationSize: PAGINATION_SIZES[0],
  hashColumnsSets: HASH_COLUMNSSETS,
  columnsSetsDraft: [],
  hashFiltersSets: HASH_ITEMSSSETS,
  sortsContent: [],
  sortsDefault: [],
  sortsLoading: false,
  sortsToCheck: [],
  columns: [],
  items: [],
  itemsTotal: 0,
  itemsIdSelected: [],
  filters: [],
  filtersCondition: FiltersCondition.AND,
  detailSheet: SheetLayout.CLOSED,
  loadOnlySelected: false,
  snackbarToUpdate: false,
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };

  switch (action.type) {
    case ACT_VPORT.INIT:
      newState.columns = action.columns;
      newState.sortsContent = getSortDefault(newState.columns);
      newState.filters = action.filters;
      newState.hashColumnsSets = action.hashColumnsSets;
      newState.hashFiltersSets = action.hashFiltersSets;
      newState.initialized = true;
      return newState;
    case ACT_VPORT.SET:
      const a: IUseResultEs = action;
      return { ...newState, ...a, snackbarToUpdate: false };
    case ACT_VPORT.RESET:
      newState.paginationValue = reducerInitState.paginationValue;
      newState.itemsIdSelected = reducerInitState.itemsIdSelected;
      return newState;
    case ACT_VPORT.FILTERS_SET:
      newState.paginationValue = reducerInitState.paginationValue;
      newState.itemsIdSelected = reducerInitState.itemsIdSelected;
      newState.filters = action.payload;
      return newState;
    case ACT_VPORT.SHEET_LAYOUT:
      newState.detailSheet = action.layout;
      return newState;
    case ACT_VPORT.ITEMS_SELECT:
      newState.itemsIdSelected = action.ids;
      return newState;
    case ACT_VPORT.ITEMS_SELECT_ALL: {
      const setSelectedIds = new Set(newState.itemsIdSelected);
      const idsOld = newState.itemsIdSelected;
      const idsNew = newState.items.reduce((acc, { id }) => {
        if (!setSelectedIds.has(id)) acc.push(id);
        return acc;
      }, []);
      newState.itemsIdSelected = [].concat(idsOld, idsNew);
      return newState;
    }
    case ACT_VPORT.ITEMS_DESELECT:
      newState.itemsIdSelected = reducerInitState.itemsIdSelected;
      return newState;
    case ACT_VPORT.SORTS_CONTENT_SET:
      newState.sortsContent =
        action.payload && action.payload.length !== 0
          ? action.payload
          : getSortDefault(newState.columns);
      newState.sortsLoading = false;
      newState.sortsToCheck = [];
      return newState;
    case ACT_VPORT.SORTS_DEFAULT_SET:
      newState.sortsDefault = action.payload;
      return newState;
    case ACT_VPORT.HASHSETS_COLUMNS_SET:
      newState.hashColumnsSets = {
        hash: action.payload.hash,
        columsnSets: newState.hashColumnsSets.columsnSets,
        saving: false,
      };
      return newState;
    case ACT_VPORT.HASHSETS_COLUMNS_SAVE:
      if (!newState.hashColumnsSets.saving) {
        newState.hashColumnsSets = {
          hash: newState.hashColumnsSets.hash,
          columsnSets: action.payload,
          saving: true,
        };
      }
      return newState;
    case ACT_VPORT.HASHSETS_COLUMNS_SET_DRAFT:
      newState.columnsSetsDraft = action.columnsSetsDraft;
      return newState;
    case ACT_VPORT.HASHSETS_FILTERS_SET:
      newState.hashFiltersSets = action.payload;
      return newState;
    case ACT_VPORT.HASHSETS_FILTERS_SAVE:
      if (!newState.hashFiltersSets.saving) {
        newState.hashFiltersSets = {
          hash: newState.hashFiltersSets.hash,
          itemsSets: action.payload,
          saving: true,
        };
      }
      return newState;
    case ACT_VPORT.PAGINATION_SET_VALUE:
      newState.paginationValue = action.payload;
      return newState;
    case ACT_VPORT.PAGINATION_SET_SIZE:
      newState.paginationValue = 1;
      newState.paginationSize = action.payload;
      return newState;
    case ACT_VPORT.SORT_CHECK_LOADING:
      newState.sortsLoading = action.payload.loading;
      newState.sortsToCheck = action.payload.sorts;
      return newState;

    case ACT_VPORT.ROW_ITEM_CLICK:
      const { rowIndex, selected, keyCtrlDown, keyShiftDown } = action;
      const { items, itemsIdSelected } = newState;
      const rowData = items[rowIndex];
      const { id } = rowData;
      const itemData = items.find((i) => i.id === id);
      const itemIndex = items.findIndex((i) => i.id === id);
      const contentItemsSelected = itemsIdSelected.map((i) => ({ id: i }));

      const indexItemSelected =
        items.findIndex(({ id }) => id === last(itemsIdSelected)) || 0;

      let itemsSel = [];
      // multi selection with shift
      if (keyShiftDown) {
        itemsSel = multiSelectShift({
          indexItemSelected,
          indexItemClick: itemIndex,
          itemsSelected: contentItemsSelected,
          items: items,
        });
        // multi selection with ctrl
      } else if (keyCtrlDown) {
        itemsSel = multiSelectCtrl({
          itemsSelected: contentItemsSelected,
          items: items,
          selected: selected,
          data: itemData,
        });
      } else {
        // single selection
        itemsSel = [itemData];
      }

      if (isEmpty(itemsSel)) {
        newState.itemsIdSelected = reducerInitState.itemsIdSelected;
        return newState;
      } else {
        newState.itemsIdSelected = itemsSel.map((i) => i.id);
        return newState;
      }
    case ACT_VPORT.ITEMS_REMOVE:
      const setIdsToDelete = new Set(action.ids);
      newState.items = newState.items.filter((i) => !setIdsToDelete.has(i.id));
      newState.itemsIdSelected = [];
      return newState;
    case ACT_VPORT.LOAD_ONLY_SELECTED:
      newState.loadOnlySelected = !newState.loadOnlySelected;
      newState.paginationSize = reducerInitState.paginationSize;
      newState.paginationValue = reducerInitState.paginationValue;
      return newState;
    case ACT_VPORT.SNACKBAR_TO_UPDATE:
      newState.snackbarToUpdate = action.value;
      return newState;
    case ACT_VPORT.FILTERS_CONDITION:
      newState.itemsIdSelected = reducerInitState.itemsIdSelected;
      newState.paginationValue = reducerInitState.paginationValue;
      newState.filtersCondition = action.value;
      return newState;
    default:
      console.error(`no action ${action.type}`);
      return state;
  }
};

export default reducer;
