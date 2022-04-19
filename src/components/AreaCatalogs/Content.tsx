import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import { ACT_VPORT } from "./reducer";
import { Grid, ICellClick } from "../../componentsBase/StickyGrid";
import { ContextSetSnackbar } from "../contexts";
import { ICatalog, IColumnSc, Severity, SheetLayout } from "../../interfaces";
import CatchCode, { KeyMap, IListener } from "../../componentsBase/CatchCode";
import last from "lodash-es/last";

const rowHeight = () => 60;
const searchInputMatch = (item: ICatalog, text: string) => {
  const { id, displayName } = item;
  const inputUp = text.toLocaleUpperCase();
  const match =
    !inputUp ||
    id.toLocaleUpperCase().includes(inputUp) ||
    displayName.toLocaleUpperCase().includes(inputUp);
  return match;
};
const useStyles = makeStyles({
  content: {
    position: "relative",
    flex: 1,
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
  },
});

interface IContent {
  dispatchViewport: React.Dispatch<unknown>;
  loading: boolean;
  items: ICatalog[];
  itemsIdSelected: string[];
  columns: IColumnSc[];
  searchInput: string;
  detailSheet: SheetLayout;
}

const Content = ({
  dispatchViewport,
  loading,
  items,
  itemsIdSelected,
  columns,
  searchInput,
  detailSheet,
}: IContent) => {
  const setSnackbar = React.useContext(ContextSetSnackbar);
  const classes = useStyles({});
  const rows = React.useMemo(
    () =>
      items.reduce((acc, item) => {
        if (!searchInputMatch(item, searchInput)) return acc;

        const { id } = item;
        const selected = new Set(itemsIdSelected).has(item.id);
        const focused =
          selected &&
          detailSheet === SheetLayout.OPENED &&
          last(itemsIdSelected) === id;

        acc.push({
          id,
          focused,
          selected,
          data: item,
        });
        return acc;
      }, []),
    [detailSheet, items, itemsIdSelected, searchInput]
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
      dispatchViewport({ type: ACT_VPORT.ITEMS_SELECT, ids: [rowData.id] });
    },
    [dispatchViewport, rows]
  );
  const onRowDoubleClick = React.useCallback(() => {
    dispatchViewport({
      type: ACT_VPORT.SHEET_LAYOUT,
      layout: SheetLayout.OPENED,
    });
  }, [dispatchViewport]);
  const listeners: IListener[] = React.useMemo(
    () => [{ toCatch: KeyMap.Escape, onCatch: onDeselect }],
    [onDeselect]
  );

  return (
    <CatchCode listeners={listeners}>
      <div className={classes.content}>
        <Grid
          onRootClick={onDeselect}
          rootLoading={loading}
          enabledColumnsMove={true}
          enabledColumnsMultiSort={false}
          enabledColumnsResize={true}
          enabledColumnsRemove={false}
          defaultColumns={columns}
          rowHeight={rowHeight}
          onRowClick={onRowClick}
          onRowDoubleClick={onRowDoubleClick}
          onRowCopyToClipboard={onRowCopyToClipboard}
          rows={rows}
        />
      </div>
    </CatchCode>
  );
};

export default Content;
