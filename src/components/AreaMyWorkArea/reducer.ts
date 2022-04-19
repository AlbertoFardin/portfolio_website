import { IItemsSet } from "../../componentsBase/ConfigManagement/interfaces";
import {
  IColumnSc,
  IFilter,
  IHashItemsSets,
  HASH_ITEMSSSETS,
  IHashColumnsSets,
  HASH_COLUMNSSETS,
  IColumnsOrderedSet,
} from "../../interfaces";
import { IData, ConfigType } from "./interfaces";
import getData from "./utils/getData";

export enum ACT_VPORT {
  INIT = "INIT",
  CHANGE_ALL_TYPE_FAMILY = "CHANGE_ALL_TYPE_FAMILY",
  CHANGE_ID_ATTRIBUTE_TYPE = "CHANGE_ID_ATTRIBUTE_TYPE",
  SAVE_STARTED = "SAVE_STARTED",
  DIALOG_UNSAVED = "DIALOG_UNSAVED",
  DELETE_DIRTY = "DELETE_DIRTY",
  SET_SEARCH_INPUT = "SET_SEARCH_INPUT",
  SET_LEVEL_FILTER = "SET_LEVEL_FILTER",
  SET_CURRENT_FILTER_SET = "SET_CURRENT_FILTER_SET",
  SET_CURRENT_COLUMN_SET = "SET_CURRENT_COLUMN_SET",
  SET_CURRENT_DETAIL_PANEL_SET = "SET_CURRENT_DETAIL_PANEL_SET",
  SAVE_STOPPED = "SAVE_STOPPED",
}

interface IReducerState {
  initialized: boolean;
  hashColumnsSets: IHashColumnsSets;
  hashFiltersSets: IHashItemsSets;
  hashFieldsPanelDetailsSet: IHashItemsSets;
  columnSetInEdit: IColumnsOrderedSet;
  filtersSetInEdit: IItemsSet;
  fieldsPanelDetailsInEdit: IItemsSet;
  columns: IColumnSc[];
  filters: IFilter[];
  datas: IData[];
  filteredDatas: IData[];
  saving: boolean;
  dialogUnsaved: boolean;
  searchInput: string;
  levelFiltered: string;
}

export const VALUE_ALL_LEVEL = "all";

export const reducerInitState: IReducerState = {
  initialized: false,
  hashColumnsSets: HASH_COLUMNSSETS,
  hashFiltersSets: HASH_ITEMSSSETS,
  hashFieldsPanelDetailsSet: HASH_ITEMSSSETS,
  columns: [],
  filters: [],
  datas: [],
  filteredDatas: [],
  saving: false,
  dialogUnsaved: false,
  searchInput: "",
  levelFiltered: VALUE_ALL_LEVEL,
  columnSetInEdit: undefined,
  filtersSetInEdit: undefined,
  fieldsPanelDetailsInEdit: undefined,
};

const checkDirty = ({
  id,
  checked,
  confType,
  columnSetInEdit,
  filtersSetInEdit,
  fieldsPanelDetailsInEdit,
}: {
  id: string;
  checked: boolean;
  confType: ConfigType;
  columnSetInEdit: IColumnsOrderedSet;
  filtersSetInEdit: IItemsSet;
  fieldsPanelDetailsInEdit: IItemsSet;
}) => {
  const setActive =
    confType === ConfigType.FILTERS
      ? filtersSetInEdit
      : confType === ConfigType.DETAILS_PANEL
      ? fieldsPanelDetailsInEdit
      : columnSetInEdit;

  return !!setActive.items.find((i) => i.id === id) !== checked;
};

const getFilteredData = (
  datas: IData[],
  searchInput: string,
  levelFiltered: string
): IData[] => {
  return datas.reduce((acc, data) => {
    const attributesFiltered = data.attributes.filter(
      (a) =>
        a.label.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1 &&
        (a.level === levelFiltered || levelFiltered === VALUE_ALL_LEVEL)
    );
    if (attributesFiltered.length !== 0) {
      acc.push({
        attributeFamily: data.attributeFamily,
        attributes: attributesFiltered,
      });
    }
    return acc;
  }, []);
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };

  switch (action.type) {
    case ACT_VPORT.INIT: {
      const {
        columns,
        filters,
        hashColumnsSets,
        hashFiltersSets,
        hashFieldsPanelDetailsSet,
      }: {
        columns: IColumnSc[];
        filters: IFilter[];
        hashColumnsSets: IHashColumnsSets;
        hashFiltersSets: IHashItemsSets;
        hashFieldsPanelDetailsSet: IHashItemsSets;
      } = action;

      newState.columns = columns;
      newState.filters = filters;
      newState.hashColumnsSets = hashColumnsSets;
      newState.hashFiltersSets = hashFiltersSets;
      newState.hashFieldsPanelDetailsSet = hashFieldsPanelDetailsSet;

      newState.columnSetInEdit = hashColumnsSets.columsnSets.find(
        (c) => c.active
      );
      newState.filtersSetInEdit = hashFiltersSets.itemsSets.find(
        (c) => c.active
      );
      newState.fieldsPanelDetailsInEdit = hashFieldsPanelDetailsSet.itemsSets.find(
        (c) => c.active
      );

      newState.datas = getData({
        columns,
        filters,
        activeColumnSet: newState.columnSetInEdit,
        activeFieldsPaneldetailsSet: newState.fieldsPanelDetailsInEdit,
        activeFiltersSet: newState.filtersSetInEdit,
      });

      newState.initialized = true;

      return newState;
    }
    case ACT_VPORT.DELETE_DIRTY: {
      const { columns, filters } = newState;
      newState.datas = getData({
        columns,
        filters,
        activeColumnSet: newState.columnSetInEdit,
        activeFieldsPaneldetailsSet: newState.fieldsPanelDetailsInEdit,
        activeFiltersSet: newState.filtersSetInEdit,
      });
      newState.dialogUnsaved = false;
      return newState;
    }
    case ACT_VPORT.DIALOG_UNSAVED:
      newState.dialogUnsaved = !newState.dialogUnsaved;
      return newState;
    case ACT_VPORT.SET_SEARCH_INPUT:
      const searchInput = action.value;
      newState.filteredDatas = getFilteredData(
        newState.datas,
        searchInput,
        newState.levelFiltered
      );
      newState.searchInput = searchInput;
      return newState;
    case ACT_VPORT.CHANGE_ALL_TYPE_FAMILY:
      {
        const { attributeFamily, confType, checked } = action;
        const data = newState.datas.find(
          (d) => d.attributeFamily === attributeFamily
        );

        const {
          columnSetInEdit,
          filtersSetInEdit,
          fieldsPanelDetailsInEdit,
        } = newState;
        data.attributes.forEach((a) => {
          a[confType] = {
            ...a[confType],
            enabled: a[confType].available ? checked : false,
            dirty: checkDirty({
              id: a.id,
              checked,
              confType,
              columnSetInEdit,
              filtersSetInEdit,
              fieldsPanelDetailsInEdit,
            }),
          };
        });
      }
      return newState;
    case ACT_VPORT.SET_LEVEL_FILTER:
      {
        newState.levelFiltered = action.value;
        newState.filteredDatas = getFilteredData(
          newState.datas,
          newState.searchInput,
          newState.levelFiltered
        );
      }
      return newState;
    case ACT_VPORT.SET_CURRENT_FILTER_SET:
      {
        const { value } = action;
        newState.filtersSetInEdit = newState.hashFiltersSets.itemsSets.find(
          (s) => s.id === value
        );
        newState.datas = getData({
          columns: newState.columns,
          filters: newState.filters,
          activeColumnSet: newState.columnSetInEdit,
          activeFieldsPaneldetailsSet: newState.fieldsPanelDetailsInEdit,
          activeFiltersSet: newState.filtersSetInEdit,
        });
      }
      return newState;
    case ACT_VPORT.SET_CURRENT_COLUMN_SET:
      {
        const { value } = action;
        newState.columnSetInEdit = newState.hashColumnsSets.columsnSets.find(
          (s) => s.id === value
        );
        newState.datas = getData({
          columns: newState.columns,
          filters: newState.filters,
          activeColumnSet: newState.columnSetInEdit,
          activeFieldsPaneldetailsSet: newState.fieldsPanelDetailsInEdit,
          activeFiltersSet: newState.filtersSetInEdit,
        });
      }
      return newState;
    case ACT_VPORT.SET_CURRENT_DETAIL_PANEL_SET:
      {
        const { value } = action;
        newState.fieldsPanelDetailsInEdit = newState.hashFieldsPanelDetailsSet.itemsSets.find(
          (s) => s.id === value
        );
        newState.datas = getData({
          columns: newState.columns,
          filters: newState.filters,
          activeColumnSet: newState.columnSetInEdit,
          activeFieldsPaneldetailsSet: newState.fieldsPanelDetailsInEdit,
          activeFiltersSet: newState.filtersSetInEdit,
        });
      }
      return newState;
    case ACT_VPORT.CHANGE_ID_ATTRIBUTE_TYPE: {
      const { id, confType, checked } = action;

      const attribute = newState.datas
        .reduce((allAttributes, d) => {
          return allAttributes.concat(d.attributes);
        }, [])
        .find((a) => a.id === id);

      const {
        columnSetInEdit,
        filtersSetInEdit,
        fieldsPanelDetailsInEdit,
      } = newState;
      attribute[confType] = {
        ...attribute[confType],
        enabled: checked,
        dirty: checkDirty({
          id: attribute.id,
          confType,
          checked,
          columnSetInEdit,
          filtersSetInEdit,
          fieldsPanelDetailsInEdit,
        }),
      };

      return newState;
    }
    case ACT_VPORT.SAVE_STARTED:
      {
        newState.saving = true;
      }
      return newState;
    case ACT_VPORT.SAVE_STOPPED:
      {
        const {
          newHashFiltersSets,
          newHashColumnsSets,
          newHashFieldsPanelDetailsSet,
        } = action;
        newState.saving = false;
        newState.hashFiltersSets = newHashFiltersSets;
        newState.hashColumnsSets = newHashColumnsSets;
        newState.hashFieldsPanelDetailsSet = newHashFieldsPanelDetailsSet;
        newState.datas = getData({
          columns: newState.columns,
          filters: newState.filters,
          activeColumnSet: newState.columnSetInEdit,
          activeFieldsPaneldetailsSet: newState.fieldsPanelDetailsInEdit,
          activeFiltersSet: newState.filtersSetInEdit,
        });
      }
      return newState;
    default:
      console.error(`no action ${action.type}`);
      return state;
  }
};

export default reducer;
