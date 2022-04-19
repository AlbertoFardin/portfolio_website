import * as React from "react";
import allButDataAndVirtualEqual from "./allButDataAndVirtualEqual";
import TableCell from "./TableCell";
import useStyles from "./useStyles";
import classnames from "classnames";
import { IRenderer } from "./IStickyTable";

interface ITableHeaderCol {
  data;
  className?: string;
  left?: number;
  width: number;
  virtual;
  renderer: (p: IRenderer) => React.ReactNode;
  scrolledLeft: boolean;
}

const TableHeaderColNoMemo = ({
  data,
  className,
  left = 0,
  width,
  virtual,
  renderer,
  scrolledLeft,
}: ITableHeaderCol) => {
  const cls = useStyles({});
  const { rows } = virtual;
  const { visible, sizes, positions } = rows;
  const items = [];
  for (let i = visible.min; i <= visible.max; ++i) {
    items.push(
      <TableCell
        key={i}
        renderer={renderer}
        data={data[i]}
        rowIndex={i}
        columnIndex={0}
        columnWidth={width}
        rowHeight={sizes[i]}
        style={{ top: positions[i] }}
        scrolledLeft={scrolledLeft}
      />
    );
  }
  return (
    <div
      className={classnames([cls.stickyHeader, className])}
      style={{ width, left }}
      children={items}
    />
  );
};

// The vertical headers. These also only take 1d arrays for data
const TableHeaderCol = React.memo(TableHeaderColNoMemo, (prev, next) => {
  // If virtual.cols changes, we don't care, so we can still return true.
  // If the row change, we need to re-render
  if (prev.virtual.rows !== next.virtual.rows) return false;
  return allButDataAndVirtualEqual(prev, next);
});

export default TableHeaderCol;
