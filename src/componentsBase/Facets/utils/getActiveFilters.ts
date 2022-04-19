import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import FacetType from "../IFacetType";
import { defaultValue as fPercentageDefaultValue } from "../FacetPercentage";
import IFacet from "../IFacet";

const getActiveFilters = (filters: IFacet[]): IFacet[] => {
  const activeFilters = filters.filter((f) => {
    switch (f.type) {
      case FacetType.DICTIONARY:
      case FacetType.CATEGORY:
      case FacetType.USERSELECTION:
      case FacetType.SELECTION:
      case FacetType.MULTISELECTION:
      case FacetType.DATEPICKER:
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
  return cloneDeep(activeFilters);
};

export default getActiveFilters;
