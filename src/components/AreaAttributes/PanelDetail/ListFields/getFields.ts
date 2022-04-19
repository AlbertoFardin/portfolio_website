import {
  IColumn,
  TypeCell,
  getValueString,
} from "../../../../componentsBase/StickyGrid";
import { IAttribute } from "../../../../interfaces";

interface IField {
  id: string;
  label: string;
  value: string;
  type: TypeCell;
}

const getFields = (
  data: IAttribute,
  columns: IColumn[],
  fieldsId: string[]
): IField[] => {
  return fieldsId.reduce((acc: IField[], id: string) => {
    const column = columns.find((c) => c.id === id);

    if (column) {
      acc.push({
        id,
        label: column.label,
        value: getValueString(data[id], column.type),
        type: column.type,
      });
    }

    return acc;
  }, []);
};

export default getFields;
