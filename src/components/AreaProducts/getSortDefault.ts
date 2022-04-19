import { ISortOrder } from "../../componentsBase/StickyGrid";
import { IContentSort, IColumnSc } from "../../interfaces";
import escapeKeyEs from "../../utils/escapeKeyEs";

const getSortDefault = (columns: IColumnSc[]): IContentSort[] => {
  const ret: IContentSort[] = [];

  // find columns marked as default sorting
  const defaultSortingFound = columns.filter(
    (x) =>
      x.defaultSorting &&
      Number.isFinite(x.defaultSorting.priority) &&
      x.defaultSorting.sorting &&
      x.defaultSorting.sorting.toLowerCase() !== ISortOrder.NONE.toLowerCase()
  );
  if (defaultSortingFound.length > 0) {
    // order the columns found according to their priority
    defaultSortingFound.sort(
      (a, b) => a.defaultSorting.priority - b.defaultSorting.priority
    );
    defaultSortingFound.forEach((x) => {
      ret.push({
        id: escapeKeyEs(x.id),
        order:
          x.defaultSorting.sorting.toLowerCase() ===
          ISortOrder.ASC.toLowerCase()
            ? ISortOrder.ASC
            : ISortOrder.DESC,
        label: x.label,
        keyword: x.keyword,
      });
    });
  }

  return ret;
};

export default getSortDefault;
