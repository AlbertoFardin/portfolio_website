import * as React from "react";
import { ROLES_KEY } from "../constants";
import Toolbar from "@material-ui/core/Toolbar";
import { IFilter } from "../../../interfaces";
import { PANEL_FILTER_WIDTH } from "../../../constants";
import FacetSearchRoles from "./FacetSearchRoles";
import ListFacets from "../../PanelFilters/ListFacets";
import Drawer from "../../Drawer";
import Btn from "../../../componentsBase/Btn";
import FiltersChips from "../../FiltersChips";

interface IPanelFilters {
  filters: IFilter[];
  onChange: (filters: IFilter[]) => void;
}

const PanelFilters = ({ filters, onChange }: IPanelFilters) => {
  const onChangeFilter = React.useCallback(
    ({ id, value }: IFilter) => {
      const newFilters = Array.from(filters).map((f) => {
        return { ...f, value: f.id === id ? value : f.value };
      });
      onChange(newFilters);
    },
    [filters, onChange]
  );

  return (
    <Drawer direction="right" width={PANEL_FILTER_WIDTH}>
      <Toolbar style={{ padding: "0 10px" }}>
        <Btn disabled icon="filter_list" label="Filters" />
        <div style={{ flex: 1 }} />
        <FiltersChips
          filters={filters}
          onChange={onChange}
          maxChipVisible={0}
        />
      </Toolbar>
      <ListFacets
        facets={filters}
        facetsOverrideMap={{
          [ROLES_KEY]: FacetSearchRoles,
        }}
        onChange={onChangeFilter}
      />
    </Drawer>
  );
};

export default PanelFilters;
