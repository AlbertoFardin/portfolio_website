import * as React from "react";
import FacetMultiSelection, {
  IFacetMultiSelection,
} from "./";
import IFacetType from "../IFacetType";

/**
 * **FacetSingleSelection** è una faccetta che gestisce diversi items selezionabili.
 */
const FacetSingleSelection = (p: IFacetMultiSelection) => {
  if (!!p.value && p.value.length > 1) {
    console.warn("-> FacetSingleSelection need only 1 item selected", p);
  }

  return (
    <FacetMultiSelection {...p} type={IFacetType.SELECTION} valueMax={1} />
  );
};

export default FacetSingleSelection;
