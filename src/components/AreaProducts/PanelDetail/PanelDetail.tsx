import * as React from "react";
import {
  SheetLayout,
  SheetStatus,
  IProduct,
  IFilter,
  Severity,
  ContentType,
  Service,
} from "../../../interfaces";
import getSearchString, { NO_VALUE } from "../getSearchString";
import DrawerDetail from "../../DrawerDetail";
import PanelHeader from "./PanelHeader";
import PanelContent from "./PanelContent";
import { useHistory, useLocation } from "react-router-dom";
import { ACT_VPORT } from "../reducer";
import {
  ContextCatalogs,
  ContextCategories,
  ContextColumns,
  ContextDispatchDetail,
  ContextDispatchViewport,
} from "../contexts";
import last from "lodash-es/last";
import reducer, { ACT_DETAIL, initState } from "./reducer";
import intersection from "lodash-es/intersection";
import isFiltered from "../../FiltersChips/isFiltered";
import {
  getMediaInfo,
  setReady,
  resetAttribute,
} from "../../../api/fetchesApi";
import getActiveItems from "../../../utils/getActiveItems";
import { IItemsSet } from "../../../componentsBase/ConfigManagement";
import makeStyles from "@material-ui/core/styles/makeStyles";
import apiUrls from "../../../api/endpoints";
import getDirtyJsonToSave from "./getDirtyJsonToSave";
import { fetchCookieJwtWithRefreshToken } from "../../../api/fetchCookieJwt";
import { ContextSetSnackbar } from "../../contexts";
import { KEY_CATALOG, MAX_PRODUCTS_MASSIVE_ACTIONS } from "../../../constants";
import { genericErrorText } from "../../../utils/manageFetchErrors";
import { HEADER_COLOR, HEADER_COLOR_BULK } from "./constants";
import getProducts from "../getProducts";

const useStyles = makeStyles(({ zIndex }) => ({
  dirtySheet: {
    "z-index": zIndex.drawer + 5,
  },
  dirtyBackdrop: {
    "z-index": zIndex.drawer + 5,
    "background-color": "transparent",
    position: "fixed",
    right: 0,
    bottom: 0,
    top: 0,
    left: 0,
  },
  header: {
    "background-color": HEADER_COLOR,
  },
  headerBulk: {
    "background-color": HEADER_COLOR_BULK,
  },
}));

interface IGetStatus {
  itemsIdSelected: string[];
  assetDatas: IProduct[];
  editingProcessed: boolean;
  editingMaxSelected: boolean;
}
const getStatus = ({
  itemsIdSelected,
  assetDatas,
  editingProcessed,
  editingMaxSelected,
}: IGetStatus): SheetStatus => {
  if (editingProcessed || editingMaxSelected) {
    return SheetStatus.VISIBLE;
  }

  if (itemsIdSelected.length === 0) {
    return SheetStatus.PHOLDER;
  }

  const idsSelect = itemsIdSelected.sort().join();
  const idsStored = assetDatas
    .map((x) => x.id)
    .sort()
    .join();

  if (idsSelect === idsStored) {
    return SheetStatus.VISIBLE;
  }

  return SheetStatus.LOADING;
};

interface IPanelDetail {
  detailSheet: SheetLayout;
  detailTabId: string;
  detailImgId: string;
  filters: IFilter[];
  items: IProduct[];
  itemsIdSelected: string[];
  itemsIdToUpdateFromES: string[];
  managerAttributesSets: IItemsSet[];
}

const PanelDetail = ({
  detailSheet,
  detailTabId,
  detailImgId,
  filters,
  items,
  itemsIdSelected,
  itemsIdToUpdateFromES,
  managerAttributesSets,
}: IPanelDetail) => {
  const classes = useStyles({});
  const history = useHistory();
  const searchString = useLocation().search;

  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const catalogs = React.useContext(ContextCatalogs);
  const columns = React.useContext(ContextColumns);
  const categories = React.useContext(ContextCategories);
  const setSnackbar = React.useContext(ContextSetSnackbar);

  const open = detailSheet !== SheetLayout.CLOSED;
  const fullscreen = detailSheet === SheetLayout.FULLSCREEN;
  const filtered = isFiltered(filters);
  const attributesIdVisible: string[] = React.useMemo(() => {
    return getActiveItems(managerAttributesSets, columns).map((c) => c.id);
  }, [columns, managerAttributesSets]);

  const [stateDetail, dispatchDetail] = React.useReducer(reducer, initState);
  const {
    assetDatas,
    assetdataDirty,
    assetdataFetching,
    mediaData,
    annotationsEnabled,
    annotationsSelector,
    showDialogCategory,
    showDialogConflict,
    showDialogDictionary,
    showDialogUnsaved,
    selectedCatalog,
    selectedLanguages,
    editingConflict,
    editingVersions,
    editingSaveProcess,
    editingSaveRequest,
    editingProcessed,
    editingMaxSelected,
    toReadyAttribute,
    toResetAttribute,
    managerAttributesOpen,
    searchAttributeOpen,
    searchAttributeValue,
  } = stateDetail;
  const dirty = !!Object.keys(assetdataDirty).length;

  const onSheetChange = React.useCallback(
    (layout: SheetLayout) => {
      history.push(
        getSearchString(
          {
            entityId: last(itemsIdSelected),
            detailSheet: layout,
          },
          searchString
        )
      );

      // bisogna reinizializzare il riduttore se si chiude/collassa il dettaglio di un prodotto
      // aperto in un nuovo tab del browser attraverso un deep link
      // questo significa che:
      // * lo stato di partenza del detailSheet è SheetLayout.FULLSCREEN
      // * c'è solo un item in Grid
      // * non ci sono filtri valorizzati
      if (
        !filtered &&
        (items.length === 0 || items.length === 1) &&
        detailSheet === SheetLayout.FULLSCREEN
      ) {
        dispatchViewport({ type: ACT_VPORT.RESET });
      }
    },
    [
      detailSheet,
      dispatchViewport,
      filtered,
      history,
      items.length,
      itemsIdSelected,
      searchString,
    ]
  );
  const onSheetReset = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.ITEMS_DESELECT });
  }, [dispatchViewport]);
  const onBackdropClick = React.useCallback(() => {
    dispatchDetail({ type: ACT_DETAIL.SHOW_DIALOG_UNSAVED, value: true });
  }, []);

  const idsStored = assetDatas
    .map((a) => a.id)
    .sort()
    .join();
  const idsSelect = itemsIdSelected.sort().join();
  const changedIdsSelected = idsStored !== idsSelect;
  const needUpdateAssetdatas = !!intersection(
    itemsIdSelected,
    itemsIdToUpdateFromES
  ).length;

  // get assetdatas when opened & updated after save editing
  React.useEffect(() => {
    if (
      open &&
      (needUpdateAssetdatas || changedIdsSelected) &&
      !assetdataFetching &&
      !!catalogs.length &&
      !!itemsIdSelected.length &&
      !editingProcessed
    ) {
      (async () => {
        const ids = itemsIdSelected;

        if (ids.length > MAX_PRODUCTS_MASSIVE_ACTIONS) {
          console.log("[PanelDetail] max products selected", { ids });
          dispatchDetail({ type: ACT_DETAIL.EDITING_MAX_SELECTED });
        } else {
          dispatchDetail({ type: ACT_DETAIL.ASSETDATAS_FETCHED });

          const assetDatas = await getProducts({
            ids,
            columns,
            categories,
          });

          if (!!assetDatas.length) {
            dispatchDetail({
              type: ACT_DETAIL.ASSETDATAS_UPDATED,
              assetDatas,
              catalogs,
            });
          } else {
            console.warn("[PanelDetail] assetDatas not found -", ids);
            history.push(getSearchString({ entityId: null }, searchString));
            dispatchViewport({ type: ACT_VPORT.RESET });
            dispatchDetail({ type: ACT_DETAIL.RESET });
          }
        }
      })();
    }
  }, [
    assetdataFetching,
    catalogs,
    categories,
    changedIdsSelected,
    columns,
    dispatchViewport,
    editingProcessed,
    history,
    itemsIdSelected,
    needUpdateAssetdatas,
    open,
    searchString,
  ]);

  // reset reducer
  React.useEffect(() => {
    if (!open) {
      dispatchDetail({ type: ACT_DETAIL.RESET });
    }
  }, [open]);

  // update media data
  React.useEffect(() => {
    (async () => {
      if (open && detailImgId !== NO_VALUE) {
        try {
          const payload = await getMediaInfo(detailImgId, Service.SEECOMMERCE);
          dispatchDetail({ type: ACT_DETAIL.MEDIADATA_UPDATED, payload });
        } catch (err) {
          dispatchDetail({ type: ACT_DETAIL.MEDIADATA_RESETED });
        }
      }
    })();
  }, [detailImgId, open]);

  // fetch EDIT attribute
  React.useEffect(() => {
    // la richiesta avviene quando "saveRequest=true" e "saving=false"
    // "saving=false" blocca una possibile seconda chiamata di rerender
    if (editingSaveRequest && !editingSaveProcess) {
      (async () => {
        try {
          dispatchDetail({ type: ACT_DETAIL.EDITING_SAVE_PROCESS });
          const bulk = assetDatas.length > 1;
          const { url, method } = bulk
            ? apiUrls.editMultiProduct
            : apiUrls.editProduct;

          const jsonBody = getDirtyJsonToSave({
            versions: editingVersions,
            assetdataDirty,
            columns,
          });

          const { error } = await fetchCookieJwtWithRefreshToken({
            url: url(),
            method,
            jsonBody,
          });

          if (!bulk) {
            if (error) throw error;
          } else {
            setSnackbar(
              Severity.SUCCESS,
              `Editing request has been received and will be applied soon`
            );
            dispatchDetail({ type: ACT_DETAIL.EDITING_SAVE_STOPPED });
          }
        } catch {
          dispatchDetail({
            type: ACT_DETAIL.SHOW_DIALOG_CONFLICT,
            value: true,
          });
        }
      })();
    }
  }, [
    assetDatas.length,
    assetdataDirty,
    columns,
    editingSaveProcess,
    editingSaveRequest,
    editingVersions,
    setSnackbar,
  ]);

  // se c'è almeno un dirty, recupero e salvo le versioni delle entità editate
  React.useEffect(() => {
    if (!!dirty && !editingVersions.length) {
      dispatchDetail({
        type: ACT_DETAIL.SET_VERSION,
        versions: assetDatas.map(({ id, version }) => ({
          id,
          version,
        })),
      });
    }
  }, [assetDatas, dirty, editingVersions.length]);

  // fetch READY attribute
  React.useEffect(() => {
    if (!!toReadyAttribute) {
      (async () => {
        try {
          const { id, version } = assetDatas[0];
          const { attributeId, catalogId, languages } = toReadyAttribute;
          const column = columns.find((c) => c.id === attributeId);
          const { multiCatalog, multiLanguage, attributeName, label } = column;

          let catalogsToReady = (assetDatas[0][KEY_CATALOG] || []) as
            | string[]
            | Array<{ catalogName: string; languages: string[] }>;

          if (multiCatalog) {
            catalogsToReady =
              multiLanguage && !!languages
                ? [
                    {
                      catalogName: catalogId,
                      languages,
                    },
                  ]
                : [catalogId];
          }

          const res = await setReady({
            idType: ContentType.ATTRIBUTE,
            entityId: id,
            id: attributeName,
            catalogs: catalogsToReady,
            version,
          });
          if (res.error) throw res.error;

          setSnackbar(Severity.SUCCESS, `Attribute "${label}" was set Ready`);
        } catch (err) {
          console.warn("AttributesEditor ERROR", err);
          setSnackbar(Severity.WARNING, genericErrorText);
        }

        dispatchDetail({ type: ACT_DETAIL.SET_ATTRIBUTE_READY });
      })();
    }
  }, [assetDatas, columns, setSnackbar, toReadyAttribute]);

  // fetch RESET attribute
  React.useEffect(() => {
    if (!!toResetAttribute) {
      (async () => {
        try {
          const { id, version } = assetDatas[0];
          const { attributeId, catalogId, languages } = toResetAttribute;
          const column = columns.find((c) => c.id === attributeId);
          const { attributeName } = column;

          const res = await resetAttribute({
            entityId: id,
            version,
            attributeName,
            catalogId,
            languageId: !!languages ? languages[0] : undefined,
          });
          if (res.error) throw res.error;

          setSnackbar(
            Severity.SUCCESS,
            "Attribute value view will be reset soon"
          );
        } catch (err) {
          console.warn("AttributesEditor ERROR", err);
          setSnackbar(Severity.WARNING, genericErrorText);
        }

        dispatchDetail({ type: ACT_DETAIL.SET_ATTRIBUTE_RESET });
      })();
    }
  }, [assetDatas, columns, setSnackbar, toResetAttribute]);

  return (
    <>
      {!dirty ? null : (
        <div
          role="presentation"
          className={classes.dirtyBackdrop}
          onClick={onBackdropClick}
        />
      )}
      <ContextDispatchDetail.Provider value={dispatchDetail}>
        <DrawerDetail
          className={dirty ? classes.dirtySheet : undefined}
          classNameTitle={
            assetDatas.length > 1 ? classes.headerBulk : classes.header
          }
          layout={detailSheet}
          onChange={onSheetChange}
          onReset={onSheetReset}
          status={getStatus({
            itemsIdSelected,
            assetDatas,
            editingProcessed,
            editingMaxSelected,
          })}
          title={
            editingMaxSelected ? null : (
              <PanelHeader
                detailSheet={detailSheet}
                assetDatas={assetDatas}
                onSheetChange={onSheetChange}
                fullscreen={fullscreen}
                managerAttributesSets={managerAttributesSets}
                managerAttributesOpen={managerAttributesOpen}
                searchAttributeOpen={searchAttributeOpen}
                searchAttributeValue={searchAttributeValue}
                editingSaveRequest={editingSaveRequest}
                editingProcessed={editingProcessed}
              />
            )
          }
          content={
            <PanelContent
              assetDatas={assetDatas}
              assetdataDirty={assetdataDirty}
              detailTabId={detailTabId}
              detailImgId={detailImgId}
              fullscreen={fullscreen}
              mediaData={mediaData}
              annotationsSelector={annotationsSelector}
              annotationsEnabled={annotationsEnabled}
              attributesIdVisible={attributesIdVisible}
              showDialogCategory={showDialogCategory}
              showDialogConflict={showDialogConflict}
              showDialogDictionary={showDialogDictionary}
              showDialogUnsaved={showDialogUnsaved}
              selectedCatalog={selectedCatalog}
              selectedLanguages={selectedLanguages}
              editingConflict={editingConflict}
              editingSaveRequest={editingSaveRequest}
              editingProcessed={editingProcessed}
              editingMaxSelected={editingMaxSelected}
              searchAttributeOpen={searchAttributeOpen}
              searchAttributeValue={searchAttributeValue}
              managerAttributesSets={managerAttributesSets}
            />
          }
        />
      </ContextDispatchDetail.Provider>
    </>
  );
};

export default PanelDetail;
