import IFacetType from "../../componentsBase/Facets/IFacetType";
import { IColumn, TypeCell } from "../../componentsBase/StickyGrid";

export const FIRST_NAME_KEY = "firstName";
export const LAST_NAME_KEY = "lastName";
export const ID_KEY = "userId";
export const CREATED_AT_KEY = "createdAt";
export const UPDATED_AT_KEY = "updatedAt";
export const ROLES_KEY = "roles";
export const TENANT_KEY = "tenants";
export const EMAIL_KEY = "email";
export const EMAIL_VERIFIED_KEY = "activated";
export const WARDA_KEY = "isWarda";

interface IColumnUser extends IColumn {
  filter: IFacetType;
}

export const columns: IColumnUser[] = [
  {
    id: FIRST_NAME_KEY,
    label: "First Name",
    type: TypeCell.String,
    sortable: true,
    width: 150,
    filter: IFacetType.TEXTAREA,
  },
  {
    id: LAST_NAME_KEY,
    label: "Last Name",
    type: TypeCell.String,
    sortable: true,
    width: 150,
    filter: IFacetType.TEXTAREA,
  },
  {
    id: EMAIL_KEY,
    label: "Email",
    type: TypeCell.String,
    sortable: true,
    width: 200,
    filter: IFacetType.TEXTAREA,
  },
  {
    id: EMAIL_VERIFIED_KEY,
    label: "Email Verified",
    type: TypeCell.Bool,
    sortable: false,
    width: 0, // hide column
    filter: IFacetType.BOOLEAN,
  },
  {
    id: ROLES_KEY,
    label: "Roles",
    type: TypeCell.String,
    sortable: false,
    width: 250,
    filter: IFacetType.MULTISELECTION,
  },
  {
    id: ID_KEY,
    label: "ID",
    type: TypeCell.String,
    sortable: false,
    width: 160,
    filter: IFacetType.TEXTAREA,
  },
  {
    id: CREATED_AT_KEY,
    label: "Creation Date",
    type: TypeCell.Timestamp,
    sortable: true,
    width: 160,
    filter: IFacetType.DATEPICKER,
  },
  {
    id: UPDATED_AT_KEY,
    label: "Last Edit",
    type: TypeCell.Timestamp,
    sortable: true,
    width: 160,
    filter: IFacetType.DATEPICKER,
  },
  {
    id: WARDA_KEY,
    label: "Is Warda",
    type: TypeCell.Bool,
    sortable: false,
    width: 80,
    filter: IFacetType.BOOLEAN,
  },
  {
    id: TENANT_KEY,
    label: "Tenants",
    type: TypeCell.String,
    sortable: false,
    width: 600,
    filter: undefined,
  },
];
