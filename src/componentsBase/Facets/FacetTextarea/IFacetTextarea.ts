import IFacetBase, { IChanges } from "../IFacetBase";

interface IFacetChanges extends IChanges {
  value: string | string[];
  caseSensitive?: boolean;
}

interface IFacetTextarea extends IFacetBase {
  i18n?: {
    clear?: string;
    placeholder?: string;
    noValue?: string;
  };
  value?: string | string[];
  onChange: (changes: IFacetChanges) => void;
  /** If true, the value are an array of string divided to "a capo" */
  cartridgeSplit?: boolean;
  showCaseSensitiveSwitch?: boolean;
  caseSensitiveSwitch?: boolean;
  onCaseSensitiveSwitch?: (newStateSwitch: boolean) => void;
}

export default IFacetTextarea;
