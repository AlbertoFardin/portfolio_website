import * as React from "react";
import { ContextDispatchViewport } from "./contexts";

interface IAreaContext {
  children: JSX.Element | React.ReactNode;
  dispatchViewport: React.Dispatch<unknown>;
}

const AreaContext = ({ children, dispatchViewport }: IAreaContext) => {
  return (
    <ContextDispatchViewport.Provider value={dispatchViewport}>
      {children}
    </ContextDispatchViewport.Provider>
  );
};

export default AreaContext;
