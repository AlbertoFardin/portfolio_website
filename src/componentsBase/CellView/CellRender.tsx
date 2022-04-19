import * as React from "react";
import Cell from "./Cell";

interface ICellRender {
  columnIndex: number;
  data;
  rowIndex: number;
  style?: React.CSSProperties;
}

const CellRender = ({ columnIndex, data, rowIndex, style }: ICellRender) => {
  const {
    colorTheme,
    cellRender,
    cellWidth,
    cellHeight,
    itemsSelectedId,
    columnCount,
    items,
  } = data;
  const index = (rowIndex + 1) * columnCount - (columnCount - columnIndex);
  const itemData = items[index] || {};
  return (
    <Cell
      cellHeight={cellHeight(itemData.cellType)}
      cellWidth={cellWidth}
      cellRender={cellRender}
      data={itemData}
      index={index}
      selected={!!itemsSelectedId.find((id) => id === itemData.id)}
      colorTheme={colorTheme}
      style={style}
    />
  );
};

export default CellRender;
