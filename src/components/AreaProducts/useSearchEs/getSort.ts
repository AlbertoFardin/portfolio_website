import isEmpty from "lodash-es/isEmpty";
import { IColumnSc, IContentSort } from "../../../interfaces";
import getAttributeKey from "../getAttributeKey";

interface IComposeSortQuery {
  sorts: IContentSort[];
  columns: IColumnSc[];
  catalogId: string;
  languageId: string;
}

export const composeSortQuery = ({
  sorts,
  columns,
  catalogId,
  languageId,
}: IComposeSortQuery) => {
  return sorts.map(({ id, order }) => {
    const column = columns.find((c) => c.id === id);
    const key = getAttributeKey(column, catalogId, languageId);
    return { [key]: { order } };
  });
};

interface IGetSort {
  sortsContent: IContentSort[];
  columns: IColumnSc[];
  catalogId: string;
  languageId: string;
}

const getSort = ({
  sortsContent,
  columns,
  catalogId,
  languageId,
}: IGetSort) => {
  // use user sort
  if (!isEmpty(sortsContent))
    return composeSortQuery({
      sorts: sortsContent,
      columns,
      catalogId,
      languageId,
    });

  // no default sorting return empty list
  return [];
};

export default getSort;
