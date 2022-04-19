import * as React from "react";
import { IRole } from "../../interfaces";
import {
  ContextDispatchViewport,
  ContextRoles,
  ContextApplications,
} from "./contexts";

interface IAreaContext {
  children: JSX.Element | React.ReactNode;
  dispatchViewport: React.Dispatch<unknown>;
  roles: IRole[];
  applications: string[];
}

const AreaContext = ({
  children,
  dispatchViewport,
  roles,
  applications,
}: IAreaContext) => {
  return (
    <ContextDispatchViewport.Provider value={dispatchViewport}>
      <ContextRoles.Provider value={roles}>
        <ContextApplications.Provider value={applications}>
          {children}
        </ContextApplications.Provider>
      </ContextRoles.Provider>
    </ContextDispatchViewport.Provider>
  );
};

export default AreaContext;
