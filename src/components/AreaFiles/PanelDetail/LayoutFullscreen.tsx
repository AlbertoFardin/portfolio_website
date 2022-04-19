import * as React from "react";
import Content from "./Content/Content";
import BadgeShareUrls from "../Content/BadgeGetLink";
import BadgeOpenMedia from "../Content/BadgeOpenMedia";
import Viewer from "./Viewer";
import classnames from "classnames";
import ActionsBar from "./ActionsBar";
import { IFileDetail, IMediaInfo, ICopyright } from "../../../interfaces";
import makeStyles from "@material-ui/core/styles/makeStyles";
import * as Colors from "../../../componentsBase/style/Colors";
import { PANEL_DETAIL_WIDTH } from "../../../constants";

const useStyles = makeStyles(({ zIndex }) => ({
  sheetFullscreen: {
    flex: 1,
    display: "flex",
    "flex-direction": "row",
    position: "relative",
    "align-items": "stretch",
    "min-height": 0,
  },
  panelViewer: {
    position: "relative",
    flex: 1,
    display: "flex",
    "flex-direction": "column",
    "background-color": Colors.Gray4,
  },
  panelFields: {
    overflow: "hidden",
    display: "flex",
    "align-items": "stretch",
    "flex-direction": "column",
    width: PANEL_DETAIL_WIDTH,
  },
  isDirty: {
    "z-index": zIndex.drawer + 12,
  },
  list: {
    "overflow-y": "overlay",
    "overflow-x": "hidden",
    flex: 1,
    overflow: "hidden",
    display: "flex",
    "align-items": "stretch",
    "flex-direction": "column",
  },
}));

interface ILayoutFullscreen {
  dispatchPanel: React.Dispatch<unknown>;
  assetData: IFileDetail;
  mediaData: IMediaInfo;
  dirtyCopyright: ICopyright;
  saveCopyright: boolean;
}

const LayoutFullscreen = ({
  dispatchPanel,
  assetData,
  mediaData,
  dirtyCopyright,
  saveCopyright,
}: ILayoutFullscreen) => {
  const classes = useStyles({});
  return (
    <>
      <div className={classes.sheetFullscreen}>
        <div className={classes.panelViewer}>
          <BadgeShareUrls data={assetData} style={{ top: 13, right: 13 }} />
          <BadgeOpenMedia data={assetData} style={{ top: 13, left: 13 }} />
          <Viewer assetData={assetData} />
        </div>
        <div
          className={classnames({
            [classes.panelFields]: true,
            [classes.isDirty]: !!dirtyCopyright,
          })}
        >
          <div className={classes.list}>
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
        </div>
      </div>
    </>
  );
};

export default LayoutFullscreen;
