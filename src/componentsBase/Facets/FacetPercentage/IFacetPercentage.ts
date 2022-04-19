import IFacetBase, { IChanges } from "../IFacetBase";

interface IFacetChanges extends IChanges {
  value: number[];
}

interface IFacetPercentage extends IFacetBase {
  i18n?: {
    clear?: string;
  };
  onChange: (changes: IFacetChanges) => void;
  value?: number[];
  // The granularity with which the slider can step through values.
  step?: number;
}

export default IFacetPercentage;
