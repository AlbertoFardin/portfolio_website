import * as React from "react";
import PyramidZoom from "../../../../../../componentsBase/PyramidZoom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { BASE_URL } from "../../../../../../api/endpoints";
import { Service } from "../../../../../../interfaces";

const useStyles = makeStyles({
  preview: {
    position: "relative",
    flex: 1,
    display: "flex",
    "align-items": "stretch",
    overflow: "hidden",
    height: "100%",
  },
  previewZoom: {
    flex: 1,
    height: "initial !important", // fix height x img basse e larghe
  },
});

const PreviewImageZoom = ({ fileId }: { fileId: string }) => {
  const classes = useStyles({});
  return (
    <div className={classes.preview}>
      <PyramidZoom
        prefixUrl={"/pyramidzoom/"}
        showNavigationControl={true}
        className={classes.previewZoom}
        src={`${BASE_URL}/${Service.SEECOMMERCE}/products/media-content/${fileId}/zoom-tiles/tiles.dzi?redirect=false`}
      />
    </div>
  );
};

// React.memo is needed to fix reset zoom during product update
export default React.memo(PreviewImageZoom);
