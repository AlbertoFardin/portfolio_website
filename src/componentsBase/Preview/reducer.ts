export enum ACTION {
  SRC_LOADED = "SRC_LOADED",
  SRC_ERROR = "SRC_ERROR",
  RESET = "RESET",
  PLACEHOLDER = "PLACEHOLDER",
}

interface IReducerState {
  placeholder: boolean;
  srcError: boolean;
  srcLoaded: boolean;
}

export const reducerInitState: IReducerState = {
  placeholder: false,
  srcError: false,
  srcLoaded: false,
};

export const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACTION.SRC_LOADED:
      newState.srcLoaded = true;
      return newState;
    case ACTION.SRC_ERROR:
      newState.placeholder = true;
      newState.srcError = true;
      return newState;
    case ACTION.PLACEHOLDER:
      newState.placeholder = true;
      return newState;
    case ACTION.RESET:
      return reducerInitState;
    default:
      throw new Error();
  }
};
