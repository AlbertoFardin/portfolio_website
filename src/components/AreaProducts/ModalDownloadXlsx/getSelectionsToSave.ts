import { v4 as uuidv4 } from "uuid";
import * as moment from "moment";
import { DATE_FORMAT } from "../../../constants";
import { ISelection } from "./reducer";

const getSelectionsToSave = (
  selections: ISelection[],
  attributesSelected: string[]
): ISelection[] => {
  const newSlcs = Array.from(selections);
  const newSelectionId = uuidv4();
  const newSelection: ISelection = {
    id: newSelectionId,
    items: attributesSelected,
    label:
      "Export of " +
      moment(new Date().getTime()).format(`${DATE_FORMAT} HH:mm`),
  };
  newSlcs.push(newSelection);

  return newSlcs;
};

export default getSelectionsToSave;
