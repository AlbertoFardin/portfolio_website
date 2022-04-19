import * as React from "react";
import FacetMultiSelection, {
  IFacetMultiSelection,
} from "./";
import IFacetType from "../IFacetType";

/**
 * **FacetUserSelection** estende FacetMultiSelection cambiandoci solo il type
 */
const FacetUserSelection = (p: IFacetMultiSelection) => {
  return <FacetMultiSelection {...p} type={IFacetType.USERSELECTION} />;
};

export default FacetUserSelection;
