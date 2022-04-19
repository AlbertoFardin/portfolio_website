import * as React from "react";
import {
  ContextDispatchMain,
  ContextM2ms,
  ContextUsers,
  ContextSetSnackbar,
  ContextPermissions,
  ContextCurrentUser,
} from "./contexts";
import { IM2m, IPermission, IUserProfile, Severity } from "../interfaces";
import { ACTION_MAIN } from "./reducer";
import permissions from "../permissions";

interface IMainContext {
  children: JSX.Element | React.ReactNode;
  dispatchMain: React.Dispatch<unknown>;
  permissions: IPermission[];
  users: IUserProfile[];
  m2ms: IM2m[];
  userProfile: IUserProfile;
}

const MainContext = ({
  children,
  dispatchMain,
  permissions: permissionFromBe,
  users,
  m2ms,
  userProfile,
}: IMainContext) => {
  const setSnackbar = React.useCallback(
    (severity: Severity, message: string) => {
      dispatchMain({
        type: ACTION_MAIN.SNACKBAR_UPDATE,
        message,
        severity,
      });
    },
    [dispatchMain]
  );

  let permissionsToPass = permissionFromBe;
  try {
    // feature toogle to inject permissions on UI and to enable all features for debugging purposes
    if (process.env.ENABLE_ALL_UI_PERMISSION === "true") {
      permissionsToPass = Object.entries(permissions)
        .map(([key, value]) => ({ key, value }))
        .map(({ value }) => ({
          id: value,
          label: value,
        }));
    }
  } catch (err) {}

  return (
    <ContextDispatchMain.Provider value={dispatchMain}>
      <ContextPermissions.Provider value={permissionsToPass}>
        <ContextSetSnackbar.Provider value={setSnackbar}>
          <ContextCurrentUser.Provider value={userProfile}>
            <ContextUsers.Provider value={users}>
              <ContextM2ms.Provider value={m2ms}>
                {children}
              </ContextM2ms.Provider>
            </ContextUsers.Provider>
          </ContextCurrentUser.Provider>
        </ContextSetSnackbar.Provider>
      </ContextPermissions.Provider>
    </ContextDispatchMain.Provider>
  );
};

export default MainContext;
