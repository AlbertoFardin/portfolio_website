import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import AssetPreview from "../../../../../componentsBase/AssetPreview";
import { IMedia } from "../../../../../interfaces";

const useStyles = makeStyles({
  previewPlaceholder: {
    position: "relative",
    overflow: "hidden",
    flex: 1,
    display: "flex",
    "align-items": "center",
    "background-color": "#F5F5F5",
  },
  flex1: {
    flex: 1,
  },
});

interface IPreviewPlaceholder {
  colorTheme: string;
  media: IMedia;
  required?: boolean;
}

const PreviewPlaceholder = ({
  colorTheme,
  media,
  required = false,
}: IPreviewPlaceholder) => {
  const { fileId } = media;
  const classes = useStyles({});
  const assetViewId = media.view;
  return (
    <div className={classes.previewPlaceholder}>
      <div className={classes.flex1} />
      <AssetPreview
        colorTheme={colorTheme}
        id={fileId}
        placeholderLabel={assetViewId}
        placeholderLabelStyle={{ color: "#D9D9D9", fontStyle: "30px" }}
        placeholderLabelRequired={required}
        style={{
          width: 400,
          height: 300,
          margin: 0,
        }}
      />
      <div className={classes.flex1} />
    </div>
  );
};

export default PreviewPlaceholder;
