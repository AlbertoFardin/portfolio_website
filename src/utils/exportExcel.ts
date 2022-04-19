import * as moment from "moment";
import { IColumnSc } from "../interfaces";
import { searchExport } from "../api/fetchesApi";
import { INDEX_NAME, MAX_PRODUCTS_SELECTABLE } from "../constants";
import {
  IColumnsSets,
  TypeCell,
  getValueString,
} from "../componentsBase/StickyGrid";
import getAttributeKey from "../components/AreaProducts/getAttributeKey";

const columnsNotAllowed: TypeCell[] = [
  TypeCell.Avatar,
  TypeCell.Thumbnail,
  TypeCell.MultipleThumbnail,
  TypeCell.Icon,
];

export const exportExcelColumnsLimit = 200;

export const generateFileName = (momentDate: moment.Moment) => {
  return `sc_export_${momentDate.format(
    "DDMMYY"
  )}_${momentDate.valueOf()}.xlsx`;
};

const convertDataElasticToExcel = (
  raw,
  columns: IColumnSc[],
  catalogId: string,
  languageId: string
): string[][] => {
  const toReturn = [];

  raw.forEach((element) => {
    const array = [];
    columns.forEach((column) => {
      const attributeKey = getAttributeKey(column, catalogId, languageId);
      const attributeValue = getValueString(
        element["_source"][attributeKey],
        column.type
      );
      array.push(attributeValue);
    });
    toReturn.push(array);
  });

  return toReturn;
};

export const getColumnsForExportData = (
  columns: IColumnSc[],
  columnsSet: IColumnsSets
): IColumnSc[] => {
  if (columnsSet === undefined || columnsSet.items === undefined) {
    return [];
  }

  const ret = [];
  columnsSet.items.forEach((item) => {
    const elFind = columns.find(({ id }) => id === item.id);
    if (
      elFind !== undefined &&
      columnsNotAllowed.find(
        (colNotAllowed) => elFind.type === colNotAllowed
      ) === undefined
    ) {
      ret.push(elFind);
    }
  });

  return ret;
};

export const generateQuery = (ids: string[], columns: IColumnSc[]) => {
  const colsIds = columns.map((x) => x.id);

  const queryObj = {
    index: INDEX_NAME.TABULAR,
    size: MAX_PRODUCTS_SELECTABLE,
  };

  // filtro le proprietà da ritornare
  if (colsIds.length > 0) {
    queryObj["_source"] = {
      includes: colsIds,
    };
  }

  // filtro per lista di id
  if (ids.length > 0) {
    queryObj["query"] = {
      ids: {
        values: ids,
      },
    };
  }

  return queryObj;
};

export const generateHeadersRows = (
  columns: IColumnSc[],
  hits,
  catalogId: string,
  languageId: string
): { headers: string[]; rows: string[][] } => {
  return {
    headers: columns.map((x) => x.label),
    rows: convertDataElasticToExcel(hits, columns, catalogId, languageId),
  };
};

export const prepareDataForExportExcel = async (
  ids: string[],
  columns: IColumnSc[],
  catalogId: string,
  languageId: string
) => {
  console.debug("Elastic Search query");

  const result = await searchExport(generateQuery(ids, columns));

  if (result.error) {
    console.error(result.error);
    throw {
      message: "Excel export: search data error",
      code: "searchError",
    };
  }

  return generateHeadersRows(columns, result.hits.hits, catalogId, languageId);
};
