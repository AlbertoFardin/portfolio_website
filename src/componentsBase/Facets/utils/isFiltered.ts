import isEmpty from "lodash-es/isEmpty";
import FacetType from "../IFacetType";
import IFacet from "../IFacet";
import { defaultValue as fPercentageDefaultValue } from "../FacetPercentage";

interface IIsFiltered {
  filtersFaceted?: IFacet[];
  filterFullText?: string;
}

const isFiltered = ({
  filtersFaceted = [],
  filterFullText = "",
}: IIsFiltered): boolean => {
  const somefiltersInFacets = filtersFaceted.find((f) => {
    switch (f.type) {
      case FacetType.DICTIONARY:
      case FacetType.CATEGORY:
      case FacetType.DATEPICKER:
      case FacetType.USERSELECTION:
      case FacetType.SELECTION:
      case FacetType.MULTISELECTION:
      case FacetType.TEXTAREA: {
        return !isEmpty(f.value);
      }
      case FacetType.BOOLEAN: {
        return typeof f.value === "boolean";
      }
      case FacetType.PERCENTAGE: {
        if (!f.value) return false;
        return (
          f.value[0] !== fPercentageDefaultValue[0] ||
          f.value[1] !== fPercentageDefaultValue[1]
        );
      }
      default:
        return false;
    }
  });

  return !!filterFullText || !!somefiltersInFacets;
};

export default isFiltered;
