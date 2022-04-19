import { TypeCell } from "../../componentsBase/StickyGrid";
import { DEFAULT_WIDTH_COLUMN } from "../../constants";
import { IColumnSc } from "../../interfaces";

const columns: IColumnSc[] = [
  {
    id: "id",
    label: "id",
    type: TypeCell.String,
    sortable: false,
    groupId: "default",
    width: DEFAULT_WIDTH_COLUMN,
    scope: [],
  },
  {
    id: "displayName",
    label: "displayName",
    type: TypeCell.String,
    sortable: false,
    groupId: "default",
    width: 200,
    scope: [],
  },
  {
    id: "fallback",
    label: "fallback",
    type: TypeCell.String,
    sortable: false,
    groupId: "default",
    width: 100,
    scope: [],
  },
  {
    id: "languages",
    label: "languages",
    type: TypeCell.MultipleString,
    sortable: false,
    groupId: "default",
    width: 350,
    scope: [],
  },
];

export default columns;
