import * as React from "react";
import allButDataAndVirtualEqual from "./allButDataAndVirtualEqual";
import TableCell from "./TableCell";
import useStyles from "./useStyles";
import classnames from "classnames";
import { IRenderer } from "./IStickyTable";

interface ITableHeaderRow {
  data;
  className?: string;
  leftWidth?: number;
  top?: number;
  height: number;
  virtual;
  renderer: (p: IRenderer) => React.ReactNode;
  scrolledTop: boolean;
}

const TableHeaderRowNoMemo = ({
  data,
  className,
  leftWidth = 0,
  top = 0,
  height,
  virtual,
  renderer,
  scrolledTop,
}: ITableHeaderRow) => {
  const cls = useStyles({});
  const { cols } = virtual;
  const { visible, sizes, positions } = cols;
  const items = [];
  for (let i = visible.min; i <= visible.max; ++i) {
    items.push(
      <TableCell
        key={i}
        renderer={renderer}
        data={data[i]}
        rowIndex={0}
        columnIndex={i}
        columnWidth={sizes[i]}
        rowHeight={height}
        style={{ left: leftWidth + positions[i] }}
        scrolledTop={scrolledTop}
      />
    );
  }
  return (
    <div
      className={classnames([cls.stickyHeader, className])}
      style={{ height, top }}
      children={items}
    />
  );
};

// Horizontal header bars. These take a 1d data prop and some offsets for positioning
const TableHeaderRow = React.memo(TableHeaderRowNoMemo, (prev, next) => {
  // If virtual.rows changes, we don't care, so we can still return true.
  // If the cols change, we need to re-render
  if (prev.virtual.cols !== next.virtual.cols) return false;
  return allButDataAndVirtualEqual(prev, next);
});

export default TableHeaderRow;
