/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IRendererCorner {
  outerWidth?: boolean;
  width: number;
  height: number;
  top: number;
  left: number;
  scrolledTop: boolean;
  scrolledLeft: boolean;
}

export interface IRenderer {
  data;
  style: React.CSSProperties;
  className: string;
  rowIndex: number;
  columnIndex: number;
  scrolledTop: boolean;
  scrolledLeft: boolean;
}

interface IStickyTable {
  topData?;
  rightData?;
  bottomData?;
  leftData?;
  data;
  width;
  height;
  columnWidth?: number | ((i: number) => number);
  rowHeight?: number | ((i: number) => number);
  topHeight?;
  rightWidth?;
  bottomHeight?;
  leftWidth?;
  columnCount;
  rowCount;
  CellRenderer?;
  TopRenderer?: (p: IRenderer) => React.ReactNode;
  RightRenderer?: (p: IRenderer) => React.ReactNode;
  BottomRenderer?: (p: IRenderer) => React.ReactNode;
  LeftRenderer?: (p: IRenderer) => React.ReactNode;
  TopLeftRender?: (p: IRendererCorner) => any;
  TopRightRender?: (p: IRendererCorner) => any;
  BottomLeftRender?: (p: IRendererCorner) => any;
  BottomRightRender?: (p: IRendererCorner) => any;
  overscan?;
  innerElement?;
  resetScrollbar?: number;
}

export default IStickyTable;
