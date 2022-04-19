import { emptyFn } from "../../componentsBase/utils/common";
import * as React from "react";

export const ContextDispatchViewport = React.createContext<
  React.Dispatch<unknown>
>(emptyFn);
