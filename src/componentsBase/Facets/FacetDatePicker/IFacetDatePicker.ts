import IFacetBase, { IChanges } from "../IFacetBase";

interface IFacetChanges extends IChanges {
  value: { startDate: number; endDate: number };
}

interface IFacetDatePicker extends IFacetBase {
  i18n?: {
    clear?: string;
    buttonLabel?: string;
  };
  value?: {
    startDate?: number;
    endDate?: number;
  };
  onChange: (changes: IFacetChanges) => void;
  /** For each item, user can select only a day */
  singleDate?: boolean;
  /** date format passed to [moment.format()](https://momentjs.com/docs/#/displaying/format/) */
  dateFormat: string;
}

export default IFacetDatePicker;
