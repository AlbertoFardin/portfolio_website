import { emptyFn } from "../../componentsBase/utils/common";
import * as React from "react";
import {
  IItemEs,
  ICategory,
  IColumnSc,
  ICatalog,
  IViewConf,
} from "../../interfaces";

export const ContextDispatchViewport = React.createContext<
  React.Dispatch<unknown>
>(emptyFn);
export const ContextDispatchDetail = React.createContext<
  React.Dispatch<unknown>
>(emptyFn);
export const ContextViews = React.createContext<IViewConf[]>([]);
export const ContextColumns = React.createContext<IColumnSc[]>([]);
export const ContextCatalogs = React.createContext<ICatalog[]>([]);
export const ContextCategories = React.createContext<IItemEs<ICategory>[]>([]);
