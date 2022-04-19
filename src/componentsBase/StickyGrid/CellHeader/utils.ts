import { ISortOrder, SortColumn } from "../interfaces";

export const getIndexSort = (
  id: string,
  sortList: SortColumn[]
): { index: number; sorted: boolean } => {
  const index = sortList.findIndex((x) => x.id === id);
  return {
    index,
    sorted: index > -1,
  };
};

export const calculateNextSort = (currentSort: ISortOrder): ISortOrder => {
  switch (currentSort) {
    case ISortOrder.NONE:
      return ISortOrder.ASC;
    case ISortOrder.ASC:
      return ISortOrder.DESC;
    case ISortOrder.DESC:
      return ISortOrder.NONE;
    default:
      return ISortOrder.NONE;
  }
};

export const commonSortAction = (
  sortObj: SortColumn,
  sortList: SortColumn[],
  sortable: boolean,
  foundSort,
  enableMultiSort: boolean
): SortColumn[] => {
  if (!sortable) {
    return undefined;
  }

  // the column were already in sorting -> change the sort order
  if (foundSort.sorted) {
    sortList.splice(foundSort.index, 1, sortObj);
    return sortList;
  }

  if (enableMultiSort) {
    // the column were not already in sorting -> add column to sort
    return [...sortList, sortObj];
  }

  // set single sorting
  return [sortObj];
};

export const labelSortAction = (
  id: string,
  sortList: SortColumn[],
  sortable: boolean,
  enableMultiSort: boolean
): SortColumn[] => {
  if (!sortable) {
    return undefined;
  }
  const copySort = [...sortList];
  const foundSort = getIndexSort(id, copySort);
  // first sorting of the column
  let newOrder = ISortOrder.ASC;
  // next sorting of the same column
  if (foundSort.sorted) {
    newOrder = calculateNextSort(copySort[foundSort.index].order);
  }

  // remove column sorting
  if (foundSort.sorted && newOrder === ISortOrder.NONE) {
    copySort.splice(foundSort.index, 1);
    return copySort;
  }

  const sortObj = { id, order: newOrder };
  return commonSortAction(
    sortObj,
    copySort,
    sortable,
    foundSort,
    enableMultiSort
  );
};

export const arrowSortAction = (
  actionType: ISortOrder,
  id: string,
  sortList: SortColumn[],
  sortable: boolean,
  enableMultiSort: boolean
): SortColumn[] => {
  if (!sortable) {
    return undefined;
  }

  const copySort = [...sortList];
  const foundSort = getIndexSort(id, copySort);

  // if sorting of this column is set and is the same of the action -> remove the current sort
  if (foundSort.sorted && copySort[foundSort.index].order === actionType) {
    copySort.splice(foundSort.index, 1);
    return copySort;
  }

  const sortObj = { id, order: actionType };
  return commonSortAction(
    sortObj,
    copySort,
    sortable,
    foundSort,
    enableMultiSort
  );
};
