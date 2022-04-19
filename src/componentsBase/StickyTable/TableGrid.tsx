import * as React from "react";
import allButDataAndVirtualEqual from "./allButDataAndVirtualEqual";
import TableCell from "./TableCell";

const TableGridNoMemo = ({ data, virtual, renderer }) => {
  const { cols, rows } = virtual;
  const items = [];
  // Only render items that our virtualization says we should
  for (let i = rows.visible.min; i <= rows.visible.max; ++i) {
    for (let j = cols.visible.min; j <= cols.visible.max; ++j) {
      items.push(
        <TableCell
          key={`${i}_${j}`}
          renderer={renderer}
          data={data[i][j]}
          rowIndex={i}
          columnIndex={j}
          columnWidth={cols.sizes[j]}
          rowHeight={rows.sizes[i]}
          style={{
            top: rows.positions[i],
            left: cols.positions[j],
          }}
        />
      );
    }
  }
  return <div>{items}</div>;
};

// This is the actual grid. It needs to do a 2d for loop
const TableGrid = React.memo(TableGridNoMemo, (prev, next) => {
  // We depend on the row and col sub-objects, so if they aren't shallow-equal that's good enough to know we have to
  // re-render.
  if (prev.virtual !== next.virtual) {
    return false;
  }
  return allButDataAndVirtualEqual(prev, next);
});

export default TableGrid;
