import * as React from "react";
import { Severity, SheetLayout, IPermissionData } from "../../../interfaces";
import { ACT_VPORT } from "../reducer";
import { Grid, ICellClick, IGridRow } from "../../../componentsBase/StickyGrid";
import { ContextSetSnackbar } from "../../contexts";
import CatchCode, {
  KeyMap,
  IListener,
} from "../../../componentsBase/CatchCode";
import Btn from "../../../componentsBase/Btn";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import { ContextDispatchViewport } from "../contexts";
import { columns } from "../constants";
import FieldSearch from "../../FieldSearch";

const rowHeight = () => 60;

const useStyles = makeStyles({
  areaContent: {
    flex: 1,
    position: "relative",
    display: "flex",
    "flex-direction": "column",
  },
  flex1: {
    flex: 1,
  },
  toolbar: {
    padding: "0 10px",
  },
  divider: {
    margin: "0 10px",
  },
});

interface IContent {
  items: IPermissionData[];
  itemsRefresh: boolean;
  selectedId: string;
  searchInput: string;
}

const Content = ({
  items,
  itemsRefresh,
  selectedId,
  searchInput,
}: IContent) => {
  const classes = useStyles({});
  const setSnackbar = React.useContext(ContextSetSnackbar);
  const dispatchViewport = React.useContext(ContextDispatchViewport);

  const rows = React.useMemo(
    () =>
      items
        .filter((data) => {
          if (!searchInput) return true;
          const { id, label, description } = data;
          const inputUp = searchInput.toLocaleUpperCase();
          const match =
            !inputUp ||
            (id || "").toLocaleUpperCase().includes(inputUp) ||
            (label || "").toLocaleUpperCase().includes(inputUp) ||
            (description || "").toLocaleUpperCase().includes(inputUp);
          return match;
        })
        .map((data) => {
          return {
            id: data.id,
            selected: selectedId === data.id,
            data,
          };
        }, [] as IGridRow[]),
    [items, searchInput, selectedId]
  );
  const onDeselect = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.ITEMS_SELECT });
  }, [dispatchViewport]);
  const onCopyToClipboard = React.useCallback(
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
      dispatchViewport({ type: ACT_VPORT.ITEMS_SELECT, value: rowData.id });
    },
    [dispatchViewport, rows]
  );
  const onRowDoubleClick = React.useCallback(() => {
    dispatchViewport({
      type: ACT_VPORT.SHEET_LAYOUT,
      value: SheetLayout.OPENED,
    });
  }, [dispatchViewport]);
  const onRefresh = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.ITEMS_REFRESH });
  }, [dispatchViewport]);
  const listeners: IListener[] = React.useMemo(() => {
    return [{ toCatch: KeyMap.Escape, onCatch: onDeselect }];
  }, [onDeselect]);
  const onSearchInput = React.useCallback(
    (value: string) => {
      dispatchViewport({ type: ACT_VPORT.ITEMS_SEARCH, value });
    },
    [dispatchViewport]
  );

  return (
    <CatchCode listeners={listeners}>
      <div className={classes.areaContent}>
        <Toolbar className={classes.toolbar}>
          <FieldSearch
            placeholder="Search permissions..."
            value={searchInput}
            onChange={onSearchInput}
          />
          <div className={classes.flex1} />
          <Btn icon="refresh" tooltip="Refresh" onClick={onRefresh} />
          <Typography
            variant="body1"
            style={{ margin: 10 }}
            children={`${items.length} permissions`}
          />
        </Toolbar>
        <Divider className={classes.divider} />
        <Grid
          sidebarWidth={70}
          onRootClick={onDeselect}
          rootLoading={itemsRefresh}
          enabledColumnsMove={true}
          enabledColumnsRemove={false}
          enabledColumnsMultiSort={false}
          enabledColumnsResize={true}
          defaultColumns={columns}
          rowHeight={rowHeight}
          onRowClick={onRowClick}
          onRowDoubleClick={onRowDoubleClick}
          onRowCopyToClipboard={onCopyToClipboard}
          rows={rows}
        />
      </div>
    </CatchCode>
  );
};

export default Content;
