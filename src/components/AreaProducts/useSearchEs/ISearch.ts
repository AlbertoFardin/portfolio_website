import {
  IProduct,
  IContentSort,
  IColumnSc,
  IFilter,
  ICatalog,
  ISearchEs,
  IResultEs,
  FiltersCondition,
} from "../../../interfaces";

export interface IUseSearchEs {
  history;
  searchEs: (k: ISearchEs) => Promise<IResultEs>;
  catalogs: ICatalog[];
  columns: IColumnSc[];
  filters: IFilter[];
  filtersCondition: FiltersCondition;
  paginationValue: number;
  paginationSize: number;
  sortsContent: IContentSort[];
  itemsIdSelected?: string[];
  loadOnlySelected?: boolean;
  itemIdFromUrl: string;
  detailFullscreen: boolean;
  catalogId?: string;
  languageId?: string;
}

export interface IUseResultEs {
  success: boolean;
  items: IProduct[];
  itemsTotal: number;
  catalogs: ICatalog[];
  columns: IColumnSc[];
  filters: IFilter[];
  sortsContent: IContentSort[];
}

export const SEARCH_ES_EMPTY: IUseResultEs = {
  success: false,
  items: [],
  itemsTotal: 0,
  catalogs: [],
  columns: [],
  filters: [],
  sortsContent: [],
};

export interface IReturnHook {
  loading: boolean;
  status: string;
  error?: Error;
  result?: IUseResultEs;
}
