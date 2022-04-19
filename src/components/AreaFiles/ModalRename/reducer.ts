import { IFileDetail } from "../../../interfaces";

export enum ACT_MODAL {
  RESET = "RESET",
  UPDATED = "UPDATED",
  LOAD = "LOADING",
  SAVE = "SAVE",
  INPUT_TEXTING = "INPUT_TEXTING",
  INPUT_PRESSENTER = "INPUT_PRESSENTER",
}

interface IReducerState {
  assetData: IFileDetail;
  load: boolean;
  save: boolean;
  newName: string;
}

export const reducerInitState: IReducerState = {
  assetData: null,
  load: false,
  save: false,
  newName: "",
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACT_MODAL.INPUT_TEXTING:
      newState.newName = action.newName;
      return newState;
    case ACT_MODAL.INPUT_PRESSENTER:
      newState.newName = action.newName;
      newState.save = true;
      return newState;
    case ACT_MODAL.LOAD:
      newState.load = true;
      return newState;
    case ACT_MODAL.SAVE:
      newState.save = true;
      return newState;
    case ACT_MODAL.UPDATED:
      newState.assetData = action.assetData;
      newState.newName = action.assetData.name;
      newState.load = false;
      return newState;
    case ACT_MODAL.RESET:
      return reducerInitState;
    default:
      return state;
  }
};

export default reducer;
