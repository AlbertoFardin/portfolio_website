import { Toolbar, Divider, Typography } from "@material-ui/core";
import { action } from "@storybook/addon-actions";
import * as React from "react";
import { IActions } from "../../ActionsMenu";
import Btn from "../../Btn/Btn";
import CellString from "../CellContent/CellString";
import hexToRgbA from "../../utils/hexToRgbA";
import Grid from "../Grid";
import MockItems from "./List_Items";
import MockColumns from "./List_Columns";
import isEqual from "lodash-es/isEqual";
import { emptyFn } from "../../utils/common";
import {
  ICellClick,
  ICellRenderer,
  IColumn,
  ISortOrder,
  SortColumn,
  TypeCell,
} from "../interfaces";

const idCustom = "idCustom";
const ColumnsIndex: IColumn[] = [
  {
    type: TypeCell.String,
    id: "index",
    label: "Index",
    width: 60,
    sortable: true,
    defaultSorting: {
      priority: 0,
      sorting: ISortOrder.ASC,
    },
  },
];
const ColumsCustom: IColumn[] = [
  {
    type: TypeCell.String,
    id: "idStringNoValue",
    label: "String NO_VALUE",
    width: 150,
  },
  {
    type: TypeCell.Bool,
    id: idCustom,
    label: "CUSTOM",
    width: 150,
  },
];
const Columns: IColumn[] = [].concat(ColumnsIndex, MockColumns, ColumsCustom);

const contextmenu: IActions[] = [
  {
    id: "font_download",
    label: "font_download",
    onClick: action("font_download"),
    icon: "font_download",
    disabled: true,
  },
  {
    id: "file_copy",
    label: "file_copy",
    onClick: action("file_copy"),
    icon: "file_copy",
  },
  {
    id: "send",
    label: "send",
    onClick: action("send"),
    icon: "send",
  },
  {
    divider: true,
    id: "edit",
    label: "edit",
    onClick: action("edit"),
    icon: "edit",
  },
];
const initialItems = []
  .concat(MockItems, MockItems, MockItems, MockItems, MockItems, MockItems)
  .map((item, index) => ({
    data: { index, ...item },
    id: `_${index}`,
  }));
const defaultSortColumns = [
  {
    id: ColumnsIndex[0].id,
    order: ISortOrder.ASC,
  },
  {
    id: MockColumns[0].id,
    order: ISortOrder.ASC,
  },
  {
    id: MockColumns[1].id,
    order: ISortOrder.ASC,
  },
];

const getHeaderStyle = (enableMultiSort: boolean, sort: SortColumn[]) => {
  if (!enableMultiSort) return undefined;
  return isEqual(sort, defaultSortColumns) ? hexToRgbA("#00f", 0.05) : "#f00";
};

interface IBtnSelection {
  selected: boolean;
  label: string;
  onClick: () => void;
}

const BtnSelection = ({ selected, label, onClick }: IBtnSelection) => {
  return (
    <Btn
      icon={selected ? "check_box" : "check_box_outline_blank"}
      label={label}
      selected={selected}
      onClick={onClick}
    />
  );
};

enum ACTION {
  SET_ITEM_SELECTED = "SET_ITEM_SELECTED",
  SET_LOADING = "SET_LOADING",
  SET_ON_SAVE = "SET_ON_SAVE",
  SET_SORT = "SET_SORT",
  SET_CHANGE_ENABLE_MULTISORT = "SET_CHANGE_ENABLE_MULTISORT",
  SET_COLUMN_STICKY = "SET_COLUMN_STICKY",
  SET_ENABLE_COLUMNS_MOVE = "SET_ENABLE_COLUMNS_MOVE",
  SET_ENABLE_COLUMNS_RESIZE = "SET_ENABLE_COLUMNS_RESIZE",
  RESET_SELECTION = "RESET_SELECTION",
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION.SET_ITEM_SELECTED:
      const { items } = state;
      const { rowIndex, selected } = action;
      const newItems = items.map((i, index) =>
        index === rowIndex ? { ...i, selected: !selected } : i
      );
      return { ...state, items: newItems };
    case ACTION.RESET_SELECTION:
      return {
        ...state,
        items: state.items.maps((i) => ({ ...i, selected: false })),
      };
    case ACTION.SET_LOADING:
    case ACTION.SET_ON_SAVE:
    case ACTION.SET_SORT:
    case ACTION.SET_CHANGE_ENABLE_MULTISORT:
    case ACTION.SET_COLUMN_STICKY:
    case ACTION.SET_ENABLE_COLUMNS_MOVE:
    case ACTION.SET_ENABLE_COLUMNS_RESIZE:
      return { ...state, ...action };
    default:
      throw new Error();
  }
};

const DemoGrid = () => {
  const [state, dispatch] = React.useReducer(reducer, {
    items: initialItems,
    loading: false,
    sort: [],
    columnsEnableMultiSort: false,
    selectedIds: [],
    columnsEnableResize: true,
    columnsEnableMove: true,
    columnsEnableSticky: true,
  });
  const {
    items,
    sort,
    columnsEnableMultiSort,
    columnsEnableSticky,
    columnsEnableMove,
    columnsEnableResize,
  } = state;
  const cbOnChangeEnableSticky = React.useCallback(() => {
    dispatch({
      type: ACTION.SET_CHANGE_ENABLE_MULTISORT,
      columnsEnableSticky: !columnsEnableSticky,
    });
  }, [columnsEnableSticky]);
  const cbOnChangeEnableMove = React.useCallback(() => {
    dispatch({
      type: ACTION.SET_ENABLE_COLUMNS_MOVE,
      columnsEnableMove: !columnsEnableMove,
    });
  }, [columnsEnableMove]);
  const cbOnChangeEnableResize = React.useCallback(() => {
    dispatch({
      type: ACTION.SET_ENABLE_COLUMNS_RESIZE,
      columnsEnableResize: !columnsEnableResize,
    });
  }, [columnsEnableResize]);

  const cbOnChangeEnableMultiSort = React.useCallback(() => {
    dispatch({
      type: ACTION.SET_CHANGE_ENABLE_MULTISORT,
      sort: !columnsEnableMultiSort ? defaultSortColumns : [],
      columnsEnableMultiSort: !columnsEnableMultiSort,
    });
  }, [columnsEnableMultiSort]);
  const cbOnColumnsChange = React.useCallback((newStruct) => {
    action("columnsChange")(newStruct);
  }, []);
  const rowOnClickCb = React.useCallback((item) => {
    const { rowIndex, selected } = item;
    dispatch({ type: ACTION.SET_ITEM_SELECTED, rowIndex, selected });
    action("rowOnClick")(item);
  }, []);
  const cbRowOnDoubleClick = React.useCallback((p: ICellClick) => {
    action("rowOnDoubleClick")(p);
  }, []);
  const cbHeaderOnClick = React.useCallback((args) => {
    const applySort = args.length > 0 ? args : defaultSortColumns;
    dispatch({ type: ACTION.SET_SORT, sort: applySort });
    action("onHeaderClick")(args);
  }, []);
  const cbRowOnCopyToClipboard = React.useCallback((p: string) => {
    action("rowOnCopyToClipboard")(p);
  }, []);
  const cbRowOnContextMenu = React.useCallback((p: ICellClick) => {
    action("rowOnContextMenu")(p);
  }, []);
  const cbRenderCellPlaceholder = React.useCallback(
    ({ style, rowIndex, columnIndex, selected, focused }: ICellRenderer) => {
      return (
        <CellString
          value="No value"
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          selected={selected}
          focused={focused}
          style={{ ...style, position: "absolute" }}
          onClick={rowOnClickCb}
          onDoubleClick={cbRowOnDoubleClick}
          onContextMenu={cbRowOnContextMenu}
          contextmenu={contextmenu}
        />
      );
    },
    [rowOnClickCb, cbRowOnContextMenu, cbRowOnDoubleClick]
  );
  const cbRenderCellContent = React.useCallback(
    ({ style, rowIndex, columnIndex, selected, focused }: ICellRenderer) => {
      const column = Columns[columnIndex];
      if (column.id !== idCustom) return null;
      return (
        <CellString
          value="MY CUSTOM CELL"
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          selected={selected}
          focused={focused}
          style={{ ...style, position: "absolute" }}
          onClick={rowOnClickCb}
          onDoubleClick={cbRowOnDoubleClick}
          onContextMenu={cbRowOnContextMenu}
          contextmenu={contextmenu}
        />
      );
    },
    [rowOnClickCb, cbRowOnContextMenu, cbRowOnDoubleClick]
  );
  const cbRenderSidebar = React.useCallback(
    ({ rowIndex, selected }: ICellRenderer) => {
      return (
        <Typography
          variant="body1"
          style={selected ? { color: "#fff" } : { backgroundColor: "#f00" }}
          children={`row ${rowIndex}`}
        />
      );
    },
    []
  );

  return (
    <div
      style={{
        height: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Toolbar>
        <div style={{ flex: 1 }} />
        <BtnSelection
          label="columnsMove"
          selected={columnsEnableMove}
          onClick={cbOnChangeEnableMove}
        />
        <BtnSelection
          label="columnsResize"
          selected={columnsEnableResize}
          onClick={cbOnChangeEnableResize}
        />
        <BtnSelection
          label="columnsMultiSort"
          selected={columnsEnableMultiSort}
          onClick={cbOnChangeEnableMultiSort}
        />
        <BtnSelection
          label="columnsStickyRender"
          selected={columnsEnableSticky}
          onClick={cbOnChangeEnableSticky}
        />
      </Toolbar>
      <Divider />
      <Grid
        renderCellSidebar={(columnsEnableSticky && cbRenderSidebar) || emptyFn}
        renderCellContent={cbRenderCellContent}
        renderCellPlaceholder={cbRenderCellPlaceholder}
        rows={items}
        defaultColumns={Columns}
        onRowClick={rowOnClickCb}
        enabledColumnsMove={columnsEnableMove}
        enabledColumnsResize={columnsEnableResize}
        enabledColumnsMultiSort={columnsEnableMultiSort}
        onColumnsChange={cbOnColumnsChange}
        rowContextmenu={contextmenu}
        onRowDoubleClick={cbRowOnDoubleClick}
        onRowCopyToClipboard={cbRowOnCopyToClipboard}
        onHeaderClick={cbHeaderOnClick}
        columnsSort={sort}
        headerBackgroundColor={getHeaderStyle(columnsEnableMultiSort, sort)}
      />
    </div>
  );
};
export default DemoGrid;
