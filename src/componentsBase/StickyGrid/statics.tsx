import * as React from "react";
import { ICellRenderer, IColumn } from "./interfaces";
import CellString from "./CellContent/CellString";

export const columnsPadding = 10;
export const columnsWidthDefault = 120;
export const DATE_FORMAT = "DD/MM/YYYY";
export const renderCellEmpty = (p: ICellRenderer) => (
  <CellString {...p} value="" />
);
export const getCellValueDefault = (rowData, column: IColumn) => {
  return rowData[column.id];
};
