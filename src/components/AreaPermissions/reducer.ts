import { IPermissionData, SheetLayout } from "../../interfaces";

export enum ACT_VPORT {
  RESET = "RESET",
  SHEET_LAYOUT = "SHEET_LAYOUT",
  ITEMS_SET = "ITEMS_SET",
  ITEMS_SELECT = "ITEMS_SELECT",
  ITEMS_REFRESH = "ITEMS_REFRESH",
  ITEMS_SEARCH = "ITEMS_SEARCH",
}

interface IReducerState {
  selectedId: string;
  items: IPermissionData[];
  itemsRefresh: boolean;
  detailSheet: SheetLayout;
  searchInput: string;
}

export const reducerInitState: IReducerState = {
  selectedId: "",
  items: [],
  itemsRefresh: true,
  detailSheet: SheetLayout.CLOSED,
  searchInput: "",
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACT_VPORT.RESET:
      return reducerInitState;
    case ACT_VPORT.ITEMS_SELECT:
      newState.selectedId = action.value || reducerInitState.selectedId;
      return newState;
    case ACT_VPORT.SHEET_LAYOUT:
      newState.detailSheet = action.value;
      return newState;
    case ACT_VPORT.ITEMS_REFRESH:
      newState.itemsRefresh = true;
      return newState;
    case ACT_VPORT.ITEMS_SET:
      newState.itemsRefresh = false;
      newState.items = action.items
        .sort((a, b) => {
          if (a.owner > b.owner) return 1;
          if (a.owner < b.owner) return -1;
          return 0;
        })
        .sort((a, b) => {
          if (a.id > b.id) return 1;
          if (a.id < b.id) return -1;
          return 0;
        });
      return newState;
    case ACT_VPORT.ITEMS_SEARCH:
      newState.searchInput = action.value;
      return newState;
    default:
      return state;
  }
};

export default reducer;
