export enum ACT_MODAL {
  RESET = "RESET",
  DELETE = "DELETE",
  ERROR_DESCENDANT = "ERROR_DESCENDANT",
}

interface IReducerState {
  deleting: boolean;
  errorDescendant: boolean;
}

export const reducerInitState: IReducerState = {
  deleting: false,
  errorDescendant: false,
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACT_MODAL.ERROR_DESCENDANT:
      newState.deleting = reducerInitState.deleting;
      newState.errorDescendant = true;
      return newState;
    case ACT_MODAL.DELETE:
      newState.deleting = true;
      return newState;
    case ACT_MODAL.RESET:
      return reducerInitState;
    default:
      return state;
  }
};

export default reducer;
