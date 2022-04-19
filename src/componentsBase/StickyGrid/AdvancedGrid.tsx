import * as React from "react";
import AutoSizer from "../Autosizer";
import CellContent from "./CellContent";
import StickyTable, { IRendererCorner } from "../StickyTable";
import classnames from "classnames";
import { emptyFn } from "../utils/common";
import CellHeader from "./CellHeader";
import {
  IColumnsSets,
  IAdvancedGrid,
  IRendererLeft,
  ILeftData,
} from "./interfaces";
import GridSkeleton from "./GridSkeleton";
import GridCanton from "./GridCanton";
import Cell from "./Cell";
import ConfigManagement, { IItemsSet } from "../ConfigManagement";
import useStyles from "./useStyles";
import Btn from "../Btn";
import GridPlaceholder from "./GridPlaceholder";
import { getCellValueDefault, renderCellEmpty } from "./statics";
import { ICellContentData } from "./CellContent/ICellContent";

const emptyArray = [];

const rowHeightDefault = () => 160;

enum ACTION {
  SET_COLUMNS_SETS = "SET_COLUMNS_SETS",
  SET_OPEN_CONFIG_MANAGMENT = "SET_OPEN_CONFIG_MANAGMENT",
  SET_POSITION_BUTTON_CANTON = "SET_POSITION_BUTTON_CANTON",
}

interface IGridState {
  confOpen: boolean;
  columnsSets: IColumnsSets[];
  btnFilterPosition: { left: number; top: number };
}

const reducer = (state: IGridState, action) => {
  switch (action.type) {
    case ACTION.SET_OPEN_CONFIG_MANAGMENT:
      return { ...state, confOpen: action.confOpen };
    case ACTION.SET_COLUMNS_SETS:
      return { ...state, columnsSets: action.columnsSets };
    case ACTION.SET_POSITION_BUTTON_CANTON:
      return { ...state, btnFilterPosition: action.btnFilterPosition };
    default:
      throw new Error();
  }
};

const AdvancedGrid = ({
  overscan = 1,
  columnsSets: initialColumnsSets = [],
  onColumnsSetsChange = emptyFn,
  columns,
  enabledColumnsResize: columnsEnableResize = true,
  enabledColumnsMove: columnsEnableMove = true,
  enabledColumnsMultiSort: columnsEnableMultiSort = false,
  disableConfigManagment = false,
  enabledColumnsRemove: columnsEnableRemove = true,
  columnsSort = emptyArray,
  sidebarWidth = 60,
  headerHeight = 50,
  headerBackgroundColor = "#fff",
  onHeaderClick = emptyFn,
  rows,
  rootLoading = false,
  rootClassName,
  onRootClick = emptyFn,
  rowContextmenu = emptyArray,
  rowHeight = rowHeightDefault,
  onRowClick = emptyFn,
  onRowDoubleClick = emptyFn,
  onRowContextMenu = emptyFn,
  onRowCopyToClipboard = emptyFn,
  rowThumbnailSize = 128,
  renderCellSidebar = emptyFn,
  renderCellContent,
  renderCellPlaceholder = renderCellEmpty,
  resetScrollbar = null,
  getCellValue = getCellValueDefault,
  mapError = {},
}: IAdvancedGrid) => {
  const classes = useStyles({});

  const btnRefCanton = React.useRef(null);
  const [state, dispatch] = React.useReducer(reducer, {
    confOpen: false,
    columnsSets: initialColumnsSets,
    btnFilterPosition: { left: 0, top: 0 },
  });

  const { confOpen, columnsSets, btnFilterPosition }: IGridState = state;

  const defaultColumnSizes = React.useMemo(
    () =>
      columns.reduce((acc, cur) => {
        acc[cur.id] = cur.width;
        return acc;
      }, {}),
    [columns]
  );

  const activeColumns = React.useMemo(() => {
    const activeColumnSet = columnsSets.find((colSet) => colSet.active);
    return activeColumnSet
      ? activeColumnSet.items.map(({ id, width: userWidth }) => ({
          ...columns.find((col) => col.id === id),
          width: userWidth || defaultColumnSizes[id],
        }))
      : [];
  }, [columns, columnsSets, defaultColumnSizes]);

  const sizes = React.useMemo(() => {
    return activeColumns.map((col) => col.width);
  }, [activeColumns]);
  const columnGroups = React.useMemo(() => {
    const groupsId = new Set(columns.map((c) => c.groupId));
    return Array.from(groupsId).map((id: string) => ({
      id,
      label: id,
    }));
  }, [columns]);

  const columnWidth = React.useCallback((index) => sizes[index], [sizes]);
  const onRemove = React.useCallback(
    (id: string) => {
      const newColumnsSets = columnsSets.map((colSet) => {
        return colSet.active
          ? {
              ...colSet,
              items: colSet.items.filter((i) => i.id !== id),
            }
          : colSet;
      });
      dispatch({ type: ACTION.SET_COLUMNS_SETS, columnsSets: newColumnsSets });
      onColumnsSetsChange(newColumnsSets);
    },
    [columnsSets, onColumnsSetsChange]
  );

  const onMove = React.useCallback(
    (dragColId: string, dropColId: string) => {
      const newColumnsSets = columnsSets.map((colSet) => {
        return colSet.active
          ? {
              ...colSet,
              items: colSet.items.reduce((acc, curr) => {
                switch (curr.id) {
                  case dragColId: {
                    return acc;
                  }
                  case dropColId: {
                    const dragCol = colSet.items.find(
                      (el) => el.id === dragColId
                    );
                    acc.push(dragCol);
                    acc.push(curr);
                    return acc;
                  }
                  default: {
                    acc.push(curr);
                    return acc;
                  }
                }
              }, []),
            }
          : colSet;
      });

      dispatch({ type: ACTION.SET_COLUMNS_SETS, columnsSets: newColumnsSets });
      onColumnsSetsChange(newColumnsSets);
    },
    [columnsSets, onColumnsSetsChange]
  );

  const cbOnResize = React.useCallback(
    (size: number, index: number) => {
      const newColumnsSets = columnsSets.map((colSet) => {
        return colSet.active
          ? {
              ...colSet,
              items: colSet.items.map(({ id, width }, i) =>
                i === index ? { id, width: size } : { id, width }
              ),
            }
          : colSet;
      });
      dispatch({ type: ACTION.SET_COLUMNS_SETS, columnsSets: newColumnsSets });
      onColumnsSetsChange(newColumnsSets);
    },
    [columnsSets, onColumnsSetsChange]
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
      activeColumns.map(({ id, label, sortable, defaultSorting }) => ({
        id,
        label,
        sortable,
        defaultSorting,
        backgroundColor: headerBackgroundColor,
        enableResize: columnsEnableResize,
        enableMove: columnsEnableMove,
        enableMultiSort: columnsEnableMultiSort,
        enableRemove: columnsEnableRemove,
        sort: columnsSort,
        onClick: onHeaderClick,
        onMoveColumn: onMove,
        onRemove: onRemove,
        onResizeEnd: cbOnResize,
      })),
    [
      cbOnResize,
      activeColumns,
      columnsEnableMove,
      columnsEnableMultiSort,
      columnsEnableRemove,
      columnsEnableResize,
      columnsSort,
      headerBackgroundColor,
      onHeaderClick,
      onMove,
      onRemove,
    ]
  );

  const columnCount = activeColumns.length;
  const rowCount = rows.length;

  const data = React.useMemo(
    () =>
      rows.map((item) => {
        return activeColumns.map((column) => {
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
      activeColumns,
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
          rowData: item.data,
          rowIndex: index,
          focused: item.focused,
          selected: item.selected,
          onClick: onRowClick,
          onDoubleClick: onRowDoubleClick,
          onContextMenu: onRowContextMenu,
          onCopyToClipboard: onRowCopyToClipboard,
          contextmenu: rowContextmenu,
        };
      }),
    [
      onRowClick,
      onRowContextMenu,
      onRowCopyToClipboard,
      onRowDoubleClick,
      rowContextmenu,
      rows,
    ]
  );

  const cbOnConfOpen = React.useCallback(() => {
    dispatch({ type: ACTION.SET_OPEN_CONFIG_MANAGMENT, confOpen: !confOpen });
  }, [confOpen]);

  const renderCanton = React.useCallback(() => {
    return (
      <div ref={btnRefCanton}>
        <Btn
          tooltip="Select Columns"
          icon="view_column"
          disabled={disableConfigManagment}
          selected={confOpen}
          onClick={cbOnConfOpen}
        />
      </div>
    );
  }, [cbOnConfOpen, confOpen, disableConfigManagment]);

  const TopLeftRender = React.useCallback(
    ({
      width,
      height,
      top,
      left,
      scrolledLeft,
      scrolledTop,
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

  const cbOnConfChange = React.useCallback(
    (newitemsSets: IItemsSet[]) => {
      // TODO: per ottimizzare (e semplificare) la funzione di seguito
      // è necessario che il componente ConfigManagment
      // esponga delle funzioni più puntuali di modifica, in particolare (almeno):
      // 1. eliminazione di un item in items
      // 2. aggiunta di un item in items
      // 3. creazione di un nuovo itemsSet
      // 4. cambiamento items Set attivo
      const newColumnsSets = newitemsSets.map(
        ({ id, active, default: d, label, items }) => ({
          id,
          active,
          default: d,
          label,
          items: items.map(({ id }) => ({
            id,
            width:
              columnsSets
                .find((colSet) => colSet.active)
                .items.find((u) => u.id === id)?.width ||
              defaultColumnSizes[id],
          })),
        })
      );
      dispatch({ type: ACTION.SET_COLUMNS_SETS, columnsSets: newColumnsSets });
      onColumnsSetsChange(newColumnsSets);
    },
    [columnsSets, defaultColumnSizes, onColumnsSetsChange]
  );

  const itemsSets = React.useMemo(
    () =>
      columnsSets.map(({ id, active, default: d, items, label }) => ({
        id,
        active,
        default: d,
        label,
        items: items.map(({ id }) => ({ id })),
      })),
    [columnsSets]
  );

  React.useEffect(() => {
    if (btnRefCanton.current !== null && confOpen) {
      const { left, top } = btnRefCanton.current.getBoundingClientRect();
      dispatch({
        type: ACTION.SET_POSITION_BUTTON_CANTON,
        btnFilterPosition: { left, top },
      });
    }
  }, [confOpen]);

  return (
    <div
      role="presentation"
      className={classnames({
        [classes.gridContainer]: true,
        [rootClassName]: !!rootClassName,
      })}
      onClick={onRootClick}
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
        columns={activeColumns}
      />
      <ConfigManagement
        title="Columns Sets"
        open={confOpen}
        disabled={disableConfigManagment}
        items={columns}
        itemsGroups={columnGroups}
        itemsSets={itemsSets}
        positionX={btnFilterPosition.left}
        positionY={btnFilterPosition.top + 30}
        onChange={cbOnConfChange}
        onClose={cbOnConfOpen}
      />
    </div>
  );
};

export default AdvancedGrid;
