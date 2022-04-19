import makeStyles from "@material-ui/core/styles/makeStyles";
import Toolbar from "@material-ui/core/Toolbar";
import * as Colors from "../../../../componentsBase/style/Colors";
import * as React from "react";
import ISheetContent from "../ISheetContent";
import Drawer from "../../../Drawer";
import { Divider } from "@material-ui/core";
import { typeVideo } from "../../../../mimeTypes";
import ViewVideo from "./ViewVideo";
import ViewImage from "./ViewImage";
import MediaInfo from "../MediaInfo";

const useStyles = makeStyles({
  sheetFullscreen: {
    height: "100%",
    flex: 1,
    display: "flex",
    "flex-direction": "column",
    position: "relative",
    "align-items": "stretch",
  },
  content: {
    flex: 1,
    display: "flex",
    "flex-direction": "row",
    position: "relative",
    "align-items": "stretch",
    "min-height": 0,
    "background-color": Colors.Gray4,
  },
  toolbar: {
    padding: "0 10px",
  },
  flex1: {
    flex: 1,
  },
});

const LayoutFullscreen = ({ assetData }: ISheetContent) => {
  const classes = useStyles({});
  const { mimeType } = assetData;
  const isVideo = new Set(typeVideo).has(mimeType);
  console.log("xxx");
  return (
    <div className={classes.sheetFullscreen}>
      <div className={classes.content}>
        {isVideo ? (
          <ViewVideo assetData={assetData} />
        ) : (
          <ViewImage assetData={assetData} />
        )}
        <Drawer direction="left">
          <MediaInfo assetData={assetData} fullscreen={true} />
        </Drawer>
      </div>
      <Divider />
      <Toolbar className={classes.toolbar} />
    </div>
  );
};

export default LayoutFullscreen;
