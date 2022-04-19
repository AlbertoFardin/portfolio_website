import * as React from "react";
import {
  LAYOUT_GRID,
  ID_COLUMNS,
  ID_FILTERS,
  AREA_STAGING,
} from "../../constants";
import {
  IFilter,
  Severity,
  SheetLayout,
  IArea,
  SheetStatus,
  FiltersCondition,
} from "../../interfaces";
import { saveJsonConfigsSet, getJsonConfigsSet } from "../../api/fetchesApi";
import {
  registerWebSocketCallback,
  unregisterWebSocketCallback,
} from "../webSocket";
import getSetsDocId from "../../utils/getJsonDocId";
import useSearchEs from "./useSearchEs";
import Content from "./Content";
import PanelFilters from "../PanelFilters";
import FacetToggle from "../PanelFilters/FacetToggle";
import reducer, { reducerInitState, ACT_VPORT } from "./reducer";
import manageFetchErrors from "../../utils/manageFetchErrors";
import { IItemsSet } from "../../componentsBase/ConfigManagement";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ToolbarHeader from "./ToolbarHeader";
import { IColumnsSets } from "../../componentsBase/StickyGrid";
import useDebounce from "../../componentsBase/utils/useDebounce";
import { ContextSetSnackbar } from "../contexts";
import searchES from "./searchES";
import websocketCallbacks from "./websocketCallbacks";
import { getConfigStagingarea } from "../../api/configurations";
import DrawerDetail from "../DrawerDetail";
import SheetContent from "./SheetContent";
import Typography from "@material-ui/core/Typography";
import last from "lodash-es/last";
import AreaContext from "./AreaContext";
import { useHistory } from "react-router-dom";

const viewId = AREA_STAGING;
const useStyles = makeStyles({
  displayFlexDirectionColumn: {
    flex: 1,
    position: "relative",
    display: "flex",
    "flex-direction": "column",
  },
  flex1: {
    flex: 1,
  },
  toolbar: {
    padding: "0 13px",
  },
});

const Area = ({ refreshTime }: IArea) => {
  const history = useHistory();
  const classes = useStyles({});
  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const {
    columns,
    items,
    itemsTotal,
    itemsIdSelected,
    filters,
    filtersCondition,
    sortsContent,
    hashColumnsSets,
    hashFiltersSets,
    paginationValue,
    paginationSize,
    detailSheet,
    initialized,
    sortsDefault,
    sortsLoading,
    sortsToCheck,
    columnsSetsDraft,
    loadOnlySelected,
    snackbarToUpdate,
  } = state;

  const { setSearchTime, searchRes } = useSearchEs({
    history,
    searchEs: searchES,
    columns,
    filters,
    filtersCondition,
    paginationValue,
    paginationSize,
    hashColumnsSets,
    hashFiltersSets,
    sortsContent,
    itemsIdSelected,
    loadOnlySelected,
  });
  const setSnackbar = React.useContext(ContextSetSnackbar);

  const assetDataId =
    last(itemsIdSelected) &&
    items.find(({ id }) => id === last(itemsIdSelected))
      ? last(itemsIdSelected)
      : "";
  const assetData = items.find((item) => item.id === assetDataId);
  const onPanelFiltersChange = React.useCallback((payload: IFilter[]) => {
    dispatch({ type: ACT_VPORT.FILTERS_SET, payload });
  }, []);
  const onManagerFiltersChange = React.useCallback((payload: IItemsSet[]) => {
    dispatch({ type: ACT_VPORT.HASHSETS_FILTERS_SAVE, payload });
  }, []);
  const onSheetChange = React.useCallback((layout: SheetLayout) => {
    dispatch({ type: ACT_VPORT.SHEET_LAYOUT, layout });
  }, []);
  const onSheetReset = React.useCallback(() => {
    dispatch({ type: ACT_VPORT.ITEMS_DESELECT });
  }, []);

  const actionsFiltersCondition = React.useMemo(
    () => [
      {
        id: FiltersCondition.AND,
        label: "AND",
        selected: FiltersCondition.AND === filtersCondition,
      },
      {
        id: FiltersCondition.OR,
        label: "OR",
        selected: FiltersCondition.OR === filtersCondition,
      },
    ],
    [filtersCondition]
  );
  const onChangeFiltersCondition = React.useCallback((value: string) => {
    dispatch({ type: ACT_VPORT.FILTERS_CONDITION, value });
  }, []);

  // refresh content on refreshTime changed
  React.useEffect(() => {
    if (refreshTime) {
      setSearchTime(refreshTime);
    }
  }, [refreshTime, setSearchTime]);

  // snackbar inform that a refresh is needed
  React.useEffect(() => {
    if (snackbarToUpdate) {
      setSnackbar(Severity.WARNING, "Content update, please refresh");
    }
  }, [setSnackbar, snackbarToUpdate]);

  React.useEffect(() => {
    if (!initialized) {
      (async () => {
        const fn = async () => {
          const [
            { filters, columns },
            { hash: hashColumnSet, payload: payloadColumnSet },
            { hash: hashFiltersSets, payload: payloadFiltersSets },
          ] = await Promise.all([
            getConfigStagingarea(),
            getJsonConfigsSet({
              docId: getSetsDocId(viewId, LAYOUT_GRID, ID_COLUMNS),
            }),
            getJsonConfigsSet({
              docId: getSetsDocId(viewId, LAYOUT_GRID, ID_FILTERS),
            }),
          ]);

          dispatch({
            type: ACT_VPORT.INIT,
            columns,
            filters: filters.filter((f) => f.searchable),
            hashColumnsSets: {
              hash: hashColumnSet,
              saving: false,
              columsnSets: payloadColumnSet,
            },
            hashFiltersSets: {
              hash: hashFiltersSets,
              saving: false,
              itemsSets: payloadFiltersSets,
            },
          });
        };
        manageFetchErrors({
          fetch: fn,
          history,
        });
      })();
    }
  }, [history, initialized]);

  const serializedFilterValues = JSON.stringify(
    filters.map(({ id, label, value }) => ({ id, label, value }))
  );
  const serializedSortValues = JSON.stringify(sortsContent);
  const serializedPaginationSize = JSON.stringify(paginationSize);
  const serializedPaginationValue = JSON.stringify(paginationValue);
  const serializedLoadOnlySelected = JSON.stringify({ loadOnlySelected });
  const serializedParams =
    serializedFilterValues +
    serializedSortValues +
    serializedPaginationSize +
    serializedPaginationValue +
    serializedLoadOnlySelected +
    filtersCondition;

  React.useEffect(() => {
    if (initialized) {
      setSearchTime(new Date().getTime());
    }
  }, [initialized, setSearchTime, serializedParams]);

  React.useEffect(() => {
    if (initialized && searchRes.result && searchRes.result.success)
      dispatch({ type: ACT_VPORT.SET, ...searchRes.result });
  }, [initialized, searchRes.result]);

  // add websocket listener
  React.useEffect(() => {
    websocketCallbacks.forEach((x) => {
      registerWebSocketCallback({
        id: x.id,
        callback: x.callback,
        dispatch,
      });
    });

    return () => {
      websocketCallbacks.forEach((x) => {
        unregisterWebSocketCallback(x.id);
      });
    };
  }, []);

  const columnsSetsDraftDebounced = useDebounce(columnsSetsDraft, 500);

  React.useEffect(() => {
    if (columnsSetsDraftDebounced.length !== 0) {
      dispatch({
        type: ACT_VPORT.HASHSETS_COLUMNS_SAVE,
        payload: columnsSetsDraftDebounced,
      });
    }
  }, [columnsSetsDraftDebounced]);

  React.useEffect(() => {
    (async () => {
      try {
        if (hashColumnsSets.saving && hashColumnsSets.columsnSets) {
          const newSets = await saveJsonConfigsSet<IColumnsSets>({
            itemsSets: hashColumnsSets.columsnSets,
            hash: hashColumnsSets.hash,
            docId: getSetsDocId(viewId, LAYOUT_GRID, ID_COLUMNS),
          });
          dispatch({ type: ACT_VPORT.HASHSETS_COLUMNS_SET, payload: newSets });
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [
    hashColumnsSets.columsnSets,
    hashColumnsSets.hash,
    hashColumnsSets.saving,
  ]);

  React.useEffect(() => {
    (async () => {
      try {
        if (hashFiltersSets.saving && hashFiltersSets.itemsSets) {
          const newSets = await saveJsonConfigsSet({
            itemsSets: hashFiltersSets.itemsSets,
            hash: hashFiltersSets.hash,
            docId: getSetsDocId(viewId, LAYOUT_GRID, ID_FILTERS),
          });
          dispatch({ type: ACT_VPORT.HASHSETS_FILTERS_SET, payload: newSets });
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [hashFiltersSets.hash, hashFiltersSets.itemsSets, hashFiltersSets.saving]);

  return (
    <AreaContext dispatchViewport={dispatch} columns={columns}>
      <PanelFilters
        columns={columns}
        filters={filters}
        hashFiltersSets={hashFiltersSets}
        onManagerChange={onManagerFiltersChange}
        onFiltersChange={onPanelFiltersChange}
        searchEs={searchES}
      >
        <FacetToggle
          label="Condition"
          actions={actionsFiltersCondition}
          onChange={onChangeFiltersCondition}
          help="How filters works among them"
        />
      </PanelFilters>
      <div className={classes.displayFlexDirectionColumn}>
        <ToolbarHeader
          loadOnlySelected={loadOnlySelected}
          paginationSize={paginationSize}
          paginationValue={paginationValue}
          items={items}
          itemsIdSelected={itemsIdSelected}
          itemsTotal={itemsTotal}
          setSearchTime={setSearchTime}
          searchStatus={searchRes.status}
        />
        <Content
          searchStatus={searchRes.status}
          detailSheet={detailSheet}
          items={items}
          itemsIdSelected={itemsIdSelected}
          sortsDefault={sortsDefault}
          sortsContent={sortsContent}
          sortsToCheck={sortsToCheck}
          sortsLoading={sortsLoading}
          hashColumnsSets={hashColumnsSets}
          assetDataId={assetDataId}
          paginationSize={paginationSize}
          paginationValue={paginationValue}
        />
      </div>
      <DrawerDetail
        layout={detailSheet}
        onChange={onSheetChange}
        onReset={onSheetReset}
        status={!assetDataId ? SheetStatus.PHOLDER : SheetStatus.VISIBLE}
        title={
          <Typography
            style={{ marginRight: 10 }}
            variant="body2"
            children="Detail"
          />
        }
        content={<SheetContent assetData={assetData} />}
      />
    </AreaContext>
  );
};

export default Area;
