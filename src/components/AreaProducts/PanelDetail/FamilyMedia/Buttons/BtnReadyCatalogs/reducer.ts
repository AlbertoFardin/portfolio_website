import IMediaCatalog from "./IMediaCatalog";

export enum ACTION {
  RESET = "RESET",
  FETCH = "FETCH",
  MENU_CHANGE_ANCHOR = "MENU_CHANGE_ANCHOR",
  MENU_SELECT_CATALOGS = "MENU_SELECT_CATALOGS",
  CATALOGS_TO_ADD = "CATALOGS_TO_ADD",
  CATALOGS_TO_REMOVE = "CATALOGS_TO_REMOVE",
}

interface IReducerState {
  menuAnchor;
  loading: boolean;
  fetching: boolean;
  catalogsPendingToAdd: IMediaCatalog[];
  catalogsPendingToRemove: IMediaCatalog[];
}

export const reducerInitState = {
  menuAnchor: null,
  loading: false,
  fetching: false,
  catalogsPendingToAdd: [],
  catalogsPendingToRemove: [],
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACTION.FETCH:
      newState.fetching = true;
      return newState;
    case ACTION.MENU_CHANGE_ANCHOR:
      newState.menuAnchor = action.value;
      return newState;
    case ACTION.MENU_SELECT_CATALOGS:
      newState.menuAnchor = reducerInitState.menuAnchor;
      newState.loading = true;
      newState.catalogsPendingToAdd = action.toAdd;
      newState.catalogsPendingToRemove = action.toRemove;
      newState.loading = true;
      return newState;
    case ACTION.RESET:
      return reducerInitState;
    default:
      console.error(`no action ${action.type}`);
      return state;
  }
};

export default reducer;
