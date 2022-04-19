import IFacetType from "./IFacetType";

export interface IChanges {
  id: string;
  type: IFacetType;
  value;
}

interface IFacetBase {
  /** Facet identification. It will return in onChange */
  id: string;
  /** Facet type. It will return in onChange */
  type: IFacetType;
  /** Component CSS style */
  style?: React.CSSProperties;
  /** Component CSS classname */
  className?: string;
  /** Facet label */
  label?: string;
  /** Facet sub-label */
  subLabel?: string;
  /** Callback fire on change value. It return {id, type, value} */
  onChange?: (changes: IChanges) => void;
  /** If true, facet render collapsed */
  initCollapse?: boolean;
  /** If true, facet is disabled */
  disabled?: boolean;
  /** If valued and facet is disabled, show an icon with tooltip */
  disabledInfo?: string;
  /** Facet value. It is different between facets  */
  value?;
  /** Facet i18n. It is different between facets */
  i18n?;
}

export default IFacetBase;
