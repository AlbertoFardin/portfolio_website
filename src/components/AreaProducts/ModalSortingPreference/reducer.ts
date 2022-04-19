export enum ACTION {
  RESET = "RESET",
  SAVE_STOP = "SAVE_STOP",
  SAVE_CLICK = "SAVE_CLICK",
  SAVING = "SAVING",
}

interface IReducerState {
  saveClicked: boolean;
  saving: boolean;
}

export const reducerInitState: IReducerState = {
  saveClicked: false,
  saving: false,
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACTION.SAVE_CLICK:
      newState.saveClicked = true;
      return newState;
    case ACTION.SAVING:
      newState.saving = true;
      return newState;
    case ACTION.SAVE_STOP:
      newState.saveClicked = false;
      newState.saving = false;
      return newState;
    case ACTION.RESET:
      return reducerInitState;
    default:
      return state;
  }
};

export default reducer;
