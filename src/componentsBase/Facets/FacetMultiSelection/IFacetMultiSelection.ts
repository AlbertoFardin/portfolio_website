import IFacetBase, { IChanges } from "../IFacetBase";

export interface IItem {
  id: string;
  label: string;
  count?: number;
}

interface IFacetChanges extends IChanges {
  value: IItem[];
}

interface IFacetMultiSelection extends IFacetBase {
  i18n?: {
    clear?: string;
    search?: string;
    itemNotFound?: string;
    moreResults?: string;
  };
  /** Array of items selected */
  value?: IItem[];
  /** Count of max items selectable */
  valueMax?: number;
  /** Array of items to show how suggestions */
  options?: IItem[];
  /** Count of more options not visible */
  optionsMore?: number;
  /** Callback fired when the value is changed */
  onChange: (changes: IFacetChanges) => void;
  /** Callback fired when use search input */
  onSearch?: (inputValue: string) => void;
}

export default IFacetMultiSelection;
