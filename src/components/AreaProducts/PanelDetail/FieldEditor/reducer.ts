import * as Colors from "../../../../componentsBase/style/Colors";

export enum ACT_FIELD {
  HIGHLIGHT_COLOR_RESET = "HIGHLIGHT_COLOR_RESET",
  HIGHLIGHT_COLOR_READY = "HIGHLIGHT_COLOR_READY",
  RESET = "RESET",
}

export interface IReducerState {
  hightlightColor: string;
  hightlightLanguages: string[];
}

export const initState: IReducerState = {
  hightlightColor: "",
  hightlightLanguages: [],
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACT_FIELD.HIGHLIGHT_COLOR_RESET:
      newState.hightlightColor = Colors.Orange;
      newState.hightlightLanguages = !!action.languages[0]
        ? action.languages
        : initState.hightlightLanguages;
      return newState;
    case ACT_FIELD.HIGHLIGHT_COLOR_READY:
      newState.hightlightColor = Colors.Cyan;
      newState.hightlightLanguages = !!action.languages[0]
        ? action.languages
        : initState.hightlightLanguages;
      return newState;
    case ACT_FIELD.RESET:
      return initState;
    default:
      return state;
  }
};

export default reducer;
