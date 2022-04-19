import { ITag } from "../../../interfaces";
import without from "lodash-es/without";

enum PanelIds {
  SEARCH = "SEARCH",
  DELETE = "DELETE",
}

export enum ACT_MODAL {
  RESET = "RESET",
  SEARCH_START = "SEARCH_START",
  SEARCH_END = "SEARCH_END",
  PAGINATION = "PAGINATION",
  REMOVE_CONFIRM = "REMOVE_CONFIRM",
  REMOVE_START = "REMOVE_START",
  REMOVE_END = "REMOVE_END",
  TAG_SELECT = "TAG_SELECT",
}

interface IReducerState {
  selectedTags: ITag[];
  removing: boolean;
  searchingTags: boolean;
  searchingInput: string;
  searchingPageValue: number;
  searchingPageSize: number;
  foundTags: ITag[];
  foundTagsTotal: number;
  removeConfirm: boolean;
}

export const reducerInitState = {
  panelId: PanelIds.SEARCH,
  selectedTags: [],
  removing: false,
  searchingTags: true,
  searchingFiles: false,
  searchingInput: "",
  searchingPageValue: 1,
  searchingPageSize: 20,
  foundTags: [],
  foundTagsTotal: 0,
  removeConfirm: false,
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACT_MODAL.SEARCH_START:
      newState.searchingTags = true;
      newState.searchingInput = action.input;
      newState.searchingPageValue = reducerInitState.searchingPageValue;
      return newState;
    case ACT_MODAL.SEARCH_END:
      newState.searchingTags = false;
      newState.foundTags = action.foundTags;
      newState.foundTagsTotal = action.foundTagsTotal;
      return newState;
    case ACT_MODAL.REMOVE_START:
      newState.removing = true;
      newState.removeConfirm = false;
      return newState;
    case ACT_MODAL.REMOVE_END:
      newState.removing = false;
      newState.foundTags = reducerInitState.foundTags;
      newState.foundTagsTotal = reducerInitState.foundTagsTotal;
      newState.searchingTags = reducerInitState.searchingTags;
      newState.selectedTags = reducerInitState.selectedTags;
      newState.searchingInput = reducerInitState.searchingInput;
      newState.searchingPageValue = reducerInitState.searchingPageValue;
      newState.searchingPageSize = reducerInitState.searchingPageSize;
      return newState;
    case ACT_MODAL.TAG_SELECT: {
      const { tag } = action;
      const selected = newState.selectedTags.find(
        ({ id }: ITag) => id === tag.id
      );
      if (selected) {
        newState.selectedTags = without(newState.selectedTags, tag);
      } else {
        newState.selectedTags = [tag];
      }
      return newState;
    }
    case ACT_MODAL.REMOVE_CONFIRM:
      newState.removeConfirm = !newState.removeConfirm;
      return newState;
    case ACT_MODAL.PAGINATION:
      newState.searchingTags = true;
      newState.searchingPageValue = action.value;
      return newState;
    case ACT_MODAL.RESET:
      return reducerInitState;
    default:
      console.error(`no action ${action.type}`);
      return state;
  }
};

export default reducer;
