import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import { ACT_VPORT } from "./reducer";
import { Grid, ICellClick } from "../../componentsBase/StickyGrid";
import { ContextSetSnackbar } from "../contexts";
import {
  IItemEs,
  ICategory,
  IColumnSc,
  Severity,
  SheetLayout,
} from "../../interfaces";
import CatchCode, { KeyMap, IListener } from "../../componentsBase/CatchCode";
import last from "lodash-es/last";
import getCategoryPath from "./getCategoryPath";
import { IBtn } from "../../componentsBase/Btn";

const rowHeight = () => 60;
const isSearched = (data: ICategory, text: string) => {
  const { searchableValue } = data;
  const inputUp = text.toLocaleUpperCase();
  const match =
    !inputUp || searchableValue.toLocaleUpperCase().includes(inputUp);
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

const ERR_NO_LANGUAGE = "ERR_NO_LANGUAGE";
const mapError: { [err: string]: IBtn } = {
  [ERR_NO_LANGUAGE]: {
    variant: "light",
    label: "-",
    tooltip: "Select a valid language",
  },
};

interface IContent {
  dispatchViewport: React.Dispatch<unknown>;
  loading: boolean;
  items: IItemEs<ICategory>[];
  itemsIdSelected: string[];
  columns: IColumnSc[];
  searchInput: string;
  detailSheet: SheetLayout;
  language: string;
}

const Content = ({
  dispatchViewport,
  loading,
  items,
  itemsIdSelected,
  columns,
  searchInput,
  detailSheet,
  language,
}: IContent) => {
  const setSnackbar = React.useContext(ContextSetSnackbar);
  const classes = useStyles({});
  const rows = React.useMemo(
    () =>
      items.reduce((acc, item) => {
        const { id, data } = item;

        const searched = isSearched ? isSearched(data, searchInput) : true;
        if (!searched) return acc;

        const selected = new Set(itemsIdSelected).has(id);
        const focused =
          selected &&
          detailSheet === SheetLayout.OPENED &&
          last(itemsIdSelected) === id;

        acc.push({
          id,
          focused,
          selected,
          data: {
            ...data,
            path: getCategoryPath({
              categoryId: id,
              languageId: language,
              categories: items,
            }),
          },
        });
        return acc;
      }, []),
    [detailSheet, items, itemsIdSelected, searchInput, language]
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
      const rowId = rows[rowIndex].id;
      dispatchViewport({ type: ACT_VPORT.ITEMS_SELECT, ids: [rowId] });
    },
    [dispatchViewport, rows]
  );
  const onRowDoubleClick = React.useCallback(() => {
    dispatchViewport({
      type: ACT_VPORT.SHEET_LAYOUT,
      layout: SheetLayout.OPENED,
    });
  }, [dispatchViewport]);
  const getCellValue = React.useCallback((rowData, column: IColumnSc) => {
    const { id } = column;
    const value = rowData[id];
    if (id === "path" && !value) return ERR_NO_LANGUAGE;
    return value;
  }, []);
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
          getCellValue={getCellValue}
          mapError={mapError}
        />
      </div>
    </CatchCode>
  );
};

export default Content;
