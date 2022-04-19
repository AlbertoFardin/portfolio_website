import { IContentSort } from "../../../interfaces";

export interface IModalSortingPreference {
  open: boolean;
  onClose: () => void;
  sortsContent: IContentSort[];
}
