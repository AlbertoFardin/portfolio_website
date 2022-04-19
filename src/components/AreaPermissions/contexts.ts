import * as React from "react";
import { emptyFn } from "../../componentsBase/utils/common";

export const ContextDispatchViewport = React.createContext<
  React.Dispatch<unknown>
>(emptyFn);
