import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Placeholder from "../../../../componentsBase/Placeholder";
import getFileIcon from "../../getFileIcon";
import IViewer from "./IViewer";

const useStyles = makeStyles({
  preview: {
    position: "relative",
    flex: 1,
    display: "flex",
    "align-items": "stretch",
    overflow: "hidden",
  },
});

const ViewPlaceholder = ({ assetData }: IViewer) => {
  const classes = useStyles({});
  const { mimeType } = assetData;
  return (
    <div className={classes.preview}>
      <Placeholder
        icon={getFileIcon(mimeType)}
        iconStyle={{ marginBottom: 10 }}
        label="Zoom unavailable"
      />
    </div>
  );
};

export default ViewPlaceholder;
