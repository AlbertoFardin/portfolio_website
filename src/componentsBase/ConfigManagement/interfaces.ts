/* eslint-disable @typescript-eslint/no-explicit-any */

export const emptyItemSet: IItemsSet = {
  id: "",
  label: "Empty Set",
  active: true,
  items: [],
};

export interface IItemSaved {
  id: string;
  width?: number;
}

export interface IItemsSet {
  id: string;
  label?: string;
  active: boolean;
  default?: boolean;
  items: IItemSaved[];
}

export interface IItemGroup {
  id: string;
  label: string;
}

export interface IItem {
  id: string;
  label: string;
  tooltip?: string;
  groupId?: string;
}
