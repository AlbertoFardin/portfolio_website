import { IItemEs, ICategory, SheetLayout } from "../../interfaces";

export enum ACT_VPORT {
  REFRESH = "REFRESH",
  ITEMS_UPDATE = "ITEMS_UPDATE",
  ITEMS_SELECT = "ITEMS_SELECT",
  ITEMS_DESELECT = "ITEMS_DESELECT",
  SHEET_LAYOUT = "SHEET_LAYOUT",
  SEARCH = "SEARCH",
  LANGUAGE = "LANGUAGE",
}

interface IReducerState {
  loading: boolean;
  items: IItemEs<ICategory>[];
  itemsIdSelected: string[];
  detailSheet: SheetLayout;
  searchInput: string;
  language: string;
}

export const reducerInitState: IReducerState = {
  loading: true,
  items: [],
  itemsIdSelected: [],
  detailSheet: SheetLayout.CLOSED,
  searchInput: "",
  language: "en",
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACT_VPORT.REFRESH:
      newState.loading = true;
      return newState;
    case ACT_VPORT.ITEMS_UPDATE:
      newState.loading = false;
      newState.items = action.items;
      return newState;
    case ACT_VPORT.ITEMS_SELECT:
      newState.itemsIdSelected = action.ids;
      return newState;
    case ACT_VPORT.ITEMS_DESELECT:
      newState.itemsIdSelected = reducerInitState.itemsIdSelected;
      return newState;
    case ACT_VPORT.SHEET_LAYOUT:
      newState.detailSheet = action.layout;
      return newState;
    case ACT_VPORT.SEARCH:
      newState.searchInput = action.value;
      return newState;
    case ACT_VPORT.LANGUAGE:
      newState.language = action.value;
      return newState;
    default:
      console.error(`no action ${action.type}`);
      return state;
  }
};

export default reducer;
