import makeStyles from "@material-ui/core/styles/makeStyles";
import Switch from "@material-ui/core/Switch";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Btn, { IBtn } from "../../../../../componentsBase/Btn";
import {
  FreehandSelector,
  PointSelector,
} from "../../../../../componentsBase/ImageAnnotation";
import * as React from "react";
import { ViewType, IMedia, MediaType } from "../../../../../interfaces";
import BtnChangeView from "../Buttons/BtnChangeView";
import VerticalCarousel from "../VerticalCarousel";
import ListFields from "../ListFields";
import { colorTheme } from "../../../../../constants";
import BtnCarryOverMedia from "../Buttons/BtnCarryOverMedia";
import {
  ContextM2ms,
  ContextPermissions,
  ContextUsers,
} from "../../../../contexts";
import ILayout from "../ILayout";
import Drawer from "../../../../Drawer";
import PreviewImage from "./PreviewImage";
import PreviewVideo from "./PreviewVideo";
import PreviewPlaceholder from "./PreviewPlaceholder";
import getViewDetail from "../../../getViewDetail";
import { Divider } from "@material-ui/core";
import BtnBadge from "../../../../../componentsBase/BtnBadge";
import getBadgeViewAssignee from "../../../getBadgeViewAssignee";
import getBadgeViewCatalogs from "../../../getBadgeViewCatalogs";
import concat from "lodash-es/concat";
import ToolbarActionsLeft from "../ToolbarActions/ToolbarActionsLeft";
import ToolbarActionsRight from "../ToolbarActions/ToolbarActionsRight";
import permissionsCheck from "../../../../../utils/permissionsCheck";
import PERMISSIONS from "../../../../../permissions";
import {
  ContextCatalogs,
  ContextDispatchDetail,
  ContextDispatchViewport,
} from "../../../contexts";
import { ACT_DETAIL } from "../../reducer";

const Flex1 = () => <div style={{ flex: 1 }} />;
const useStyles = makeStyles({
  content: {
    flex: 1,
    display: "flex",
    "flex-direction": "row",
    position: "relative",
    "align-items": "stretch",
    "min-height": 0,
  },
  toolbar: {
    padding: "0 10px",
  },
  toolbarFooterGroup: {
    flex: 1,
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
  },
  mediaVerticalCarousel: {
    height: "100%",
  },
  field: {
    margin: "15px 0",
    "vertical-align": "top",
  },
  preview: {
    position: "relative",
    flex: 1,
    display: "flex",
    "align-items": "stretch",
  },
  drawer: {
    padding: "0 10px",
    flex: 1,
    display: "flex",
    "flex-direction": "column",
  },
});

const LayoutFullscreen = ({
  annotationsSelector,
  annotationsEnabled,
  assetData,
  histories,
  historySelected,
  historyIndex,
  mediaData,
  mediaSelected,
  setImageId,
  imageId,
  mediaIdReady,
  fullscreen,
}: ILayout) => {
  const classes = useStyles({});

  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const dispatchDetail = React.useContext(ContextDispatchDetail);
  const users = React.useContext(ContextUsers);
  const m2ms = React.useContext(ContextM2ms);
  const catalogs = React.useContext(ContextCatalogs);

  const [loading, setLoading] = React.useState(true);
  const { filename, fileId, mediaType } = mediaSelected;
  const isMediaExist = !!filename;
  const isVideo = mediaType === MediaType.VIDEO;
  const viewDetail = getViewDetail(assetData, mediaSelected.view);
  const onDrawerToggle = React.useCallback(() => {
    setLoading(true);
  }, []);
  const onCbVerticalCarouselClick = React.useCallback(
    (a: IMedia) => {
      setImageId(a.fileId);
    },
    [setImageId]
  );
  const onCbAnnotationEnabled = React.useCallback(
    (event, enabled: boolean) => {
      dispatchDetail({
        type: ACT_DETAIL.ANNOTATIONS_ENABLE,
        payload: enabled,
      });
    },
    [dispatchDetail]
  );
  const onCbAnnotationTypeFreehand = React.useCallback(() => {
    dispatchDetail({
      type: ACT_DETAIL.ANNOTATIONS_SELECTOR,
      payload: FreehandSelector.TYPE,
    });
  }, [dispatchDetail]);
  const onCbAnnotationTypePoint = React.useCallback(() => {
    dispatchDetail({
      type: ACT_DETAIL.ANNOTATIONS_SELECTOR,
      payload: PointSelector.TYPE,
    });
  }, [dispatchDetail]);
  const badges = React.useMemo(() => {
    return concat(
      getBadgeViewAssignee({
        dispatch: dispatchViewport,
        item: assetData,
        viewDetail,
        users,
        m2ms,
        style: { position: "relative", marginLeft: "-5px" },
      }),
      getBadgeViewCatalogs({
        dispatch: dispatchViewport,
        item: assetData,
        tenantCatalogs: catalogs,
        viewDetail,
        style: { position: "relative", marginLeft: 5 },
      })
    ).filter((a) => !!a);
  }, [assetData, dispatchViewport, m2ms, catalogs, users, viewDetail]);
  const permissions = React.useContext(ContextPermissions);
  const canAnnotation = permissionsCheck({
    keys: [PERMISSIONS.seecommerce_annotation],
    permissions,
  });

  return (
    <>
      <div className={classes.content}>
        <Drawer direction="right" onChange={onDrawerToggle}>
          <div className={classes.drawer}>
            <Toolbar style={{ padding: 0 }}>
              <BtnChangeView
                histories={histories}
                historyIndex={historyIndex}
                viewDetail={viewDetail}
                assetData={assetData}
                onChange={setImageId}
              />
              <Flex1 />
              {badges.map((p: IBtn, i: number) => (
                <BtnBadge key={i} {...p} />
              ))}
            </Toolbar>
            {!filename ? null : (
              <VerticalCarousel
                className={classes.mediaVerticalCarousel}
                colorTheme={colorTheme}
                medias={historySelected}
                mediaSelected={mediaSelected}
                assetData={assetData}
                onClick={onCbVerticalCarouselClick}
              />
            )}
          </div>
        </Drawer>

        <div className={classes.preview}>
          <BtnCarryOverMedia assetData={assetData} imageId={fileId} />
          {!isMediaExist ? (
            <PreviewPlaceholder
              colorTheme={colorTheme}
              media={mediaSelected}
              required={viewDetail.viewType === ViewType.MANDATORY}
            />
          ) : (
            <>
              {mediaSelected.mediaType === MediaType.VIDEO ? (
                <PreviewVideo media={mediaSelected} />
              ) : (
                <PreviewImage
                  assetData={assetData}
                  annotationsSelector={annotationsSelector}
                  annotationsEnabled={annotationsEnabled}
                  colorTheme={colorTheme}
                  media={mediaSelected}
                  required={viewDetail.viewType === ViewType.MANDATORY}
                  loading={loading}
                  setLoading={setLoading}
                />
              )}
            </>
          )}
        </div>

        <Drawer direction="left" onChange={onDrawerToggle}>
          {!isMediaExist ? null : (
            <div className={classes.drawer}>
              <Toolbar style={{ padding: 0 }}>
                <Typography variant="subtitle2" children="Media Info" />
              </Toolbar>
              <ListFields
                assetData={assetData}
                mediaData={mediaData}
                media={mediaSelected}
                users={users}
                m2ms={m2ms}
                fieldClassName={classes.field}
              />
            </div>
          )}
        </Drawer>
      </div>
      <Divider />
      <Toolbar className={classes.toolbar}>
        <div className={classes.toolbarFooterGroup}>
          <ToolbarActionsLeft
            assetData={assetData}
            mediaSelected={mediaSelected}
            setImageId={setImageId}
            fullscreen={fullscreen}
          />
          <Flex1 />
        </div>
        <div className={classes.toolbarFooterGroup}>
          <Flex1 />
          <ToolbarActionsRight
            assetData={assetData}
            imageId={imageId}
            historySelected={historySelected}
            mediaSelected={mediaSelected}
            mediaIdReady={mediaIdReady}
          />
          <Flex1 />
        </div>
        <div className={classes.toolbarFooterGroup}>
          <Flex1 />
          {!isMediaExist || isVideo || !canAnnotation ? null : (
            <>
              <Typography
                style={{
                  color: annotationsEnabled ? colorTheme : "#ccc",
                }}
                variant="body1"
                children={`View annotations (${
                  (mediaSelected &&
                    mediaSelected.annotations &&
                    mediaSelected.annotations.length) ||
                  0
                })`}
              />
              <Switch
                size="small"
                checked={annotationsEnabled}
                disabled={!isMediaExist}
                onChange={onCbAnnotationEnabled}
              />
              <Btn
                disabled={!annotationsEnabled}
                selected={annotationsSelector === FreehandSelector.TYPE}
                icon="gesture"
                onClick={onCbAnnotationTypeFreehand}
              />
              <Btn
                disabled={!annotationsEnabled}
                selected={annotationsSelector === PointSelector.TYPE}
                icon="my_location"
                onClick={onCbAnnotationTypePoint}
              />
            </>
          )}
        </div>
      </Toolbar>
    </>
  );
};

export default LayoutFullscreen;
