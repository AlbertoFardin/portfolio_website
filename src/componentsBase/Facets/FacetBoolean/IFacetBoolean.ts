import IFacetBase, { IChanges } from "../IFacetBase";

interface IFacetChanges extends IChanges {
  value: undefined | boolean;
}

interface IFacetBoolean extends IFacetBase {
  i18n?: {
    clear?: string;
    itemYesLabel?: string;
    itemYesCount?: number;
    itemNoLabel?: string;
    itemNoCount?: number;
  };
  value?: boolean;
  onChange: (changes: IFacetChanges) => void;
}

export default IFacetBoolean;
