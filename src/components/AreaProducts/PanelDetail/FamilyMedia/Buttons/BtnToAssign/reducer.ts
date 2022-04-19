import getAssignments from "./getAssignments";

export enum ACTION {
  SETUP = "SETUP",
  APPLY = "APPLY",
  RESET = "RESET",
  INPUT = "INPUT",
  CLICK_USER_ID = "CLICK_USER_ID",
  LOADING_STARTED = "LOADING_STARTED",
  LOADING_STOPPED = "LOADING_STOPPED",
}

interface IReducerState {
  setup: boolean;
  apply: boolean;
  loading: boolean;
  inputSearch: string;
  selectedIds: string[];
}

export const reducerInitState = {
  setup: false,
  apply: false,
  loading: false,
  inputSearch: "",
  selectedIds: [],
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACTION.LOADING_STARTED:
      newState.loading = true;
      return newState;
    case ACTION.LOADING_STOPPED:
      newState.loading = false;
      newState.apply = false;
      return newState;
    case ACTION.CLICK_USER_ID:
      const array = Array.from(newState.selectedIds);
      const index = array.findIndex((id) => id === action.id);
      if (index === -1) {
        array.push(action.id);
      } else {
        array.splice(index, 1);
      }
      newState.selectedIds = array;
      return newState;
    case ACTION.INPUT:
      newState.inputSearch = action.value;
      return newState;
    case ACTION.SETUP:
      newState.setup = true;
      newState.selectedIds = getAssignments(
        action.assetData,
        action.viewName
      ).map(({ assignee }) => assignee);
      return newState;
    case ACTION.APPLY:
      newState.apply = true;
      return newState;
    case ACTION.RESET:
      return reducerInitState;
    default:
      console.error(`no action ${action.type}`);
      return state;
  }
};

export default reducer;
