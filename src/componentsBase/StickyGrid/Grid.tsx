import * as React from "react";
import AutoSizer from "../Autosizer";
import without from "lodash-es/without";
import CellContent from "./CellContent";
import StickyTable, { IRendererCorner } from "../StickyTable";
import classnames from "classnames";
import { emptyFn } from "../utils/common";
import CellHeader from "./CellHeader";
import { IColumn, IGrid, IRendererLeft, ILeftData } from "./interfaces";
import GridSkeleton from "./GridSkeleton";
import GridCanton from "./GridCanton";
import Cell from "./Cell";
import GridPlaceholder from "./GridPlaceholder";
import useStyles from "./useStyles";
import { getCellValueDefault, renderCellEmpty } from "./statics";
import { ICellContentData } from "./CellContent/ICellContent";

const emptyArray = [];

const rowHeightDefault = () => 160;

const Grid = ({
  overscan = 1,
  renderCellSidebar = emptyFn,
  renderCellContent = emptyFn,
  renderCellPlaceholder = renderCellEmpty,
  renderCanton = emptyFn,
  defaultColumns,
  enabledColumnsResize = true,
  enabledColumnsMove = true,
  enabledColumnsMultiSort = false,
  enabledColumnsRemove = true,
  columnsSort = emptyArray,
  onColumnsChange = emptyFn,
  sidebarWidth = 60,
  headerHeight = 50,
  headerBackgroundColor = "#fff",
  onHeaderClick = emptyFn,
  rows,
  rootLoading = false,
  rootClassName,
  onRootClick: rootOnClick = emptyFn,
  rowContextmenu = emptyArray,
  rowHeight = rowHeightDefault,
  onRowClick = emptyFn,
  onRowDoubleClick = emptyFn,
  onRowContextMenu = emptyFn,
  onRowCopyToClipboard,
  rowThumbnailSize = 128,
  resetScrollbar = null,
  getCellValue = getCellValueDefault,
  mapError = {},
}: IGrid) => {
  const classes = useStyles({});
  const [columns, setColumns] = React.useState(defaultColumns);

  const sizes = React.useMemo(() => columns.map((col) => col.width), [columns]);
  const columnWidth = React.useCallback((index) => sizes[index], [sizes]);
  const onRemove = React.useCallback(
    (id: string) => {
      const columnRemoved = columns.find((col) => col.id === id);
      const newColumns: IColumn[] = without(columns, columnRemoved);
      setColumns(newColumns);
      onColumnsChange(columns);
    },
    [columns, onColumnsChange]
  );

  const onMove = React.useCallback(
    (dragColId: string, dropColId: string) => {
      const newColumns = columns.reduce((acc, curr) => {
        switch (curr.id) {
          case dragColId: {
            return acc;
          }
          case dropColId: {
            const dragCol = columns.find((el) => el.id === dragColId);
            acc.push(dragCol);
            acc.push(curr);
            return acc;
          }
          default: {
            acc.push(curr);
            return acc;
          }
        }
      }, [] as IColumn[]);
      setColumns(newColumns);
      onColumnsChange(newColumns);
    },
    [columns, onColumnsChange]
  );

  const cbOnResizeEnd = React.useCallback(
    (size: number, index: number) => {
      const newColumns = columns.map((col, i) => {
        if (i === index) {
          col.width = size;
        }
        return col;
      });
      setColumns(newColumns);
      onColumnsChange(newColumns);
    },
    [columns, onColumnsChange]
  );

  const leftRenderer = React.useCallback(
    (p: IRendererLeft) => {
      const { rowIndex, style, className, scrolledLeft, data } = p;
      const {
        selected,
        focused,
        rowData,
        contextmenu,
        onClick,
        onDoubleClick,
        onContextMenu,
        onCopyToClipboard,
      } = data;
      return (
        <Cell
          rowIndex={rowIndex}
          columnIndex={0}
          selected={selected}
          focused={focused}
          style={style}
          className={classnames({
            [className]: true,
            [classes.shadowSidebar]: scrolledLeft,
          })}
          contextmenu={contextmenu}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          onContextMenu={onContextMenu}
        >
          {renderCellSidebar({
            rowData,
            rowIndex,
            columnIndex: 0,
            selected,
            focused,
            style,
            contextmenu,
            onClick,
            onDoubleClick,
            onContextMenu,
            onCopyToClipboard,
          })}
        </Cell>
      );
    },
    [classes.shadowSidebar, renderCellSidebar]
  );
  const topData = React.useMemo(
    () =>
      columns.map(({ id, label, sortable, defaultSorting }) => ({
        id,
        label,
        sortable,
        defaultSorting,
        backgroundColor: headerBackgroundColor,
        enableResize: enabledColumnsResize,
        enableMove: enabledColumnsMove,
        enableMultiSort: enabledColumnsMultiSort,
        enableRemove: enabledColumnsRemove,
        sort: columnsSort,
        onClick: onHeaderClick,
        onMoveColumn: onMove,
        onRemove: onRemove,
        onResizeEnd: cbOnResizeEnd,
      })),
    [
      cbOnResizeEnd,
      columns,
      enabledColumnsMove,
      enabledColumnsMultiSort,
      enabledColumnsRemove,
      enabledColumnsResize,
      columnsSort,
      headerBackgroundColor,
      onHeaderClick,
      onMove,
      onRemove,
    ]
  );

  const columnCount = columns.length;
  const rowCount = rows.length;

  const data = React.useMemo(
    () =>
      rows.map((item) => {
        return columns.map((column) => {
          return {
            value: getCellValue(item.data, column),
            column,
            focused: item.focused,
            selected: item.selected,
            rowOnClick: onRowClick,
            rowOnDoubleClick: onRowDoubleClick,
            rowOnContextMenu: onRowContextMenu,
            rowOnCopyToClipboard: onRowCopyToClipboard,
            rowThumbnailSize,
            rowContextmenu,
            renderCell: renderCellContent,
            renderCellPlaceholder,
            mapError,
          } as ICellContentData;
        });
      }),
    [
      columns,
      rows,
      renderCellContent,
      renderCellPlaceholder,
      rowContextmenu,
      onRowClick,
      onRowContextMenu,
      onRowCopyToClipboard,
      onRowDoubleClick,
      rowThumbnailSize,
      getCellValue,
      mapError,
    ]
  );

  const leftData = React.useMemo(
    (): ILeftData[] =>
      rows.map((item, index) => {
        return {
          focused: item.focused,
          selected: item.selected,
          rowIndex: index,
          rowData: item.data,
          onClick: onRowClick,
          onDoubleClick: onRowDoubleClick,
          onContextMenu: onRowContextMenu,
          onCopyToClipboard: onRowCopyToClipboard,
          contextmenu: rowContextmenu,
        };
      }),
    [
      rowContextmenu,
      onRowClick,
      onRowContextMenu,
      onRowCopyToClipboard,
      onRowDoubleClick,
      rows,
    ]
  );

  const TopLeftRender = React.useCallback(
    ({
      width,
      height,
      top,
      left,
      scrolledTop,
      scrolledLeft,
    }: IRendererCorner) => {
      return (
        <GridCanton
          backgroundColor={headerBackgroundColor}
          cellRender={renderCanton}
          height={height}
          width={width}
          top={top}
          left={left}
          scrolledLeft={scrolledLeft}
          scrolledTop={scrolledTop}
        />
      );
    },
    [renderCanton, headerBackgroundColor]
  );

  return (
    <div
      role="presentation"
      className={classnames({
        [classes.gridContainer]: true,
        [rootClassName]: !!rootClassName,
      })}
      onClick={rootOnClick}
    >
      <AutoSizer>
        {({ width, height }) => {
          return (
            <StickyTable
              columnCount={columnCount}
              rowCount={rowCount}
              topData={topData}
              leftData={leftData}
              data={data}
              width={width}
              height={height}
              columnWidth={columnWidth}
              rowHeight={rowHeight}
              topHeight={headerHeight}
              leftWidth={sidebarWidth}
              overscan={overscan}
              CellRenderer={CellContent}
              TopRenderer={CellHeader}
              LeftRenderer={leftRenderer}
              TopLeftRender={TopLeftRender}
              resetScrollbar={resetScrollbar}
              innerElement={
                <GridSkeleton
                  items={rows}
                  columns={columns}
                  sidebarWidth={sidebarWidth}
                  rowHeight={rowHeight}
                  headerHeight={headerHeight}
                />
              }
            />
          );
        }}
      </AutoSizer>
      <GridPlaceholder
        rootLoading={rootLoading}
        items={rows}
        columns={columns}
      />
    </div>
  );
};

export default Grid;
