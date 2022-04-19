import * as React from "react";
import * as Colors from "../../../componentsBase/style/Colors";
import {
  IFile,
  IPath,
  Service,
  Severity,
  SheetLayout,
  SheetStatus,
} from "../../../interfaces";
import TypographyEllipsis from "../../../componentsBase/TypographyEllipsis";
import LoadingMask from "../../../componentsBase/LoadingMask";
import DrawerDetail, { BtnToggle } from "../../DrawerDetail";
import { ACT_VPORT } from "../reducer";
import reducer, { reducerInitState, ACT_PANEL } from "./reducer";
import {
  getFilesDetail,
  getMediaInfo,
  putCopyright,
} from "../../../api/fetchesApi";
import { ContextDispatchViewport } from "../contexts";
import DialogUnsaved from "./DialogUnsaved";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { getItemActions, MAP_TYPE } from "../actions";
import BtnAction from "../ToolbarHeader/BtnAction";
import LayoutDefault from "./LayoutDefault";
import LayoutFullscreen from "./LayoutFullscreen";
import Divider from "@material-ui/core/Divider";
import { ContextPermissions, ContextSetSnackbar } from "../../contexts";
import { genericErrorText } from "../../../utils/manageFetchErrors";

const useStyles = makeStyles(({ zIndex }) => ({
  flex1: {
    flex: 1,
  },
  divider: {
    "border-right": `1px solid ${Colors.Gray2}`,
    height: 23,
    "margin-right": 12,
    "margin-left": 5,
  },
  backdrop: {
    "z-index": zIndex.drawer + 11,
    "background-color": "transparent",
    position: "fixed",
    right: 0,
    bottom: 0,
    top: 0,
    left: 0,
  },
}));

interface IPanelDetail {
  detailSheet: SheetLayout;
  assetDataId: string;
  items: IFile[];
  path: IPath[];
}

const PanelDetail = ({
  detailSheet,
  assetDataId,
  items,
  path,
}: IPanelDetail) => {
  const classes = useStyles({});
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const setSnackbar = React.useContext(ContextSetSnackbar);
  const permissions = React.useContext(ContextPermissions);

  const [statePanel, dispatchPanel] = React.useReducer(
    reducer,
    reducerInitState
  );
  const {
    saveCopyright,
    loadingDetail,
    assetData,
    mediaData,
    dirtyCopyright,
    dialogUnsaved,
  } = statePanel;
  const fullscreen = detailSheet === SheetLayout.FULLSCREEN;
  const itemData = items.find(({ id }) => id === assetDataId);
  const isDirty = !!Object.keys(dirtyCopyright).length;

  const onSheetChange = React.useCallback(
    (layout: SheetLayout) => {
      dispatchViewport({ type: ACT_VPORT.SHEET_LAYOUT, layout });
    },
    [dispatchViewport]
  );
  const onSheetReset = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.ITEMS_DESELECT });
    dispatchPanel({ type: ACT_PANEL.RESET });
  }, [dispatchViewport]);
  const onBackdropClick = React.useCallback(() => {
    dispatchPanel({ type: ACT_PANEL.DIALOG_UNSAVED });
  }, []);
  const onActionClick = React.useCallback(
    (event, id) => {
      const type = MAP_TYPE[id];
      if (type) dispatchViewport({ type });
    },
    [dispatchViewport]
  );

  // set base detail
  React.useEffect(() => {
    if (assetDataId && itemData && detailSheet !== SheetLayout.CLOSED) {
      dispatchPanel({ type: ACT_PANEL.SET_DETAIL_BASE, itemData });
    }
  }, [assetDataId, detailSheet, itemData]);

  // get full detail
  React.useEffect(() => {
    (async () => {
      if (loadingDetail) {
        try {
          const [newAssetData] = await getFilesDetail([assetDataId]);
          const newMediaData = await getMediaInfo(
            newAssetData.documentRepoId,
            Service.DIGITALASSETS
          );
          dispatchPanel({
            type: ACT_PANEL.SET_DETAIL_FULL,
            assetData: newAssetData,
            mediaData: newMediaData,
          });
        } catch {
          dispatchViewport({ type: ACT_VPORT.ITEMS_DESELECT });
        }
      }
    })();
  }, [assetDataId, dispatchViewport, loadingDetail]);

  // save dirty copyright
  React.useEffect(() => {
    (async () => {
      if (saveCopyright && isDirty && assetData) {
        try {
          await putCopyright({
            fileId: assetData.documentRepoId,
            correlationId: assetData.id,
            ...dirtyCopyright,
          });

          setSnackbar(Severity.SUCCESS, "Digital Right updated");
        } catch {
          setSnackbar(Severity.WARNING, genericErrorText);
        }
        dispatchPanel({ type: ACT_PANEL.SAVE_COPYRIGHT_STOPPED });
      }
    })();
  }, [assetData, dirtyCopyright, isDirty, saveCopyright, setSnackbar]);

  // reset
  React.useEffect(() => {
    if (!assetDataId && !!assetData) {
      dispatchPanel({ type: ACT_PANEL.RESET });
    }
  }, [assetData, assetDataId]);

  return (
    <DrawerDetail
      layout={detailSheet}
      onChange={onSheetChange}
      onReset={onSheetReset}
      status={assetData ? SheetStatus.VISIBLE : SheetStatus.PHOLDER}
      title={
        <>
          <TypographyEllipsis
            variant="body2"
            children={assetData ? assetData.name : ""}
          />
          <div className={classes.flex1} />
          {!assetData || !fullscreen ? null : (
            <>
              {getItemActions({
                permissions,
                contextmenu: false,
                detailSheet: SheetLayout.FULLSCREEN,
                path,
                items: [assetData],
                itemsIdSelected: [assetData.id],
                onClick: onActionClick,
              }).map((a) => (
                <BtnAction key={a.id} {...a} />
              ))}
              <div className={classes.divider} />
            </>
          )}
          <BtnToggle layout={detailSheet} onChange={onSheetChange} />
        </>
      }
      content={
        <>
          {!isDirty ? null : (
            <div
              role="presentation"
              className={classes.backdrop}
              onClick={onBackdropClick}
            />
          )}
          <LoadingMask open={saveCopyright} spinner={false} />
          <DialogUnsaved
            dispatchPanel={dispatchPanel}
            open={dialogUnsaved}
            dirtyCopyright={dirtyCopyright}
          />
          <Divider />
          {fullscreen ? (
            <LayoutFullscreen
              dispatchPanel={dispatchPanel}
              assetData={assetData}
              mediaData={mediaData}
              dirtyCopyright={dirtyCopyright}
              saveCopyright={saveCopyright}
            />
          ) : (
            <LayoutDefault
              dispatchPanel={dispatchPanel}
              assetData={assetData}
              mediaData={mediaData}
              dirtyCopyright={dirtyCopyright}
              saveCopyright={saveCopyright}
            />
          )}
        </>
      }
    />
  );
};

export default PanelDetail;
