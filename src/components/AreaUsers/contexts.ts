import * as React from "react";
import { emptyFn } from "../../componentsBase/utils/common";
import { IRole } from "../../interfaces";

export const ContextDispatchViewport = React.createContext<
  React.Dispatch<unknown>
>(emptyFn);
export const ContextRoles = React.createContext<IRole[]>([]);
export const ContextApplications = React.createContext<string[]>([]);
