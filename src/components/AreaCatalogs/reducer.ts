import { ICatalog, SheetLayout } from "../../interfaces";

export enum ACT_VPORT {
  REFRESH = "REFRESH",
  ITEMS_UPDATE = "ITEMS_UPDATE",
  ITEMS_SELECT = "ITEMS_SELECT",
  ITEMS_DESELECT = "ITEMS_DESELECT",
  SHEET_LAYOUT = "SHEET_LAYOUT",
  SEARCH = "SEARCH",
}

interface IReducerState {
  loading: boolean;
  items: ICatalog[];
  itemsIdSelected: string[];
  detailSheet: SheetLayout;
  searchInput: string;
}

export const reducerInitState: IReducerState = {
  loading: true,
  items: [],
  itemsIdSelected: [],
  detailSheet: SheetLayout.CLOSED,
  searchInput: "",
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
    default:
      console.error(`no action ${action.type}`);
      return state;
  }
};

export default reducer;
