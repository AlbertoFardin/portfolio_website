import * as React from "react";
import ConfigManagement, {
  IItemsSet,
} from "../../componentsBase/ConfigManagement";
import Btn from "../../componentsBase/Btn";
import { PANEL_FILTER_WIDTH } from "../../constants";
import {
  HASH_ITEMSSSETS,
  IFilter,
  IHashItemsSets,
  ISearchEs,
  IResultEs,
  ICatalog,
  IColumnSc,
} from "../../interfaces";
import FacetLevels from "./FacetLevels";
import ListFacets from "./ListFacets";
import { ACTION, reducer, reducerInitState } from "./reducer";
import isEmpty from "lodash-es/isEmpty";
import { emptyFn } from "../../componentsBase/utils/common";
import getActiveItems from "../../utils/getActiveItems";
import Drawer from "../Drawer";
import Divider from "@material-ui/core/Divider";
import Toolbar from "@material-ui/core/Toolbar";
import isSearchable from "./isSearchable";
import FiltersChips from "../FiltersChips";

interface IPanelFilters {
  columns: IColumnSc[];
  filters: IFilter[];
  hashFiltersSets?: IHashItemsSets;
  onManagerChange?: (a: IItemsSet[]) => void;
  onFiltersChange?: (a: IFilter[]) => void;
  searchEs?: (k: ISearchEs) => Promise<IResultEs>;
  children?: JSX.Element | React.ReactNode;
  catalogs?: ICatalog[];
  catalogId?: string;
  languageId?: string;
}

const PanelFilters = ({
  columns,
  filters,
  hashFiltersSets = HASH_ITEMSSSETS,
  onManagerChange = emptyFn,
  onFiltersChange = emptyFn,
  searchEs,
  children,
  catalogs = [],
  catalogId,
  languageId,
}: IPanelFilters) => {
  const refButtonFilter = React.useRef<HTMLDivElement>(null);
  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const { managerOpen, btnFilterPosition } = state;

  const facetsSets = hashFiltersSets.itemsSets;
  const renderFacets: IFilter[] = getActiveItems(facetsSets, filters).filter(
    (f) => !f.sticky && f.searchable
  );
  const renderFacetsSticky: IFilter[] = filters.filter(({ sticky }) => sticky);
  const configDisabled = isEmpty(facetsSets) || isEmpty(filters);

  const managerGroup = React.useMemo(() => {
    const nameGroups = Array.from(
      new Set(filters.map((f) => f.attributeFamily).filter((a) => !!a))
    );
    return nameGroups.map((n) => ({
      id: n,
      label: n,
    }));
  }, [filters]);
  const managerItems = filters.reduce((acc, f) => {
    if (!isSearchable(f)) return acc;
    acc.push({
      ...f,
      groupId: f.attributeFamily,
    });
    return acc;
  }, []);

  const onToggleManager = React.useCallback(() => {
    dispatch({ type: ACTION.MANAGER_TOGGLE });
  }, []);

  const onChange = React.useCallback(
    (fNew: IFilter) => {
      const newFilters = filters.map((fOld) => {
        if (fOld.id !== fNew.id) return fOld;
        return {
          ...fOld,
          ...fNew,
        };
      });
      onFiltersChange(newFilters);
    },
    [filters, onFiltersChange]
  );

  React.useEffect(() => {
    if (refButtonFilter.current !== null && managerOpen) {
      const { left, top } = refButtonFilter.current.getBoundingClientRect();
      dispatch({
        type: ACTION.SET_POSITION_BUTTON_FILTER,
        btnFilterPosition: { left, top },
      });
    }
  }, [managerOpen]);

  return (
    <Drawer direction="right" width={PANEL_FILTER_WIDTH}>
      <Toolbar style={{ padding: "0 10px" }}>
        <div ref={refButtonFilter}>
          <Btn
            disabled={configDisabled}
            icon="filter_list"
            label="Filters"
            tooltip={configDisabled ? "" : "Select Filters"}
            selected={managerOpen}
            onClick={onToggleManager}
          />
        </div>
        <div style={{ flex: 1 }} />
        <FiltersChips
          filters={filters}
          onChange={onFiltersChange}
          maxChipVisible={0}
        />
      </Toolbar>
      {renderFacetsSticky.map((facet: IFilter) => (
        <FacetLevels {...facet} key={facet.id} onChange={onChange} />
      ))}
      {!renderFacetsSticky.length ? null : (
        <Divider style={{ margin: "0 10px" }} />
      )}
      <ListFacets
        columns={columns}
        facets={renderFacets}
        onChange={onChange}
        searchEs={searchEs}
        catalogs={catalogs}
        catalogId={catalogId}
        languageId={languageId}
        children={children}
      />
      <ConfigManagement
        title="Filters Sets"
        disabled={hashFiltersSets.saving}
        open={managerOpen}
        items={managerItems}
        itemsGroups={managerGroup}
        itemsSets={facetsSets}
        positionX={btnFilterPosition.left}
        positionY={btnFilterPosition.top + 30}
        onClose={onToggleManager}
        onChange={onManagerChange}
      />
    </Drawer>
  );
};

export default PanelFilters;
