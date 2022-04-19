import * as React from "react";
import * as Colors from "../../../componentsBase/style/Colors";
import Preview, { PreviewType } from "../../../componentsBase/Preview";
import { colorTheme, PANEL_DETAIL_WIDTH } from "../../../constants";
import getFileIcon from "../getFileIcon";
import { typeVideo } from "../../../mimeTypes";
import apiUrls from "../../../api/endpoints";
import { ACT_VPORT as ACT_V } from "../reducer";
import Content from "./Content/Content";
import BadgeShareUrls from "../Content/BadgeGetLink";
import BadgeOpenMedia from "../Content/BadgeOpenMedia";
import {
  IFileDetail,
  IMediaInfo,
  SheetLayout,
  ICopyright,
  Service,
} from "../../../interfaces";
import Divider from "@material-ui/core/Divider";
import { ContextDispatchViewport } from "../contexts";
import classnames from "classnames";
import ActionsBar from "./ActionsBar";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(({ zIndex }) => ({
  sheetDefault: {
    height: "100%",
    flex: 1,
    "overflow-x": "hidden",
    "overflow-y": "overlay",
    position: "relative",
  },
  isDirty: {
    "z-index": zIndex.drawer + 12,
  },
}));

interface ILayoutDefault {
  dispatchPanel: React.Dispatch<unknown>;
  assetData: IFileDetail;
  mediaData: IMediaInfo;
  dirtyCopyright: ICopyright;
  saveCopyright: boolean;
}

const LayoutDefault = ({
  dispatchPanel,
  assetData,
  mediaData,
  dirtyCopyright,
  saveCopyright,
}: ILayoutDefault) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const classes = useStyles({});
  const { documentRepoId, mimeType } = assetData;
  const icon = getFileIcon(mimeType);
  const isVideo = new Set(typeVideo).has(mimeType);
  const rendition = isVideo ? "LQ" : "l";
  const srcUrl = apiUrls.getRendition.url(
    documentRepoId,
    Service.DIGITALASSETS,
    rendition
  );
  const srcType = isVideo ? PreviewType.VIDEO : PreviewType.IMAGE;
  const onDoubleClick = React.useCallback(() => {
    dispatchViewport({
      type: ACT_V.SHEET_LAYOUT,
      layout: SheetLayout.FULLSCREEN,
    });
  }, [dispatchViewport]);

  return (
    <>
      <div
        className={classnames({
          [classes.sheetDefault]: true,
          [classes.isDirty]: !!dirtyCopyright,
        })}
      >
        <BadgeOpenMedia data={assetData} style={{ top: 13, left: 15 }} />
        <BadgeShareUrls data={assetData} style={{ top: 13, right: 15 }} />
        <Preview
          colorTheme={colorTheme}
          srcUrl={srcUrl}
          srcType={srcType}
          placeholderIcon={icon}
          style={{
            width: PANEL_DETAIL_WIDTH,
            height: 300,
            backgroundColor: Colors.Gray4,
          }}
          onDoubleClick={onDoubleClick}
        />
        <Divider />
        <Content
          dispatchPanel={dispatchPanel}
          assetData={assetData}
          mediaData={mediaData}
          dirtyCopyright={dirtyCopyright}
        />
      </div>
      <ActionsBar
        dispatchPanel={dispatchPanel}
        dirtyCopyright={dirtyCopyright}
        saveCopyright={saveCopyright}
      />
    </>
  );
};

export default LayoutDefault;
