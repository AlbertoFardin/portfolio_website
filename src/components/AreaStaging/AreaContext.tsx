import * as React from "react";
import { IColumnSc } from "../../interfaces";
import { ContextDispatchViewport, ContextColumns } from "./contexts";

interface IAreaContext {
  children: JSX.Element | React.ReactNode;
  dispatchViewport: React.Dispatch<unknown>;
  columns: IColumnSc[];
}

const AreaContext = ({ children, dispatchViewport, columns }: IAreaContext) => {
  return (
    <ContextDispatchViewport.Provider value={dispatchViewport}>
      <ContextColumns.Provider value={columns}>
        {children}
      </ContextColumns.Provider>
    </ContextDispatchViewport.Provider>
  );
};

export default AreaContext;
