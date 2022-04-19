import { IFacetDatePicker } from "./FacetDatePicker";
import { IFacetBoolean } from "./FacetBoolean";
import { IFacetTextarea } from "./FacetTextarea";
import { IFacetMultiSelection } from "./FacetMultiSelection";
import { IFacetPercentage } from "./FacetPercentage";

type IFacet =
  | IFacetMultiSelection
  | IFacetDatePicker
  | IFacetTextarea
  | IFacetBoolean
  | IFacetPercentage;

export default IFacet;
