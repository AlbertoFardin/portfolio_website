import * as React from "react";
import isEmpty from "lodash-es/isEmpty";
import { IColumn } from "../interfaces";
import Cell from "../Cell/Cell";

interface IGridSkeleton {
  items;
  sidebarWidth: number;
  columns: IColumn[];
  rowHeight: (rowIndex: number) => number;
  headerHeight: number;
}

const GridSkeleton = ({
  items,
  columns,
  sidebarWidth,
  rowHeight,
}: IGridSkeleton) => {
  if (isEmpty(items) || isEmpty(columns)) return null;

  const width = columns.reduce((acc, { width }) => acc + width, sidebarWidth);

  return (
    <div>
      {items.map(({ id, selected, focused: rowIdFocused }, rowIndex) => {
        const columnIndex = 0;
        const focused = rowIdFocused === id;
        return (
          <Cell
            key={`cellskeleton_${id}`}
            columnIndex={columnIndex}
            rowIndex={rowIndex}
            selected={selected}
            focused={focused}
            style={{
              position: "relative",
              height: rowHeight(rowIndex),
              width,
            }}
            children={""}
          />
        );
      })}
    </div>
  );
};

export default React.memo(GridSkeleton);
