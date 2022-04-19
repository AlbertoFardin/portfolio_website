import concat from "lodash-es/concat";
import without from "lodash-es/without";
import { INotification } from "../../interfaces";

export enum ACTION {
  RESET = "RESET",
  INITIALIZE = "INITIALIZE",
  ITEM_CREATE = "ITEM_CREATE",
  ITEM_REMOVE = "ITEM_REMOVE",
  MARK_READ_ITEM = "MARK_READ_ITEM",
  MARK_READ_ALL = "MARK_READ_ALL",
  DELETE_ALL = "DELETE_ALL",
  LOADING = "LOADING",
  PAGINATION = "PAGINATION",
  NEW_ITEMS = "NEW_ITEMS",
}

interface IReducer {
  loading: boolean;
  items: INotification[];
  itemsTotal: number;
  allDeleting: boolean;
  allMarkingRead: boolean;
  paginationSize: number;
  paginationFrom: number;
  newItemsToView: boolean;
}

export const reducerInitState: IReducer = {
  loading: true,
  items: [],
  itemsTotal: 0,
  allDeleting: false,
  allMarkingRead: false,
  paginationSize: 50,
  paginationFrom: 0,
  newItemsToView: false,
};

export const reducer = (state: IReducer, action): IReducer => {
  const newState = { ...state };
  switch (action.type) {
    case ACTION.INITIALIZE: {
      newState.loading = false;
      newState.items = action.newItems;
      newState.itemsTotal = action.newItemTotal;
      return newState;
    }
    case ACTION.ITEM_CREATE: {
      const itemsToAdd = action.newItems;
      newState.items = concat(itemsToAdd, newState.items);
      newState.itemsTotal = newState.itemsTotal + itemsToAdd.length;
      newState.newItemsToView = reducerInitState.newItemsToView;
      return newState;
    }
    case ACTION.ITEM_REMOVE: {
      const itemToRemove = newState.items.find((n) => n.id === action.id);
      newState.items = without(newState.items, itemToRemove);
      return newState;
    }
    case ACTION.MARK_READ_ITEM: {
      const newItems = Array.from(newState.items);
      const itemIndex = newItems.findIndex((n) => n.id === action.id);
      newItems.splice(itemIndex, 1, {
        ...newItems[itemIndex],
        markedAsRead: action.mark,
      });
      newState.items = newItems;
      return newState;
    }
    case ACTION.MARK_READ_ALL:
      if (action.value) {
        newState.allMarkingRead = true;
        newState.items = newState.items.map((n) => ({
          ...n,
          markedAsRead: true,
        }));
      } else {
        newState.allMarkingRead = false;
      }
      return newState;
    case ACTION.DELETE_ALL:
      if (action.value) {
        newState.allDeleting = true;
        newState.items = reducerInitState.items;
        newState.itemsTotal = reducerInitState.itemsTotal;
      } else {
        newState.allDeleting = false;
      }
      return newState;
    case ACTION.LOADING:
      newState.loading = true;
      return newState;
    case ACTION.PAGINATION:
      newState.loading = true;
      newState.paginationFrom = action.value;
      if (action.value === 0) {
        // troverò i nuovi elementi da vedere nella prima pagina
        newState.newItemsToView = reducerInitState.newItemsToView;
      }
      return newState;
    case ACTION.NEW_ITEMS:
      newState.newItemsToView = true;
      return newState;
    case ACTION.RESET:
      return reducerInitState;
    default:
      return newState;
  }
};
