/* eslint-disable @typescript-eslint/no-explicit-any */
import concat from "lodash-es/concat";
import without from "lodash-es/without";

export enum UpdateActions {
  ADD = "ADD",
  REMOVE = "REMOVE",
  UPDATE = "UPDATE",
}

interface IUpdateContent {
  newItems: any[];
  items: any[];
  itemsTotal: number;
  action: UpdateActions;
}

interface IReturn {
  total: number;
  items: any[];
}

/**
 * @deprecated sembra che il la condition ADD e REMOVE siano comprese in update
 * Da chiarire
 */
export default ({
  newItems,
  items,
  itemsTotal,
  action = UpdateActions.UPDATE,
}: IUpdateContent): IReturn => {
  let updatedItems = [];
  let updatedTotal = 0;

  switch (action) {
    case UpdateActions.ADD: {
      updatedItems = concat(items, newItems);
      updatedTotal = itemsTotal + newItems.length;
      break;
    }
    case UpdateActions.REMOVE: {
      updatedItems = newItems.reduce((acc, cur) => {
        const itemToRemove = acc.find((item) => cur.id === item.id);
        const itemsWithoutOldOne = without(acc, itemToRemove);
        return itemsWithoutOldOne;
      }, items);
      updatedTotal = itemsTotal - newItems.length;
      break;
    }
    case UpdateActions.UPDATE: {
      updatedItems = newItems.reduce((acc, cur, i) => {
        const indexToRemove = acc.findIndex((item) => cur.id === item.id);
        const itemToRemove = acc[indexToRemove];
        const array = without(acc, itemToRemove);
        array.splice(indexToRemove, 0, newItems[i]);
        return array;
      }, items);
      updatedTotal = itemsTotal;
      break;
    }
    default: {
      break;
    }
  }

  return {
    total: updatedTotal,
    items: updatedItems,
  };
};
