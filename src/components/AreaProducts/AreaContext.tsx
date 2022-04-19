import * as React from "react";
import {
  IViewConf,
  IColumnSc,
  ICatalog,
  IItemEs,
  ICategory,
} from "../../interfaces";
import {
  ContextDispatchViewport,
  ContextCatalogs,
  ContextCategories,
  ContextColumns,
  ContextViews,
} from "./contexts";

interface IAreaContext {
  children: JSX.Element | React.ReactNode;
  dispatchViewport: React.Dispatch<unknown>;
  views: IViewConf[];
  columns: IColumnSc[];
  catalogs: ICatalog[];
  categories: IItemEs<ICategory>[];
}

const AreaContext = ({
  children,
  dispatchViewport,
  views,
  columns,
  catalogs,
  categories,
}: IAreaContext) => {
  return (
    <ContextDispatchViewport.Provider value={dispatchViewport}>
      <ContextViews.Provider value={views}>
        <ContextColumns.Provider value={columns}>
          <ContextCatalogs.Provider value={catalogs}>
            <ContextCategories.Provider value={categories}>
              {children}
            </ContextCategories.Provider>
          </ContextCatalogs.Provider>
        </ContextColumns.Provider>
      </ContextViews.Provider>
    </ContextDispatchViewport.Provider>
  );
};

export default AreaContext;
