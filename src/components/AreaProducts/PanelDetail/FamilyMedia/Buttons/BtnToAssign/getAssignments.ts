import { KEY_ASSIGNMENTS } from "../../../../../../constants";
import {
  IProduct,
  IAssignmentContentType,
  IAssignment,
} from "../../../../../../interfaces";

const getAssignments = (
  assetData: IProduct,
  viewName: string
): IAssignment[] => {
  return (assetData[KEY_ASSIGNMENTS] || []).filter(
    ({ id, contentType }: IAssignment) => {
      const checkType = contentType === IAssignmentContentType.VIEW;
      const checkName = id === viewName;
      return checkType && checkName;
    }
  );
};

export default getAssignments;
