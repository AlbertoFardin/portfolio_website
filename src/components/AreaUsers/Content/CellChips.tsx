import * as React from "react";
import {
  Cell,
  IRenderCellContent,
  IGridRow,
} from "../../../componentsBase/StickyGrid";
import Btn from "../../../componentsBase/Btn";

interface ICellChips {
  cell: IRenderCellContent;
  rows: IGridRow[];
}

const CellChips = ({ cell, rows }: ICellChips) => {
  const { rowIndex, columnData, style } = cell;
  const rowData = rows[rowIndex].data;
  const { id } = columnData;
  const value = rowData[id];

  return (
    <Cell {...cell} style={{ ...style, justifyContent: "start" }}>
      {(value || []).map((r: { id: string; label: string }) => (
        <Btn key={r.id} variant="bold" label={r.label} />
      ))}
    </Cell>
  );
};

export default CellChips;
