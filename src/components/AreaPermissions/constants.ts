import { IColumn, TypeCell } from "../../componentsBase/StickyGrid";

export const KEY_ID = "id";
export const KEY_OWNER = "owner";
export const KEY_LABEL = "label";
export const KEY_DESCR = "description";
export const KEY_VISIB = "visibleInTenants";

export const columns: IColumn[] = [
  {
    id: KEY_OWNER,
    label: "Owner",
    type: TypeCell.String,
    sortable: true,
    width: 160,
  },
  {
    id: KEY_VISIB,
    label: "Visible in tenants",
    type: TypeCell.Bool,
    sortable: true,
    width: 130,
  },
  {
    id: KEY_ID,
    label: "Id",
    type: TypeCell.String,
    sortable: true,
    width: 250,
  },
  {
    id: KEY_LABEL,
    label: "Label",
    type: TypeCell.String,
    sortable: true,
    width: 300,
  },
  {
    id: KEY_DESCR,
    label: "Description",
    type: TypeCell.String,
    sortable: true,
    width: 700,
  },
];
