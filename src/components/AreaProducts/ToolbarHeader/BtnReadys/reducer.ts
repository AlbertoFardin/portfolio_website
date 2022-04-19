import { IProduct } from "../../../../interfaces";

export enum ACTION {
  RESET = "RESET",
  SET_ITEMS = "SET_ITEMS",
  OPEN_MODAL_MEDIA = "OPEN_MODAL_MEDIA",
  OPEN_MODAL_ATTRIBUTE = "OPEN_MODAL_ATTRIBUTE",
}

interface IReducerState {
  items: IProduct[];
  itemsRoot: IProduct[];
  loading: boolean;
  modalMediasReady: boolean;
  modalAttributesReady: boolean;
}

export const reducerInitState: IReducerState = {
  items: [],
  itemsRoot: [],
  loading: false,
  modalMediasReady: false,
  modalAttributesReady: false,
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACTION.OPEN_MODAL_MEDIA:
      newState.loading = true;
      newState.modalMediasReady = true;
      return newState;
    case ACTION.OPEN_MODAL_ATTRIBUTE:
      newState.loading = true;
      newState.modalAttributesReady = true;
      return newState;
    case ACTION.SET_ITEMS:
      newState.loading = false;
      newState.items = action.items;
      newState.itemsRoot = action.itemsRoot;
      return newState;
    case ACTION.RESET:
      return reducerInitState;
    default:
      return state;
  }
};

export default reducer;
