import IFacet from "../IFacet";

interface ISummaryFacets {
  /** Array of facets */
  facets: IFacet[];
  /** Callback fire on chip/btnClear click */
  onChange: (filters: IFacet[]) => void;
  /** Component's max width, needed to calculate when render tooltips */
  maxWidth: number;
  /** date format passed to [moment.format()](https://momentjs.com/docs/#/displaying/format/) */
  dateFormat: string;
  /** if defined, limit the maximum number of visible chips, provided that overall they do not exceed the "maxWidth" value  */
  maxChipVisible?: number;
  /** if false, show button to clear all chips */
  buttonClearAll?: boolean;
}

export default ISummaryFacets;
