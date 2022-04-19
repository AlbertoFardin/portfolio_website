import { IFacetType } from "../../componentsBase/Facets";
import { ISortOrder } from "../../componentsBase/StickyGrid";
import { DATE_FORMAT } from "../../constants";
import { IFilter, IPath } from "../../interfaces";

export const ROOT_MYFILE_ID = "root";
export const ROOT_MYFILE_LABEL = "My Files";
export const ROOT_SHARED_ID = "privateshares";
export const ROOT_SHARED_LABEL = "Shared with Me";
export const ORGANIZATION_ID = "all-internal";

export const FOLDER_MYFILE: IPath[] = [
  {
    name: ROOT_MYFILE_LABEL,
    id: ROOT_MYFILE_ID,
    owner: "",
    sharedWith: [],
  },
];
export const FOLDER_SHARED: IPath[] = [
  {
    name: ROOT_SHARED_LABEL,
    id: ROOT_SHARED_ID,
    owner: "",
    sharedWith: [],
  },
];

export enum FIELD_ID {
  NAME = "name",
  TAGS = "tags.name",
  CREATE = "createdOn",
  EXPIRATION = "expiration",
}

export const FILTERS: IFilter[] = [
  {
    keyword: true,
    label: "Name",
    id: FIELD_ID.NAME,
    type: IFacetType.TEXTAREA,
    showCaseSensitiveSwitch: false,
  },
  {
    keyword: false,
    label: "Creation Date",
    id: FIELD_ID.CREATE,
    type: IFacetType.DATEPICKER,
    dateFormat: DATE_FORMAT,
  },
  {
    keyword: true,
    label: "Tags",
    id: FIELD_ID.TAGS,
    type: IFacetType.MULTISELECTION,
  },
  {
    keyword: false,
    label: "Copyright expiration",
    id: FIELD_ID.EXPIRATION,
    type: IFacetType.DATEPICKER,
    dateFormat: DATE_FORMAT,
  },
];

export const PAGINATIONS = [250, 500];

export const SORTS = [
  {
    id: FIELD_ID.NAME,
    label: "Name",
    order: ISortOrder.ASC,
    keyword: true,
  },
  {
    id: FIELD_ID.CREATE,
    label: "Creation Date",
    order: ISortOrder.ASC,
    keyword: false,
  },
];

export const errorNoFoundDetail =
  "Unable get file data, please refresh and retry";
export const errorSomethingWrong = "Something went wrong, please retry";

export const DIFFERENT_VALUES = "___DIFFERENT_VALUES";
