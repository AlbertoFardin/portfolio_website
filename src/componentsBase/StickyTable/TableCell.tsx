import * as React from "react";
import isEqual from "lodash-es/isEqual";
import { IRenderer } from "./IStickyTable";
interface ITableCell {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderer: (p: IRenderer) => any;
  data;
  className?: string;
  style?: React.CSSProperties;
  rowIndex: number;
  columnIndex: number;
  columnWidth: number;
  rowHeight: number;
  scrolledTop?: boolean;
  scrolledLeft?: boolean;
}

const TableCellNoMemo = ({
  data,
  className,
  style,
  rowIndex,
  columnIndex,
  columnWidth,
  rowHeight,
  renderer: Renderer,
  scrolledTop = false,
  scrolledLeft = false,
}: ITableCell) => {
  return (
    <Renderer
      data={data}
      style={{
        ...style,
        width: columnWidth,
        height: rowHeight,
      }}
      className={className}
      rowIndex={rowIndex}
      columnIndex={columnIndex}
      scrolledTop={scrolledTop}
      scrolledLeft={scrolledLeft}
    />
  );
};

// TODO: da verificare correttezza di usare isEqual di lodash al posto della allButDataAndVirtualEqual
/*
const isEqualInCell = (prev, next) => {
  const { rowIndex, columnIndex } = prev;

  if (!isEqual(prev, next)) {
    for (const key in prev) {
      if (!isEqual(prev[key], next[key])) {
        console.log(key, prev[key], next[key]);
      }
    }
  }

  const result = allButDataAndVirtualEqual(prev, next);
  console.log({ rowIndex, columnIndex });
  return result;
};
*/
const TableCell = React.memo(TableCellNoMemo, isEqual);

export default TableCell;
