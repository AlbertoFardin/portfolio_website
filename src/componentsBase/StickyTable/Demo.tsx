import * as React from "react";
import StickyTable, { IRenderer, IRendererCorner } from ".";

const Cell = ({ className, style, columnIndex, rowIndex }: IRenderer) => (
  <div
    className={className}
    style={{ ...style, position: "absolute" }}
    children={`${rowIndex}:${columnIndex}`}
  />
);
const Header = ({ className, style, columnIndex, rowIndex }: IRenderer) => (
  <div
    className={className}
    style={{ ...style, position: "absolute", backgroundColor: "#f1f1f1" }}
    children={`${rowIndex}:${columnIndex}`}
  />
);
const Corner = ({ width, height, top, left }: IRendererCorner) => (
  <div
    style={{
      position: "sticky",
      width: 0,
      height: 0,
      top,
      left,
      zIndex: 2,
    }}
  >
    <div
      style={{
        position: "absolute",
        width,
        height,
        color: "#fff",
        backgroundColor: "#00f",
      }}
      children={`${top}:${left}`}
    />
  </div>
);

const columnCount = 50;
const rowCount = 50;

const DemoStickyTable = () => {
  const data = React.useMemo(() => {
    const allData = [];
    for (let i = 0; i < rowCount; ++i) {
      const rowData = [];
      for (let i = 0; i < columnCount; ++i) {
        rowData.push([{ id: i }]);
      }
      allData.push(rowData);
    }
    return allData;
  }, []);
  const topData = React.useMemo(() => {
    const columnData = [];
    for (let i = 0; i < columnCount; ++i) {
      columnData.push([{ id: i }]);
    }
    return columnData;
  }, []);
  const leftData = React.useMemo(() => {
    const rowData = [];
    for (let i = 0; i < columnCount; ++i) {
      rowData.push([{ id: i }]);
    }
    return rowData;
  }, []);

  return (
    <StickyTable
      columnCount={columnCount}
      rowCount={rowCount}
      topData={topData}
      bottomData={topData}
      leftData={leftData}
      rightData={leftData}
      data={data}
      width={400}
      height={400}
      columnWidth={50}
      rowHeight={50}
      topHeight={50}
      bottomHeight={50}
      leftWidth={50}
      rightWidth={50}
      CellRenderer={Cell}
      //
      TopRenderer={Header}
      BottomRenderer={Header}
      LeftRenderer={Header}
      RightRenderer={Header}
      //
      TopLeftRender={Corner}
      TopRightRender={Corner}
      BottomLeftRender={Corner}
      BottomRightRender={Corner}
    />
  );
};

export default DemoStickyTable;
