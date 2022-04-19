import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import apiUrls from "../../../../api/endpoints";
import { Service } from "../../../../interfaces";
import IViewer from "./IViewer";

const useStyles = makeStyles({
  preview: {
    position: "relative",
    flex: 1,
    display: "flex",
    "align-items": "stretch",
    overflow: "hidden",
    "background-color": "#000",
  },
  video: {
    height: "100%",
    "max-height": "100%",
    "max-width": "100%",
    "user-select": "none",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: "auto",
  },
});

const ViewerVideo = ({ assetData }: IViewer) => {
  const classes = useStyles({});
  const { documentRepoId } = assetData;
  const srcUrl = apiUrls.getRendition.url(
    documentRepoId,
    Service.DIGITALASSETS,
    "HQ"
  );
  return (
    <div className={classes.preview}>
      <video className={classes.video} src={srcUrl} muted loop controls />
    </div>
  );
};

export default ViewerVideo;
