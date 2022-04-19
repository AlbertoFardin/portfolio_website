import * as React from "react";
import isEmpty from "lodash-es/isEmpty";
import last from "lodash-es/last";
import {
  LAYOUT_GRID,
  ID_COLUMNS,
  ID_FILTERS,
  KEYPAR_ENTITY,
  KEYPAR_SHEET,
  KEYPAR_TAB,
  KEYPAR_IMG,
  AREA_PRODUCTS,
  ID_FIELDS_PANEL_DETAILS,
} from "../../constants";
import {
  IFilter,
  SheetLayout,
  IArea,
  IColumnsOrderedSet,
  IHashColumnsSets,
  IContentSort,
  FiltersCondition,
  Severity,
  ISearchEs,
} from "../../interfaces";
import {
  saveJsonConfigsSet,
  getJsonConfigsSet,
  searchCatalogs,
  searchCategories,
} from "../../api/fetchesApi";
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
import MenuViewReadys from "./MenuViewReadys";
import MenuViewAssegnees from "./MenuViewAssegnees";
import manageFetchErrors from "../../utils/manageFetchErrors";
import { IItemsSet } from "../../componentsBase/ConfigManagement";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ToolbarHeader from "./ToolbarHeader";
import useDebounce from "../../componentsBase/utils/useDebounce";
import { useLocation, useHistory } from "react-router-dom";
import searchES from "./searchES";
import { getConfigTabular } from "../../api/configurations";
import websocketCallbacks from "./websocketCallbacks";
import PanelDetail from "./PanelDetail";
import itemsSetsDefault from "../../api/itemsSetsDefault";
import fetchMaxEntityIds from "./useSearchEs/fetchMaxEntityIds";
import AreaContext from "./AreaContext";
import { ContextSetSnackbar } from "../contexts";
import isSortAvailable from "./isSortAvailable";

const saveGridColumns = async (
  hashColumnsSets: IHashColumnsSets,
  sortsContent: IContentSort[]
) => {
  const itemsSets: IColumnsOrderedSet[] = hashColumnsSets.columsnSets.map(
    (c) => {
      if (c.active) {
        return {
          ...c,
          itemSorts: sortsContent.map(({ id, order }) => ({ id, order })),
        };
      }
      return c;
    }
  );
  return await saveJsonConfigsSet<IColumnsOrderedSet>({
    itemsSets,
    hash: hashColumnsSets.hash,
    docId: getSetsDocId(AREA_PRODUCTS, LAYOUT_GRID, ID_COLUMNS),
  });
};

const useStyles = makeStyles({
  displayFlexDirectionColumn: {
    flex: 1,
    position: "relative",
    display: "flex",
    "flex-direction": "column",
  },
});

const Area = ({ refreshTime }: IArea) => {
  const classes = useStyles({});
  const history = useHistory();
  const searchString = useLocation().search;
  const query = new URLSearchParams(searchString);
  const queryAssetDataId = query.get(KEYPAR_ENTITY);
  const queryDetailSheet: SheetLayout = query.get(KEYPAR_SHEET) as SheetLayout;
  const queryDetailTabId = query.get(KEYPAR_TAB);
  const queryDetailImgId = query.get(KEYPAR_IMG);

  const setSnackbar = React.useContext(ContextSetSnackbar);

  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const {
    views,
    columns,
    gridShowMediaReady,
    items,
    itemsTotal,
    itemsIdSelected,
    filters,
    filtersCondition,
    categories,
    catalogs,
    catalogId,
    languageId,
    sortsContent,
    hashColumnsSets,
    hashFiltersSets,
    paginationValue,
    paginationSize,
    menuViewReadys,
    menuViewAssegnees,
    initialized,
    itemsIdToUpdateFromES,
    sortsDefault,
    sortsLoading,
    sortsToCheck,
    columnsSetsDraft,
    loadOnlySelected,
    hashFieldsPanelDetailsSet,
    detailSheet,
    detailTabId,
    detailImgId,
    selectingMaxItems,
  } = state;

  const assetDataId = queryAssetDataId;

  const searchEs = React.useCallback(
    (c: ISearchEs) => searchES(c, columns, categories),
    [categories, columns]
  );

  const { setSearchTime, searchRes } = useSearchEs({
    history,
    searchEs,
    catalogs,
    columns,
    filters,
    filtersCondition,
    paginationValue,
    paginationSize,
    sortsContent,
    itemsIdSelected,
    loadOnlySelected,
    itemIdFromUrl: assetDataId,
    detailFullscreen: detailSheet === SheetLayout.FULLSCREEN,
    catalogId,
    languageId,
  });

  const columnsSets = hashColumnsSets.columsnSets;

  const onPanelFiltersChange = React.useCallback((payload: IFilter[]) => {
    dispatch({ type: ACT_VPORT.FILTERS_SET, payload });
  }, []);
  const onManagerFiltersChange = React.useCallback((payload: IItemsSet[]) => {
    dispatch({ type: ACT_VPORT.HASHSETS_FILTERS_SAVE, payload });
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

  // salvo le info di stato di query sullo stato del riduttore
  React.useEffect(() => {
    dispatch({
      type: ACT_VPORT.UPDATE_QUERY_STATE,
      assetDataId: queryAssetDataId,
      detailSheet: queryDetailSheet,
      detailTabId: queryDetailTabId,
      detailImgId: queryDetailImgId,
    });
  }, [queryAssetDataId, queryDetailImgId, queryDetailSheet, queryDetailTabId]);

  // refresh content on refreshTime changed
  React.useEffect(() => {
    if (refreshTime) {
      setSearchTime(refreshTime);
    }
  }, [refreshTime, setSearchTime, detailSheet]);

  React.useEffect(() => {
    if (!initialized) {
      (async () => {
        const fn = async () => {
          const [
            { filters, columns, views, entityTypes },
            catalogs,
            { items: categories },
            { hash: hashColumnSet, payload: payloadColumnSet },
            { hash: hashFiltersSets, payload: payloadFiltersSets },
          ] = await Promise.all([
            getConfigTabular(),
            searchCatalogs(),
            searchCategories({}),
            getJsonConfigsSet({
              docId: getSetsDocId(AREA_PRODUCTS, LAYOUT_GRID, ID_COLUMNS),
            }),
            getJsonConfigsSet({
              docId: getSetsDocId(AREA_PRODUCTS, LAYOUT_GRID, ID_FILTERS),
            }),
          ]);

          const {
            hash: hashFieldsPanelDetailsSet,
            payload: payloadFieldsPanelDetailsSet,
          } = await getJsonConfigsSet({
            docId: getSetsDocId(
              AREA_PRODUCTS,
              LAYOUT_GRID,
              ID_FIELDS_PANEL_DETAILS
            ),
            itemsSetsDef: itemsSetsDefault(columns.map(({ id }) => ({ id }))),
          });

          dispatch({
            type: ACT_VPORT.INIT,
            views,
            columns,
            catalogs,
            categories,
            filters: filters
              .filter((f) => f.searchable)
              .map((f) => {
                if (f.id === "entityType") f.options = entityTypes;
                return f;
              }),
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
            hashFieldsPanelDetailsSet: {
              hash: hashFieldsPanelDetailsSet,
              saving: false,
              itemsSets: payloadFieldsPanelDetailsSet,
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
    filters.map(({ id, label, value, caseSensitive }) => ({
      id,
      label,
      value,
      caseSensitive,
    }))
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
    if (initialized && !!serializedParams) {
      setSearchTime(new Date().getTime());
    }
  }, [initialized, serializedParams, setSearchTime]);

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
          const newSets = await saveGridColumns(hashColumnsSets, sortsContent);
          dispatch({ type: ACT_VPORT.HASHSETS_COLUMNS_SET, payload: newSets });
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [hashColumnsSets, sortsContent]);

  React.useEffect(() => {
    (async () => {
      try {
        if (hashFiltersSets.saving && hashFiltersSets.itemsSets) {
          const newSets = await saveJsonConfigsSet({
            itemsSets: hashFiltersSets.itemsSets,
            hash: hashFiltersSets.hash,
            docId: getSetsDocId(AREA_PRODUCTS, LAYOUT_GRID, ID_FILTERS),
          });
          dispatch({ type: ACT_VPORT.HASHSETS_FILTERS_SET, payload: newSets });
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [hashFiltersSets.hash, hashFiltersSets.itemsSets, hashFiltersSets.saving]);

  React.useEffect(() => {
    (async () => {
      try {
        if (
          hashFieldsPanelDetailsSet.saving &&
          hashFieldsPanelDetailsSet.itemsSets
        ) {
          const newSets = await saveJsonConfigsSet({
            itemsSets: hashFieldsPanelDetailsSet.itemsSets,
            hash: hashFieldsPanelDetailsSet.hash,
            docId: getSetsDocId(
              AREA_PRODUCTS,
              LAYOUT_GRID,
              ID_FIELDS_PANEL_DETAILS
            ),
          });
          dispatch({
            type: ACT_VPORT.HASHSETS_FIELDS_PANEL_DETAILS_SET,
            payload: newSets,
          });
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [
    hashFieldsPanelDetailsSet.hash,
    hashFieldsPanelDetailsSet.itemsSets,
    hashFieldsPanelDetailsSet.saving,
  ]);

  React.useEffect(() => {
    (async () => {
      if (!isEmpty(itemsIdToUpdateFromES)) {
        const { items } = await searchEs({
          query: { terms: { _id: itemsIdToUpdateFromES } },
        });
        dispatch({
          type: ACT_VPORT.ITEMS_UPDATED_FROM_ES,
          newItems: items,
        });
      }
    })();
  }, [itemsIdToUpdateFromES, searchEs]);

  React.useEffect(() => {
    (async () => {
      if (selectingMaxItems) {
        dispatch({ type: ACT_VPORT.SELECT_ITEM_MAX, selectingMaxItems: false });
        const ids = await fetchMaxEntityIds({
          catalogId,
          catalogs,
          columns,
          filters,
          languageId,
          sortsContent,
        });
        dispatch({ type: ACT_VPORT.ITEMS_SELECT, ids });
      }
    })();
  }, [
    catalogId,
    catalogs,
    columns,
    filters,
    languageId,
    selectingMaxItems,
    sortsContent,
  ]);

  // check if ES know the last column selected
  React.useEffect(() => {
    if (sortsLoading === true) {
      (async () => {
        const sortAvailable = await isSortAvailable({
          sort: last(sortsToCheck),
          catalogId,
          languageId,
          columns,
          categories,
        });
        if (sortAvailable) {
          dispatch({
            type: ACT_VPORT.SORTS_CONTENT_SET,
            payload: sortsToCheck,
          });
        } else {
          dispatch({
            type: ACT_VPORT.SORT_CHECK_LOADING,
            payload: { loading: false, sorts: [] },
          });
          setSnackbar(
            Severity.INFO,
            "Sorry, you can’t sort by this column because there are no values"
          );
        }
      })();
    }
  }, [
    catalogId,
    categories,
    columns,
    languageId,
    setSnackbar,
    sortsLoading,
    sortsToCheck,
  ]);

  return (
    <AreaContext
      dispatchViewport={dispatch}
      views={views}
      columns={columns}
      catalogs={catalogs}
      categories={categories}
    >
      <MenuViewReadys
        open={menuViewReadys.open}
        positionTop={menuViewReadys.positionTop}
        positionLeft={menuViewReadys.positionLeft}
        contentsCatalogs={menuViewReadys.contentsCatalogs}
        contentsPublication={menuViewReadys.contentsPublication}
        contentsReady={menuViewReadys.contentsReady}
        mediaId={menuViewReadys.mediaId}
      />
      <MenuViewAssegnees
        open={menuViewAssegnees.open}
        positionTop={menuViewAssegnees.positionTop}
        positionLeft={menuViewAssegnees.positionLeft}
        viewAssegnees={menuViewAssegnees.viewAssegnees}
        viewDetail={menuViewAssegnees.viewDetail}
        item={menuViewAssegnees.item}
      />
      <PanelFilters
        columns={columns}
        filters={filters}
        hashFiltersSets={hashFiltersSets}
        onManagerChange={onManagerFiltersChange}
        onFiltersChange={onPanelFiltersChange}
        searchEs={searchEs}
        catalogs={catalogs}
        catalogId={catalogId}
        languageId={languageId}
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
          items={items}
          itemsTotal={itemsTotal}
          itemsIdSelected={itemsIdSelected}
          filters={filters}
          columnsSets={columnsSets}
          catalogId={catalogId}
          languageId={languageId}
          loadOnlySelected={loadOnlySelected}
          sortsContent={sortsContent}
          paginationSize={paginationSize}
          paginationValue={paginationValue}
          gridShowMediaReady={gridShowMediaReady}
          setSearchTime={setSearchTime}
          searchStatus={searchRes.status}
        />
        <Content
          searchStatus={searchRes.status}
          gridShowMediaReady={gridShowMediaReady}
          items={items}
          itemsIdSelected={itemsIdSelected}
          catalogId={catalogId}
          languageId={languageId}
          sortsDefault={sortsDefault}
          sortsContent={sortsContent}
          sortsLoading={sortsLoading}
          hashColumnsSets={hashColumnsSets}
          assetDataId={assetDataId}
          detailSheet={detailSheet}
          detailTabId={detailTabId}
          detailImgId={detailImgId}
          paginationValue={paginationValue}
          paginationSize={paginationSize}
        />
      </div>
      <PanelDetail
        detailSheet={detailSheet}
        detailTabId={detailTabId}
        detailImgId={detailImgId}
        managerAttributesSets={hashFieldsPanelDetailsSet.itemsSets}
        filters={filters}
        items={items}
        itemsIdSelected={itemsIdSelected}
        itemsIdToUpdateFromES={itemsIdToUpdateFromES}
      />
    </AreaContext>
  );
};

export default Area;
