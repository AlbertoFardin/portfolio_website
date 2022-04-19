import { EditFieldType, IColumnSc } from "../../../../interfaces";

const HEIGHT_DEFAULT = 42;

const getFieldHeight = (column: IColumnSc): number => {
  try {
    switch (column.editField.type) {
      case EditFieldType.MultiStringField:
      case EditFieldType.SelectField:
        return 88;
      case EditFieldType.TextAreaField:
        return 120;
      default:
        return HEIGHT_DEFAULT;
    }
  } catch {
    return HEIGHT_DEFAULT;
  }
};

export default getFieldHeight;
