export enum ACT_MODAL {
  RESET = "RESET",
  SAVE = "SAVE",
  INPUT_TEXTING = "INPUT_TEXTING",
  INPUT_PRESSENTER = "INPUT_PRESSENTER",
}

interface IReducerState {
  save: boolean;
  newName: string;
}

export const reducerInitState: IReducerState = {
  save: false,
  newName: "Untitled Folder",
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
    case ACT_MODAL.SAVE:
      newState.save = true;
      return newState;
    case ACT_MODAL.RESET:
      return reducerInitState;
    default:
      return state;
  }
};

export default reducer;
