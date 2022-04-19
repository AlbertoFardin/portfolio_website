import { TypeCell } from "../../componentsBase/StickyGrid";
import { IColumnSc } from "../../interfaces";

const columns: IColumnSc[] = [
  {
    id: "catalog",
    label: "catalog",
    type: TypeCell.String,
    sortable: false,
    groupId: "default",
    width: 100,
    scope: [],
  },
  {
    id: "path",
    label: "path",
    type: TypeCell.String,
    sortable: false,
    groupId: "default",
    width: 230,
    scope: [],
  },
  {
    id: "labels",
    label: "labels",
    type: TypeCell.String,
    sortable: false,
    groupId: "default",
    width: 600,
    scope: [],
  },
];

export default columns;
