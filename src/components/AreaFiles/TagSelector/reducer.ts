import { ITag } from "../../../interfaces";

export enum ACT_FIELD {
  RESET = "RESET",
  SEARCH_RESULT = "SEARCH_RESULT",
  SEARCH_CHANGE = "SEARCH_CHANGE",
}

interface IReducerState {
  searchLoading: boolean;
  searchedInput: string;
  searchedTags: ITag[];
  searchedTagsTotal: number;
}

export const reducerInitState = {
  searchLoading: false,
  searchedInput: "",
  searchedTags: [],
  searchedTagsTotal: 0,
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACT_FIELD.SEARCH_RESULT:
      newState.searchLoading = false;
      newState.searchedTags = action.searchedTags;
      newState.searchedTagsTotal = action.searchedTagsTotal;
      return newState;
    case ACT_FIELD.SEARCH_CHANGE:
      newState.searchedInput = action.input;
      newState.searchLoading = true;
      return newState;
    case ACT_FIELD.RESET:
      return reducerInitState;
    default:
      console.error(`no action ${action.type}`);
      return state;
  }
};

export default reducer;
