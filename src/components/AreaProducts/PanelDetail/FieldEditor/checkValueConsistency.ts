import { EditFieldType } from "../../../../interfaces";

const checkValueConsistency = (type: EditFieldType, value) => {
  let result = true;
  if (value !== undefined && value !== null)
    switch (type) {
      case EditFieldType.TextField:
      case EditFieldType.TextAreaField:
        if (typeof value !== "string") result = false;
        break;
      case EditFieldType.MultiStringField:
        const res = Array.isArray(value);
        if (!res) result = false;
        break;
      default:
        break;
    }
  return result;
};

export default checkValueConsistency;
