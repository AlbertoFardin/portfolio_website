import IFacet from "../IFacet";

const clearFilters = (filters: IFacet[]): IFacet[] => {
  return filters.map((f) => ({
    ...f,
    value: undefined,
  }));
};

export default clearFilters;
