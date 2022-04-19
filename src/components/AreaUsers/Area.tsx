import * as React from "react";
import { columns } from "./constants";
import reducer, { reducerInitState, ACT_VPORT } from "./reducer";
import PanelDetail from "./PanelDetail";
import Content from "./Content";
import { IFilter, Severity, SheetLayout } from "../../interfaces";
import AreaContext from "./AreaContext";
import PanelFilters from "./PanelFilters";
import { ContextPermissions, ContextSetSnackbar } from "../contexts";
import {
  createUser,
  createUserAdmin,
  getAdminUsers,
  getTenantConf,
} from "../../getDataUsers";
import DialogUnsaved from "./DialogUnsaved";
import permissionsCheck from "../../utils/permissionsCheck";
import PERMISSIONS from "../../permissions";

const Area = () => {
  const setSnackbar = React.useContext(ContextSetSnackbar);
  const permissions = React.useContext(ContextPermissions);

  const canCreateUserAdmin = permissionsCheck({
    keys: [PERMISSIONS.users_admin_manage_is_warda_flag],
    permissions,
  });

  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const {
    selectedId,
    detailSheet,
    sortColumns,
    filters,
    applications,
    roles,
    users,
    userNew,
    userNewCreating,
    inEdit,
    dialogUnsaved,
  } = state;

  const onChangeLayout = React.useCallback((layout: SheetLayout) => {
    dispatch({ type: ACT_VPORT.SHEET_LAYOUT, value: layout });
  }, []);
  const onChangeFilters = React.useCallback((filters: IFilter[]) => {
    dispatch({ type: ACT_VPORT.FILTERS, filters });
  }, []);
  const onResetLayout = React.useCallback(() => {
    dispatch({ type: ACT_VPORT.SELECTED_ID });
  }, []);
  const userDetail = selectedId
    ? users.find(({ userId }) => userId === selectedId)
    : userNew;

  React.useEffect(() => {
    (async () => {
      try {
        if (users.length === 0) {
          const newUsers = await getAdminUsers();
          const tenantConf = await getTenantConf();

          dispatch({
            type: ACT_VPORT.USERS_SET,
            newUsers,
            newRoles: tenantConf.roles,
            newApplications: tenantConf.applications,
          });
        }
      } catch (error) {
        console.warn("AreaUsers", error);
        setSnackbar(Severity.WARNING, "Unable get users, please refresh");
      }
    })();
  }, [setSnackbar, users.length]);

  React.useEffect(() => {
    (async () => {
      if (userNewCreating) {
        if (canCreateUserAdmin) {
          await createUserAdmin(userNew);
        } else {
          await createUser(userNew);
        }

        dispatch({ type: ACT_VPORT.RESET });
      }
    })();
  }, [canCreateUserAdmin, userNew, userNewCreating]);

  return (
    <AreaContext
      dispatchViewport={dispatch}
      roles={roles}
      applications={applications}
    >
      <PanelFilters filters={filters} onChange={onChangeFilters} />
      <Content
        loading={users.length === 0 || userNewCreating}
        columns={columns}
        filters={filters}
        users={users}
        selectedId={selectedId}
        sortColumns={sortColumns}
        inEdit={inEdit}
      />
      <PanelDetail
        onResetLayout={onResetLayout}
        onChangeLayout={onChangeLayout}
        detailSheet={detailSheet}
        user={userDetail}
        inEdit={inEdit}
        loading={userNewCreating}
      />
      <DialogUnsaved open={dialogUnsaved} />
    </AreaContext>
  );
};

export default Area;
