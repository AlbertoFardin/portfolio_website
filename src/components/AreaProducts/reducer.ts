import {
  IProduct,
  IContentSort,
  IColumnSc,
  IFilter,
  IHashItemsSets,
  HASH_ITEMSSSETS,
  ICatalog,
  IHashColumnsSets,
  HASH_COLUMNSSETS,
  IMenuViewReadys,
  IMenuViewAssegnees,
  SheetLayout,
  AttributeFamily,
  IItemEs,
  ICategory,
  IViewConf,
  IColumnsOrderedSet,
  FiltersCondition,
} from "../../interfaces";
import {
  SHOW_MEDIAREADY,
  KEY_ROOT_ID,
  MAX_PRODUCTS_MASSIVE_ACTIONS,
} from "../../constants";
import updateContentItems, {
  UpdateActions,
} from "../../utils/updateContentItems";
import { getCookieBoolean } from "../../componentsBase/utils/cookie";
import { IColumnsSets } from "../../componentsBase/StickyGrid";
import {
  multiSelectCtrl,
  multiSelectShift,
} from "../../componentsBase/utils/grid";
import isEmpty from "lodash-es/isEmpty";
import { IUseResultEs } from "./useSearchEs/ISearch";
import last from "lodash-es/last";
import { NO_VALUE } from "./getSearchString";
import Cookies from "js-cookie";
import getSortDefault from "./getSortDefault";

export const PAGINATION_SIZES = [100, 250, MAX_PRODUCTS_MASSIVE_ACTIONS];

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
  HASHSETS_FIELDS_PANEL_DETAILS_SAVE = "HASHSETS_FIELDS_PANEL_DETAILS_SAVE",
  HASHSETS_FIELDS_PANEL_DETAILS_SET = "HASHSETS_FIELDS_PANEL_DETAILS_SET",
  SORTS_DEFAULT_SET = "SORTS_DEFAULT_SET",
  SORTS_CONTENT_SET = "SORTS_CONTENT_SET",
  MENU_VIEW_READYS = "MENU_VIEW_READYS",
  MENU_VIEW_ASSIGNEES = "MENU_VIEW_ASSIGNEES",
  ITEMS_TO_UPDATE_FROM_ES = "ITEMS_TO_UPDATE_FROM_ES",
  ITEMS_UPDATED_FROM_ES = "ITEMS_UPDATED_FROM_ES",
  ITEMS_UPDATING = "ITEMS_UPDATING",
  ITEMS_REMOVE = "ITEMS_REMOVE",
  UPDATEITEMS_CHECK = "",
  ITEMS_SELECT = "ITEMS_SELECT",
  ITEMS_SELECT_ALL = "ITEMS_SELECT_ALL",
  ITEMS_DESELECT = "ITEMS_DESELECT",
  CATALOGS_UPDATE = "CATALOGS_UPDATE",
  CATALOGS_SELECT = "CATALOGS_SELECT",
  FILTERS_SET = "FILTERS_SET",
  FILTERS_CONDITION = "FILTERS_CONDITION",
  DETAIL_ANNOTATIONS_UNRESOLVED = "DETAIL_ANNOTATIONS_UNRESOLVED",
  DETAIL_ANNOTATIONS_LOADED = "DETAIL_ANNOTATIONS_LOADED",
  SORT_CHECK_LOADING = "SORT_CHECK_LOADING",
  GRID_SHOW_MEDIA_READY = "GRID_SHOW_MEDIA_READY",
  ROW_ITEM_CLICK = "ROW_ITEM_CLICK",
  LOAD_ONLY_SELECTED = "LOAD_ONLY_SELECTED",
  UPDATE_QUERY_STATE = "UPDATE_QUERY_STATE",
  SELECT_ITEM_MAX = "SELECT_ITEM_MAX",
}

interface IReducerState {
  initialized: boolean;
  menuViewReadys: IMenuViewReadys;
  menuViewAssegnees: IMenuViewAssegnees;
  paginationValue: number;
  paginationSize: number;
  hashColumnsSets: IHashColumnsSets;
  columnsSetsDraft: IColumnsSets[];
  hashFiltersSets: IHashItemsSets;
  hashFieldsPanelDetailsSet: IHashItemsSets;
  sortsContent: IContentSort[];
  sortsDefault: IContentSort[];
  sortsLoading: boolean;
  sortsToCheck: IContentSort[];
  views: IViewConf[];
  columns: IColumnSc[];
  gridShowMediaReady: boolean;
  items: IProduct[];
  itemsTotal: number;
  itemsIdSelected: string[];
  itemsIdToUpdateFromES: string[];
  categories: IItemEs<ICategory>[];
  catalogs: ICatalog[];
  catalogId: string;
  languageId: string;
  filters: IFilter[];
  filtersCondition: FiltersCondition;
  loadOnlySelected: boolean;
  detailImgId: string; // deriva dalla query
  detailSheet: SheetLayout; // deriva dalla query
  detailTabId: string; // deriva dalla query
  selectingMaxItems: boolean; // deriva dalla query
}

export const reducerInitState: IReducerState = {
  initialized: false,
  menuViewReadys: {
    open: false,
    positionTop: 0,
    positionLeft: 0,
    contentsCatalogs: [],
    contentsPublication: [],
    contentsReady: [],
    mediaId: "",
  },
  menuViewAssegnees: {
    open: false,
    positionTop: 0,
    positionLeft: 0,
    viewAssegnees: [],
    viewDetail: null,
    item: null,
  },
  paginationValue: 1,
  paginationSize: PAGINATION_SIZES[0],
  hashColumnsSets: HASH_COLUMNSSETS,
  columnsSetsDraft: [],
  hashFiltersSets: HASH_ITEMSSSETS,
  hashFieldsPanelDetailsSet: HASH_ITEMSSSETS,
  sortsContent: [],
  sortsDefault: [],
  sortsLoading: false,
  sortsToCheck: [],
  views: [],
  columns: [],
  gridShowMediaReady: getCookieBoolean(SHOW_MEDIAREADY),
  items: [],
  itemsTotal: 0,
  itemsIdSelected: [],
  itemsIdToUpdateFromES: [],
  categories: [],
  catalogs: [],
  catalogId: "",
  languageId: "",
  filters: [],
  filtersCondition: FiltersCondition.AND,
  loadOnlySelected: false,
  detailImgId: NO_VALUE,
  detailSheet: SheetLayout.CLOSED,
  detailTabId: AttributeFamily.MASTER,
  selectingMaxItems: false,
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };

  switch (action.type) {
    case ACT_VPORT.INIT:
      newState.categories = action.categories;
      newState.catalogs = action.catalogs;
      newState.columns = action.columns;
      newState.filters = action.filters;
      newState.views = action.views;
      newState.hashColumnsSets = action.hashColumnsSets;
      newState.hashFiltersSets = action.hashFiltersSets;
      newState.hashFieldsPanelDetailsSet = action.hashFieldsPanelDetailsSet;

      const currentColumnSet = (action.hashColumnsSets
        .columsnSets as IColumnsOrderedSet[]).find((col) => col.active);

      newState.sortsContent =
        currentColumnSet.itemSorts && currentColumnSet.itemSorts.length !== 0
          ? currentColumnSet.itemSorts.map((s) => ({
              id: s.id,
              order: s.order,
              label: newState.columns.find(({ id }) => id === s.id).label,
            }))
          : getSortDefault(newState.columns);

      newState.initialized = true;
      return newState;
    case ACT_VPORT.SET:
      const a: IUseResultEs = action;
      return { ...newState, ...a };
    case ACT_VPORT.RESET:
      return reducerInitState;
    case ACT_VPORT.FILTERS_SET:
      newState.paginationValue = reducerInitState.paginationValue;
      newState.filters = action.payload;
      return newState;
    case ACT_VPORT.ITEMS_TO_UPDATE_FROM_ES: {
      const { items, itemsIdToUpdateFromES } = newState;
      const itemsWs = action.itemsWs as Array<{ id: string; version: number }>;
      const setItemsIdToUpdate = new Set(itemsIdToUpdateFromES);
      const newItemsIdToUpdate = items
        .filter((o: IProduct) => {
          // check if the item root id match with websocket payload id
          // the UI must update all items and their aggregates
          // EXAMPLE:
          // for notification id:"product://03wQdhpgGekH9OtW/"
          // the UI must update:
          // * product://03wQdhpgGekH9OtW/
          // * product://03wQdhpgGekH9OtW/color:111
          // * product://03wQdhpgGekH9OtW/color:111/size:L
          // * product://03wQdhpgGekH9OtW/color:222

          const id = o.id;
          const idRoot = o[KEY_ROOT_ID];

          const itemWs = itemsWs.find((x) => x.id === id || x.id === idRoot);
          const inUpdatingIdRoot = setItemsIdToUpdate.has(idRoot);
          const inUpdatingId = setItemsIdToUpdate.has(id);

          return !inUpdatingId && !inUpdatingIdRoot && !!itemWs;
        })
        .map((o: IProduct) => o.id);

      // nothing to update - return state to avoid rerender
      if (isEmpty(newItemsIdToUpdate)) return state;

      newState.itemsIdToUpdateFromES = [].concat(
        itemsIdToUpdateFromES,
        newItemsIdToUpdate
      );
      return newState;
    }
    case ACT_VPORT.ITEMS_UPDATED_FROM_ES: {
      // 1 - update items
      const { newItems } = action;
      const payload = updateContentItems({
        newItems,
        items: newState.items,
        itemsTotal: newState.itemsTotal,
        action: UpdateActions.UPDATE,
      });

      newState.items = payload.items;
      newState.itemsTotal = payload.total;

      // 2 - update itemsIdToUpdateFromES
      const newItemsToUpdate = Array.from(newState.itemsIdToUpdateFromES);
      newItems.forEach((n: IProduct) => {
        // update itemsIdToUpdateFromES removing update items from array
        const index = newItemsToUpdate.findIndex((o) => n[KEY_ROOT_ID] === o);
        if (index !== -1) newItemsToUpdate.splice(index, 1);
      });
      newState.itemsIdToUpdateFromES = newItemsToUpdate.filter((o) => {
        // update itemsIdToUpdateFromES removing id of items not visibled in Grid
        return newState.items.find((c) => c[KEY_ROOT_ID] === o);
      });
      return newState;
    }
    case ACT_VPORT.ITEMS_SELECT:
      newState.itemsIdSelected = action.ids;
      return newState;
    case ACT_VPORT.ITEMS_SELECT_ALL: {
      const setSelectedIds = new Set(
        newState.itemsIdSelected.concat(newState.items.map((i) => i.id))
      );
      newState.itemsIdSelected = Array.from(setSelectedIds);
      return newState;
    }
    case ACT_VPORT.ITEMS_DESELECT:
      newState.itemsIdSelected = reducerInitState.itemsIdSelected;
      return newState;
    case ACT_VPORT.CATALOGS_UPDATE:
      newState.catalogs = action.payload;
      return newState;
    case ACT_VPORT.CATALOGS_SELECT:
      // applico la nuova selezione di catalogo e lingua
      newState.catalogId = action.catalogId || reducerInitState.catalogId;
      newState.languageId = action.languageId || reducerInitState.languageId;

      // rimuovo i filtraggi multiCatalog e multiLanguage
      newState.filters = newState.filters.map((f) =>
        !f.multiCatalog && !f.multiLanguage ? f : { ...f, value: undefined }
      );
      // rimuovo gli ordinamenti multiCatalog e multiLanguage
      newState.sortsContent = newState.sortsContent.filter((s) => {
        const column = newState.columns.find((c) => c.id === s.id);
        return !column.multiCatalog && !column.multiLanguage;
      });

      return newState;
    case ACT_VPORT.MENU_VIEW_READYS:
      newState.menuViewReadys = action.reset
        ? reducerInitState.menuViewReadys
        : action.data;
      return newState;
    case ACT_VPORT.MENU_VIEW_ASSIGNEES:
      newState.menuViewAssegnees = action.reset
        ? reducerInitState.menuViewAssegnees
        : action.data;
      return newState;
    case ACT_VPORT.SORTS_CONTENT_SET:
      newState.sortsContent =
        action.payload && action.payload.length !== 0
          ? action.payload
          : getSortDefault(newState.columns);
      newState.hashColumnsSets.saving = true;
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
      newState.hashFiltersSets = {
        hash: action.payload.hash,
        itemsSets: newState.hashFiltersSets.itemsSets,
        saving: false,
      };
      return newState;
    case ACT_VPORT.HASHSETS_FIELDS_PANEL_DETAILS_SET:
      newState.hashFieldsPanelDetailsSet = {
        hash: action.payload.hash,
        itemsSets: newState.hashFieldsPanelDetailsSet.itemsSets,
        saving: false,
      };
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
    case ACT_VPORT.HASHSETS_FIELDS_PANEL_DETAILS_SAVE:
      if (!newState.hashFieldsPanelDetailsSet.saving) {
        newState.hashFieldsPanelDetailsSet = {
          hash: newState.hashFieldsPanelDetailsSet.hash,
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
    case ACT_VPORT.DETAIL_ANNOTATIONS_UNRESOLVED:
      const { mapViewMediasUnresolvedAnnotations, itemId } = action;
      const item = newState.items.find((i) => i.id === itemId);
      item.media &&
        item.media.forEach((m) => {
          if (
            mapViewMediasUnresolvedAnnotations[m.view] &&
            mapViewMediasUnresolvedAnnotations[m.view][m.fileId] !== undefined
          )
            m.annotationsResolved = !mapViewMediasUnresolvedAnnotations[m.view][
              m.fileId
            ];
        });
      return newState;
    case ACT_VPORT.DETAIL_ANNOTATIONS_LOADED: {
      const { annotations, fileId, itemId, fileIdResolved } = action;
      const item = newState.items.find((item) => item.id === itemId);
      // set new annotations for media with fileId
      if (item) {
        const media = item.media.find((m) => m.fileId === fileId);
        media.annotations = annotations;
        media.annotationsResolved = undefined;

        if (fileIdResolved.length) {
          fileIdResolved.forEach(({ fileId, resolved }) => {
            const mediaAnnotated = item.media.find((m) => m.fileId === fileId);
            if (mediaAnnotated) mediaAnnotated.annotationsResolved = resolved;
          });
        }
      }
      return newState;
    }
    case ACT_VPORT.GRID_SHOW_MEDIA_READY:
      newState.gridShowMediaReady = action.value;
      Cookies.set(SHOW_MEDIAREADY, action.value);
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
      } else {
        newState.itemsIdSelected = itemsSel.map((i) => i.id);
      }

      return newState;
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
    case ACT_VPORT.UPDATE_QUERY_STATE: {
      newState.detailSheet = action.detailSheet || SheetLayout.CLOSED;
      newState.detailTabId = action.detailTabId;
      newState.detailImgId = action.detailImgId;
      const newId = action.assetDataId;
      if (
        !!newId &&
        newId !== NO_VALUE &&
        !new Set(newState.itemsIdSelected).has(newId)
      ) {
        newState.itemsIdSelected = [newId];
      }
      return newState;
    }
    case ACT_VPORT.SELECT_ITEM_MAX:
      newState.selectingMaxItems = action.selectingMaxItems;
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
