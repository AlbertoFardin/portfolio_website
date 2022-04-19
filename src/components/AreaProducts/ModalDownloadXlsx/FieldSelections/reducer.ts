export enum ACT_ITEM {
  HOVER = "HOVER",
  LABEL_EDIT_STARTED = "LABEL_EDIT_START",
  LABEL_EDIT_STOPPED = "LABEL_EDIT_STOPPED",
  LABEL_CHANGE = "LABEL_CHANGE",
}

interface IReducerState {
  hover: boolean;
  labelInModify: boolean;
  labelNewValue: string;
}

export const reducerInitState: IReducerState = {
  hover: false,
  labelInModify: false,
  labelNewValue: "",
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACT_ITEM.HOVER:
      newState.hover = action.value;
      return newState;
    case ACT_ITEM.LABEL_EDIT_STARTED:
      newState.labelInModify = true;
      return newState;
    case ACT_ITEM.LABEL_EDIT_STOPPED:
      newState.labelInModify = false;
      return newState;
    case ACT_ITEM.LABEL_CHANGE:
      newState.labelNewValue = action.value;
      return newState;
    default:
      return state;
  }
};

export default reducer;
