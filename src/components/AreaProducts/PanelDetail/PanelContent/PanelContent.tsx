import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { IProduct, IMediaInfo, AttributeFamily } from "../../../../interfaces";
import { PointSelector } from "../../../../componentsBase/ImageAnnotation";
import Divider from "@material-ui/core/Divider";
import DialogUnsaved from "./DialogUnsaved";
import DialogConflict from "./DialogConflict";
import DialogDictionary from "./DialogDictionary";
import DialogCategory from "./DialogCategory";
import { IDialogCategory, IDialogDictionary } from "../interfaces";
import { getAssetdataMerge, getAssetdataDiffs } from "../getAssetdataMerge";
import { ContextCatalogs, ContextColumns } from "../../contexts";
import PanelContentSection from "./PanelContentSection";
import Actionsbar from "../Actionsbar";
import getDialogDictValue from "./getDialogDictValue";
import { PanelFamily, SelectFamily } from "../SelectFamily";
import MsgEntityTypes from "./MsgEntityTypes";
import MsgEntityQueue from "./MsgEntityQueue";
import MsgMaxSelected from "./MsgMaxSelected";
import { KEY_ENTITY_TYPE } from "../../../../constants";
import LoadingMask from "../../../../componentsBase/LoadingMask";
import { IItemsSet } from "../../../../componentsBase/ConfigManagement";

const useStyles = makeStyles({
  panelContent: {
    display: "flex",
    "flex-direction": "row",
    height: "-webkit-fill-available",
    overflow: "hidden",
  },
});

interface IPanelContent {
  assetDatas: IProduct[];
  assetdataDirty;
  detailTabId: string;
  detailImgId: string;
  fullscreen: boolean;
  mediaData: IMediaInfo;
  annotationsSelector: PointSelector;
  annotationsEnabled: boolean;
  attributesIdVisible: string[];
  showDialogUnsaved: boolean;
  showDialogConflict: boolean;
  showDialogDictionary: IDialogDictionary;
  showDialogCategory: IDialogCategory;
  selectedCatalog: string;
  selectedLanguages: string[];
  editingConflict: boolean;
  editingSaveRequest: boolean;
  editingProcessed: boolean;
  editingMaxSelected: boolean;
  searchAttributeValue: string;
  searchAttributeOpen: boolean;
  managerAttributesSets: IItemsSet[];
}

const PanelContent = ({
  assetDatas,
  assetdataDirty,
  detailTabId,
  detailImgId,
  fullscreen,
  mediaData,
  annotationsSelector,
  annotationsEnabled,
  attributesIdVisible,
  showDialogUnsaved,
  showDialogConflict,
  showDialogDictionary,
  showDialogCategory,
  selectedCatalog,
  selectedLanguages,
  editingConflict,
  editingSaveRequest,
  editingProcessed,
  editingMaxSelected,
  searchAttributeValue,
  searchAttributeOpen,
  managerAttributesSets,
}: IPanelContent) => {
  const classes = useStyles({});
  const columns = React.useContext(ContextColumns);
  const catalogs = React.useContext(ContextCatalogs);

  const assetdataMerge = React.useMemo(() => {
    return getAssetdataMerge(assetDatas, columns, catalogs);
  }, [assetDatas, columns, catalogs]);
  const assetdataDiffs = React.useMemo(() => {
    return getAssetdataDiffs(assetDatas, columns, catalogs);
  }, [assetDatas, columns, catalogs]);
  const assetdataCount = assetDatas.length;
  const editingMultiTypes =
    assetDatas.reduce((acc, item) => {
      const itemType = item[KEY_ENTITY_TYPE];
      if (!new Set(acc).has(itemType)) acc.push(itemType);
      return acc;
    }, []).length > 1;

  if (editingMaxSelected) {
    return <MsgMaxSelected />;
  }

  if (editingMultiTypes) {
    return <MsgEntityTypes assetDatas={assetDatas} />;
  }

  if (editingProcessed) {
    return <MsgEntityQueue />;
  }

  return (
    <>
      <SelectFamily
        detailTabId={detailTabId}
        fullscreen={fullscreen}
        assetdataCount={assetdataCount}
        assetdataMerge={assetdataMerge}
        searchAttributeOpen={searchAttributeOpen}
        searchAttributeValue={searchAttributeValue}
      />
      <Divider />

      <DialogUnsaved
        // dialog che avverte che non hai salvato
        open={showDialogUnsaved}
        assetdataDirty={assetdataDirty}
      />
      <DialogConflict
        // dialog che avverte un conflitto di concorrenza
        open={showDialogConflict}
      />
      <DialogDictionary
        // dialog del campo dizionario
        {...showDialogDictionary}
        value={getDialogDictValue({
          ...showDialogDictionary,
          assetdataDirty,
          assetdataMerge,
        })}
      />
      <DialogCategory
        // dialog del campo categorie
        {...showDialogCategory}
        value={getDialogDictValue({
          ...showDialogCategory,
          assetdataDirty,
          assetdataMerge,
        })}
      />

      <LoadingMask
        open={editingSaveRequest}
        backgroundColor="rgba(250,250,250,0.75)"
      />
      <Actionsbar
        fullscreen={fullscreen}
        assetdataDirty={assetdataDirty}
        editingConflict={editingConflict}
        editingSaveRequest={editingSaveRequest}
      />

      <div className={classes.panelContent}>
        <PanelFamily
          fullscreen={fullscreen}
          detailTabId={detailTabId}
          assetdataCount={assetdataCount}
          assetdataMerge={assetdataMerge}
          searchAttributeOpen={searchAttributeOpen}
        />
        <PanelContentSection
          assetdataDirty={assetdataDirty}
          assetdataMerge={assetdataMerge}
          assetdataDiffs={assetdataDiffs}
          assetdataCount={assetdataCount}
          detailTabId={detailTabId}
          detailImgId={detailImgId}
          fullscreen={fullscreen}
          mediaData={mediaData}
          annotationsSelector={annotationsSelector}
          annotationsEnabled={annotationsEnabled}
          attributesIdVisible={attributesIdVisible}
          selectedCatalog={selectedCatalog}
          selectedLanguages={selectedLanguages}
          searchAttributeOpen={searchAttributeOpen}
          searchAttributeValue={searchAttributeValue}
          managerAttributesSets={managerAttributesSets}
        />
        {!fullscreen || detailTabId === AttributeFamily.MEDIA ? null : (
          <>
            <Divider style={{ width: 1, height: "inherit" }} />
            <div style={{ flex: 1 }} />
          </>
        )}
      </div>
    </>
  );
};

export default PanelContent;
