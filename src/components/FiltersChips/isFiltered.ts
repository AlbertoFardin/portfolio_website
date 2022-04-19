import isEmpty from "lodash-es/isEmpty";
import { defaultValue as fPercentageDefaultValue } from "../../componentsBase/Facets/FacetPercentage";
import { IFacetType } from "../../componentsBase/Facets";
import { IFilter } from "../../interfaces";

const isFiltered = (filters: IFilter[]): boolean => {
  return !!filters
    .filter(({ sticky }) => !sticky)
    .find((f) => {
      switch (f.type) {
        case IFacetType.DICTIONARY:
        case IFacetType.CATEGORY:
        case IFacetType.DATEPICKER:
        case IFacetType.USERSELECTION:
        case IFacetType.SELECTION:
        case IFacetType.MULTISELECTION:
        case IFacetType.TEXTAREA: {
          return !isEmpty(f.value);
        }
        case IFacetType.BOOLEAN: {
          return typeof f.value === "boolean";
        }
        case IFacetType.PERCENTAGE: {
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
};

export default isFiltered;
