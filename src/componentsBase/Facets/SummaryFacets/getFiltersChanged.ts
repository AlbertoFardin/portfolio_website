import IFacet from "../IFacet";
import IFacetType from "../IFacetType";
import clearFilters from "../utils/clearFilters";
import isEmpty from "lodash-es/isEmpty";
import { IFacetMultiSelection } from "../FacetMultiSelection";

const typeSelection = new Set([
  IFacetType.DICTIONARY,
  IFacetType.CATEGORY,
  IFacetType.USERSELECTION,
  IFacetType.SELECTION,
  IFacetType.MULTISELECTION,
]);

interface IGetFiltersChanged {
  chipId: string;
  chipValue;
  chipFilter: IFacet;
  filters: IFacet[];
}

const getFiltersChanged = ({
  chipValue,
  chipFilter,
  filters,
}: IGetFiltersChanged): IFacet[] => {
  return filters.map((f) => {
    const isThis = f.id === chipFilter.id;
    if (!isThis) return f;
    if (typeSelection.has(f.type)) {
      const { value } = f as IFacetMultiSelection;
      if (isEmpty(value)) return f;

      // elimino il value identificato dalla chip clicckata
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newValue: any = Array.from(value);
      const itemIndex = newValue.findIndex((v) => v.id === String(chipValue));
      newValue.splice(itemIndex, 1);

      return {
        ...f,
        value: newValue,
      };
    }
    return clearFilters([f])[0];
  });
};

export default getFiltersChanged;
