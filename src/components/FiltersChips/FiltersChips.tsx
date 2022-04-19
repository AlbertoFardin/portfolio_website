import * as React from "react";
import { DATE_FORMAT } from "../../constants";
import { IFilter } from "../../interfaces";
import { IFacet, SummaryFacets } from "../../componentsBase/Facets";
import isFiltered from "./isFiltered";

interface IFiltersChips {
  filters: IFilter[];
  onChange: (a: IFilter[]) => void;
  maxChipVisible?: number;
  buttonClearAll?: boolean;
}

const FiltersChips = ({
  filters,
  onChange,
  maxChipVisible,
  buttonClearAll,
}: IFiltersChips) => {
  const filtered = isFiltered(filters);
  const facetsDefault = filters.filter(({ sticky }) => !sticky) as IFacet[];
  const facetsSticky = filters.filter(({ sticky }) => sticky);
  const onChangeChips = React.useCallback(
    (newFacetsDefault) => {
      const newFacets = [].concat(facetsSticky, newFacetsDefault);
      onChange(newFacets);
    },
    [facetsSticky, onChange]
  );

  if (!filtered) return null;

  return (
    <SummaryFacets
      dateFormat={DATE_FORMAT}
      maxWidth={500}
      facets={facetsDefault}
      onChange={onChangeChips}
      maxChipVisible={maxChipVisible}
      buttonClearAll={buttonClearAll}
    />
  );
};

export default FiltersChips;
