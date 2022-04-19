import * as React from "react";
import { IM2m, IPermission, IUserProfile, Severity } from "../interfaces";
import { emptyFn } from "../componentsBase/utils/common";

export const ContextDispatchMain = React.createContext<React.Dispatch<unknown>>(
  emptyFn
);
export const ContextPermissions = React.createContext<IPermission[]>([]);
export const ContextSetSnackbar = React.createContext<
  (severity: Severity, message: string) => void
>(emptyFn);
export const ContextUsers = React.createContext<IUserProfile[]>([]);
export const ContextM2ms = React.createContext<IM2m[]>([]);
export const ContextCurrentUser = React.createContext<IUserProfile>(undefined);
