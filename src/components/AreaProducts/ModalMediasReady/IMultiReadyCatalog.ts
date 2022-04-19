import { ICatalog } from "../../../interfaces";

interface IMultiReadyCatalog extends ICatalog {
  viewsReady: string[];
  disabled: boolean;
  selected: boolean;
}

export default IMultiReadyCatalog;
