import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import { ACT_VPORT } from "../reducer";
import CellSidebar from "./CellSidebar";
import WindowStatus from "./WindowStatus";
import {
  Grid,
  ICellClick,
  IColumn,
  IRenderCellSidebar,
} from "../../../componentsBase/StickyGrid";
import { ContextSetSnackbar } from "../../contexts";
import { IAttribute, Severity, SheetLayout } from "../../../interfaces";
import CatchCode, {
  KeyMap,
  IListener,
} from "../../../componentsBase/CatchCode";
import { ContextDispatchViewport } from "../contexts";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import isEmpty from "lodash-es/isEmpty";
import last from "lodash-es/last";

const rowHeight = () => 60;
const isSearched = (item: IAttribute, text: string) => {
  const searchInputUp = text.toLocaleUpperCase();
  const { label, attributeName, atype } = item;
  const searchMatch =
    !searchInputUp ||
    (label || "").toLocaleUpperCase().includes(searchInputUp) ||
    (atype || "").toLocaleUpperCase().includes(searchInputUp) ||
    (attributeName || "").toLocaleUpperCase().includes(searchInputUp);
  return searchMatch;
};
const useStyles = makeStyles({
  content: {
    position: "relative",
    flex: 1,
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
  },
  toolbar: {
    padding: "0 15px",
  },
  flex1: {
    flex: 1,
  },
});

interface IContent {
  detailSheet: SheetLayout;
  items: IAttribute[];
  itemsIdSelected: string[];
  columns: IColumn[];
  searchInput: string;
  loading: boolean;
  conflicts: boolean;
}

const Content = ({
  detailSheet,
  items,
  itemsIdSelected,
  columns,
  searchInput,
  loading,
  conflicts,
}: IContent) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const setSnackbar = React.useContext(ContextSetSnackbar);
  const classes = useStyles({});

  const assetDataId = last(itemsIdSelected);
  const rows = React.useMemo(
    () =>
      items.reduce((acc, item) => {
        const searched = isSearched ? isSearched(item, searchInput) : true;
        if (!searched) return acc;

        const { id } = item;
        const selected = new Set(itemsIdSelected).has(item.id);
        const focused =
          selected && detailSheet === SheetLayout.OPENED && assetDataId === id;
        acc.push({
          id,
          focused,
          selected,
          data: item,
        });
        return acc;
      }, []),
    [assetDataId, detailSheet, items, itemsIdSelected, searchInput]
  );
  const onDeselect = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.ITEMS_DESELECT });
  }, [dispatchViewport]);
  const onRowCopyToClipboard = React.useCallback(
    (text: string) => {
      const maxLength = 20;
      const textFix =
        text.length > maxLength ? `${text.substr(0, maxLength)}...` : text;
      setSnackbar(Severity.INFO, `"${textFix}" is copied in your clipboard`);
    },
    [setSnackbar]
  );
  const onRowClick = React.useCallback(
    (p: ICellClick) => {
      const { rowIndex } = p;
      const rowData = rows[rowIndex].data;
      dispatchViewport({ type: ACT_VPORT.ITEMS_SELECT, payload: rowData.id });
    },
    [dispatchViewport, rows]
  );
  const onRowDoubleClick = React.useCallback(() => {
    dispatchViewport({
      type: ACT_VPORT.SHEET_LAYOUT,
      layout: SheetLayout.OPENED,
    });
  }, [dispatchViewport]);
  const renderCellSidebar = React.useCallback(
    (p: IRenderCellSidebar) => {
      const { rowIndex } = p;
      const rowData = rows[rowIndex].data;
      return <CellSidebar {...p} rowData={rowData} />;
    },
    [rows]
  );
  const listeners: IListener[] = React.useMemo(
    () => [{ toCatch: KeyMap.Escape, onCatch: onDeselect }],
    [onDeselect]
  );

  return (
    <CatchCode listeners={listeners}>
      <div className={classes.content}>
        <WindowStatus items={items} conflicts={conflicts} loading={loading} />
        <Grid
          onRootClick={onDeselect}
          rootLoading={loading || isEmpty(items)}
          renderCellSidebar={renderCellSidebar}
          enabledColumnsMove={true}
          enabledColumnsMultiSort={false}
          enabledColumnsResize={true}
          enabledColumnsRemove={false}
          defaultColumns={columns}
          sidebarWidth={90}
          rowHeight={rowHeight}
          onRowClick={onRowClick}
          onRowDoubleClick={onRowDoubleClick}
          onRowCopyToClipboard={onRowCopyToClipboard}
          rows={rows}
        />
      </div>
      <Divider />
      <Toolbar className={classes.toolbar}>
        <div className={classes.flex1} />
        <Typography
          variant="body1"
          style={{ margin: 10 }}
          children={
            !!searchInput
              ? `found ${rows.length} of ${items.length} attributes`
              : `${rows.length} attributes`
          }
        />
      </Toolbar>
    </CatchCode>
  );
};

export default Content;
