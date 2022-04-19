import { emptyFn } from "../../componentsBase/utils/common";
import * as React from "react";
import { IColumnSc } from "../../interfaces";

export const ContextDispatchViewport = React.createContext<
  React.Dispatch<unknown>
>(emptyFn);
export const ContextColumns = React.createContext<IColumnSc[]>([]);
