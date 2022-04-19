import { IFileDetail } from "../../../interfaces";

export enum ACT_MODAL {
  RESET = "RESET",
  UPDATED = "UPDATED",
  LOADING = "LOADING",
}

interface IReducerState {
  files: IFileDetail[];
  loading: boolean;
}

export const reducerInitState: IReducerState = {
  files: [],
  loading: false,
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACT_MODAL.LOADING:
      newState.loading = true;
      return newState;
    case ACT_MODAL.UPDATED:
      newState.files = action.files;
      newState.loading = false;
      return newState;
    case ACT_MODAL.RESET:
      return reducerInitState;
    default:
      return state;
  }
};

export default reducer;
