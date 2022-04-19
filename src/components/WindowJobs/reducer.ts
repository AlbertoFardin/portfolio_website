import { IRequest } from "../../interfaces";

export enum ACTION {
  RESET = "RESET",
  WINDOW_OPEN = "WINDOW_OPEN",
  FETCHED_ALL = "FETCHED_ALL",
  DELETED_ALL = "DELETED_ALL",
  FETCHED_SINGLE = "FETCHED_SINGLE",
  DELETED_SINGLE = "DELETED_SINGLE",
  IDS_TO_UPDATE = "IDS_TO_UPDATE",
  CLICK_DELETE_ALL = "CLICK_DELETE_ALL",
}

interface IReducer {
  openWindow: boolean;
  fetchingAll: boolean;
  deletingAll: boolean;
  items: IRequest[];
  idsToUpdate: string[];
}

export const reducerInitState: IReducer = {
  openWindow: false,
  fetchingAll: true,
  deletingAll: false,
  items: [],
  idsToUpdate: [],
};

export const reducer = (state: IReducer, action): IReducer => {
  const newState = { ...state };
  switch (action.type) {
    case ACTION.RESET:
      return reducerInitState;
    case ACTION.WINDOW_OPEN:
      newState.openWindow = action.value;
      return newState;
    case ACTION.FETCHED_ALL:
      newState.items = action.value as IRequest[];
      newState.fetchingAll = false;
      return newState;
    case ACTION.DELETED_ALL:
      newState.deletingAll = false;
      newState.items = reducerInitState.items;
      return newState;
    case ACTION.CLICK_DELETE_ALL:
      newState.deletingAll = true;
      return newState;
    case ACTION.IDS_TO_UPDATE: {
      const array = Array.from(newState.idsToUpdate);
      (action.ids as string[]).forEach((j) => {
        if (!new Set(array).has(j)) array.push(j);
      });
      newState.idsToUpdate = array;
      return newState;
    }
    case ACTION.FETCHED_SINGLE: {
      const id: string = action.id;
      const value: IRequest = action.value;
      {
        const array = Array.from(newState.idsToUpdate);
        const index = array.findIndex((i) => i === id);
        array.splice(index, 1);
        newState.idsToUpdate = array;
      }
      {
        const array = Array.from(newState.items);
        const index = array.findIndex((i) => i.jobId === id);
        if (index === -1) {
          array.unshift(value);
        } else {
          array.splice(index, 1, value);
        }
        newState.items = array;
      }
      return newState;
    }
    case ACTION.DELETED_SINGLE: {
      const array = Array.from(newState.items);
      const index = array.findIndex((i) => i.jobId === action.id);
      array.splice(index, 1);
      newState.items = array;
      return newState;
    }
    default:
      return newState;
  }
};
