import { IFileDetail } from "../../../interfaces";

export enum ACT_MODAL {
  RESET = "RESET",
  UPDATED = "UPDATED",
}

interface IReducerState {
  assetData: IFileDetail;
}

export const reducerInitState: IReducerState = {
  assetData: null,
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACT_MODAL.UPDATED:
      newState.assetData = action.assetData;
      return newState;
    case ACT_MODAL.RESET:
      return reducerInitState;
    default:
      return state;
  }
};

export default reducer;
