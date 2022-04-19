import * as React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import { emptyFn } from "../utils/common";
import {
  IFacet,
  IFacetType,
  SummaryFacets,
  FacetBoolean,
  IFacetBoolean,
  FacetDatePicker,
  IFacetDatePicker,
  FacetMultiSelection,
  IFacetMultiSelection,
  FacetPercentage,
  IFacetPercentage,
  FacetSingleSelection,
  FacetTextarea,
  IFacetTextarea,
  FacetUserSelection,
} from ".";

const options = [];
for (let i = 0; i < 30; i++) {
  options.push({
    id: "item" + i,
    label: "item" + i,
  });
}

const dateFormat = "DD/MM/YYYY";
const filtersInit: IFacet[] = [
  {
    id: "facetDatepicker",
    type: IFacetType.DATEPICKER,
    dateFormat,
  },
  {
    id: "facetTextarea-string",
    type: IFacetType.TEXTAREA,
    cartridgeSplit: false,
  },
  {
    id: "facetTextarea-array",
    type: IFacetType.TEXTAREA,
    cartridgeSplit: true,
  },
  {
    id: "facetBoolean",
    type: IFacetType.BOOLEAN,
  },

  {
    id: "facetMultiSelectSearch",
    type: IFacetType.MULTISELECTION,
    onSearch: emptyFn,
    options,
  },
  {
    id: "facetMultiSelect",
    type: IFacetType.MULTISELECTION,
    options,
  },
  {
    id: "facetSingleSelect",
    type: IFacetType.SELECTION,
    options,
  },
  {
    id: "facetUserSelection",
    type: IFacetType.USERSELECTION,
    options,
  },
  {
    id: "facetPercentage",
    type: IFacetType.PERCENTAGE,
  },
  {
    id: "facetCategory",
    type: IFacetType.CATEGORY,
    options,
  },
  {
    id: "facetDictionary",
    type: IFacetType.DICTIONARY,
    options,
  },
].map((p) => ({
  ...p,
  label: p.id,
  onChange: emptyFn,
}));

const FacetsDemo = () => {
  const toolbarContentRef = React.useRef(null);
  const [filters, setFilters] = React.useState(filtersInit as IFacet[]);
  const maxWidth = !toolbarContentRef.current
    ? 0
    : toolbarContentRef.current.clientWidth;
  const onChange = React.useCallback(
    ({ id, value }) => {
      const newFilters = Array.from(filters);
      const newFacetIndex = newFilters.findIndex((f) => f.id === id);
      const newFacet = {
        ...newFilters[newFacetIndex],
        value,
      };
      newFilters.splice(newFacetIndex, 1, newFacet);
      setFilters(newFilters);
    },
    [filters]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Toolbar style={{ backgroundColor: "#f1f1f1" }}>
        <div ref={toolbarContentRef} style={{ flex: 1, display: "flex" }}>
          <SummaryFacets
            dateFormat={dateFormat}
            facets={filters}
            onChange={setFilters}
            maxWidth={maxWidth}
            maxChipVisible={0}
          />
        </div>
      </Toolbar>
      <Divider />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            overflowX: "hidden",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            width: 350,
            padding: 20,
            boxSizing: "border-box",
          }}
        >
          {filters.map((p) => {
            switch (p.type) {
              case IFacetType.DATEPICKER:
                return (
                  <FacetDatePicker
                    key={p.id}
                    {...(p as IFacetDatePicker)}
                    onChange={onChange}
                  />
                );
              case IFacetType.TEXTAREA:
                return (
                  <FacetTextarea
                    key={p.id}
                    {...(p as IFacetTextarea)}
                    onChange={onChange}
                  />
                );
              case IFacetType.BOOLEAN:
                return (
                  <FacetBoolean
                    key={p.id}
                    {...(p as IFacetBoolean)}
                    onChange={onChange}
                  />
                );
              case IFacetType.USERSELECTION:
                return (
                  <FacetUserSelection
                    key={p.id}
                    {...(p as IFacetMultiSelection)}
                    onChange={onChange}
                  />
                );
              case IFacetType.SELECTION:
                return (
                  <FacetSingleSelection
                    key={p.id}
                    {...(p as IFacetMultiSelection)}
                    onChange={onChange}
                  />
                );
              case IFacetType.DICTIONARY:
              case IFacetType.CATEGORY:
              case IFacetType.MULTISELECTION:
                return (
                  <FacetMultiSelection
                    key={p.id}
                    {...(p as IFacetMultiSelection)}
                    onChange={onChange}
                  />
                );
              case IFacetType.PERCENTAGE:
                return (
                  <FacetPercentage
                    key={p.id}
                    {...(p as IFacetPercentage)}
                    onChange={onChange}
                  />
                );
              default:
                return null;
            }
          })}
        </div>
        <textarea
          style={{
            flex: 1,
            outline: 0,
            border: 0,
            resize: "none",
            backgroundColor: "#f1f1f1",
          }}
          value={JSON.stringify(
            filters.map(({ id, value }) => ({ id, value })),
            null,
            "\t"
          )}
          readOnly
        />
      </div>
    </div>
  );
};

export default FacetsDemo;
