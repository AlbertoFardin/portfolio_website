import * as React from "react";
import {
  IAdminUserProfile,
  IFilter,
  Severity,
  SheetLayout,
} from "../../../interfaces";
import { ACT_VPORT } from "../reducer";
import Btn from "../../../componentsBase/Btn";
import {
  Grid,
  ICellClick,
  IRenderCellContent,
  IRenderCellSidebar,
  IColumn,
  CellAvatar,
  SortColumn,
  IGridRow,
} from "../../../componentsBase/StickyGrid";
import { ContextPermissions, ContextSetSnackbar } from "../../contexts";
import CatchCode, {
  KeyMap,
  IListener,
} from "../../../componentsBase/CatchCode";
import { EMAIL_KEY, ROLES_KEY, TENANT_KEY } from "../constants";
import { colorTheme, USER_AVATAR_PLACEHOLDER } from "../../../constants";
import PERMISSIONS from "../../../permissions";
import permissionsCheck from "../../../utils/permissionsCheck";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Divider from "@material-ui/core/Divider";
import filterUsers from "../filterUsers";
import getItemsTenants from "../getItemsTenants";
import getItemsRoles from "../getItemsRoles";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import CellEmail from "./CellEmail";
import CellChips from "./CellChips";
import { ContextDispatchViewport } from "../contexts";

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
  loading: boolean;
  columns: IColumn[];
  filters: IFilter[];
  users: IAdminUserProfile[];
  selectedId: string;
  sortColumns: SortColumn[];
  inEdit: boolean;
}

const Content = ({
  loading,
  columns,
  filters,
  users,
  selectedId,
  sortColumns,
  inEdit,
}: IContent) => {
  const setSnackbar = React.useContext(ContextSetSnackbar);
  const permissions = React.useContext(ContextPermissions);
  const dispatchViewport = React.useContext(ContextDispatchViewport);

  const classes = useStyles({});
  const canCreate = permissionsCheck({
    keys: [PERMISSIONS.users_create_user],
    permissions,
  });

  const rows = React.useMemo(
    () =>
      filterUsers(users, filters).map((item) => {
        const { userId, tenants, profileData, roles } = item;
        const data = {
          ...profileData,
          userId,
          tenants: getItemsTenants(tenants),
          roles: getItemsRoles(roles),
        };

        return {
          id: userId,
          selected: selectedId === userId,
          data,
        };
      }, [] as IGridRow[]),
    [filters, selectedId, users]
  );
  const onDeselect = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.SELECTED_ID });
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
      dispatchViewport({ type: ACT_VPORT.SELECTED_ID, value: rowData.userId });
    },
    [dispatchViewport, rows]
  );
  const renderCellContent = React.useCallback(
    (p: IRenderCellContent) => {
      const { columnData } = p;
      const { id } = columnData;

      if (id === EMAIL_KEY) {
        return <CellEmail cell={p} rows={rows} />;
      }

      if (id === ROLES_KEY || id === TENANT_KEY) {
        return <CellChips cell={p} rows={rows} />;
      }

      return null;
    },
    [rows]
  );
  const renderCellSidebar = React.useCallback((p: IRenderCellSidebar) => {
    return (
      <CellAvatar
        {...p}
        focused={false}
        style={{}}
        value={p.rowData.picture || USER_AVATAR_PLACEHOLDER}
      />
    );
  }, []);
  const onRowDoubleClick = React.useCallback(() => {
    dispatchViewport({
      type: ACT_VPORT.SHEET_LAYOUT,
      value: SheetLayout.OPENED,
    });
  }, [dispatchViewport]);
  const listeners: IListener[] = React.useMemo(() => {
    return [{ toCatch: KeyMap.Escape, onCatch: onDeselect }];
  }, [onDeselect]);
  const renderCanton = React.useCallback(
    () => <Typography>Avatar</Typography>,
    []
  );
  const onHeaderClick = React.useCallback(
    (sorts: SortColumn[]) => {
      dispatchViewport({ type: ACT_VPORT.SORT_BY, sorts });
    },
    [dispatchViewport]
  );
  const onCreateUser = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.USER_ADDED });
  }, [dispatchViewport]);

  return (
    <CatchCode listeners={listeners}>
      <div className={classes.areaContent}>
        <Toolbar className={classes.toolbar}>
          {!canCreate ? null : (
            <Btn
              color={colorTheme}
              variant="bold"
              label="Create user"
              disabled={loading || inEdit}
              onClick={onCreateUser}
            />
          )}
          <div className={classes.flex1} />
          <Typography
            variant="body1"
            style={{ margin: 10 }}
            children={`${users.length} users`}
          />
        </Toolbar>
        <Divider className={classes.divider} />
        <Grid
          sidebarWidth={70}
          renderCellSidebar={renderCellSidebar}
          renderCellContent={renderCellContent}
          renderCanton={renderCanton}
          onRootClick={onDeselect}
          rootLoading={loading}
          enabledColumnsMove={true}
          enabledColumnsRemove={false}
          enabledColumnsMultiSort={false}
          enabledColumnsResize={true}
          defaultColumns={columns}
          rowHeight={rowHeight}
          onRowClick={onRowClick}
          onRowDoubleClick={onRowDoubleClick}
          onRowCopyToClipboard={onCopyToClipboard}
          onHeaderClick={onHeaderClick}
          columnsSort={sortColumns}
          rows={rows}
        />
      </div>
    </CatchCode>
  );
};

export default Content;
