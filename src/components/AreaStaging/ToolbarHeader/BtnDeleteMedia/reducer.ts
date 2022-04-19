import { IItemEs, IItemStagingArea } from "../../../../interfaces";

export enum ACTIONS {
  SET_ITEMS = "SET_ITEMS",
  MODAL_OPEN = "MODAL_OPEN",
  DELETING = "DELETING",
  RESET = "RESET",
}

export const initState = {
  items: [] as IItemEs<IItemStagingArea>[],
  modalOpen: false,
  modalLoading: false,
  deleting: false,
};

export interface IReducer {
  items: IItemEs<IItemStagingArea>[];
  modalOpen: boolean;
  modalLoading: boolean;
  deleting: boolean;
}

const reducer = (state: IReducer, action): IReducer => {
  const newState = { ...state };
  switch (action.type) {
    case ACTIONS.SET_ITEMS:
      newState.items = action.items;
      newState.modalLoading = false;
      return newState;
    case ACTIONS.MODAL_OPEN:
      newState.modalLoading = true;
      newState.modalOpen = !newState.modalOpen;
      return newState;
    case ACTIONS.DELETING:
      newState.modalLoading = true;
      newState.deleting = true;
      return newState;
    case ACTIONS.RESET:
      return initState;
    default:
      console.error("error", action.type);
      return newState;
  }
};

export default reducer;
