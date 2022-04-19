import {
  IFilter,
  FiltersCondition,
  ISort,
  IAggregation,
  IFile,
  IPath,
} from "../../../interfaces";
import { ISortOrder } from "../../../componentsBase/StickyGrid";

export interface ISearchFiles {
  userId: string;
  pathId: string;
  filters: IFilter[];
  filtersConditions: FiltersCondition;
  filtersThisFolder: boolean;
  paginationValue: number;
  paginationSize: number;
  sort: ISort;
}

export interface ISearchFilesParams {
  from: number;
  size: number;
  sortKey?: string;
  sortOrder?: ISortOrder;
  queryParentFolder?: string;
  queryFieldCondition?: FiltersCondition;
  queryFieldName?: string;
  queryFieldCreatedOnStart?: number;
  queryFieldCreatedOnEnd?: number;
  queryFieldExpirationDateStart?: number;
  queryFieldExpirationDateEnd?: number;
  queryFieldTags?: string;
}

export interface IGetFilesReturn {
  total: number;
  items: IFile[];
  path: IPath[];
}

export interface ISearchFilesResult extends IGetFilesReturn {
  success: boolean;
  aggregations: IAggregation[];
  queryPathId: string;
  queryUserId: string;
}

export const SEARCH_ERROR: ISearchFilesResult = {
  success: false,
  items: [],
  total: 0,
  path: [],
  aggregations: [],
  queryPathId: "",
  queryUserId: "",
};

export const SEARCH_EMPTY: ISearchFilesResult = {
  success: true,
  items: [],
  total: 0,
  path: [],
  aggregations: [],
  queryPathId: "",
  queryUserId: "",
};
