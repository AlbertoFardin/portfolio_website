import * as React from "react";
import ImageZoom from "../../../../componentsBase/ImageZoom";
import apiUrls from "../../../../api/endpoints";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { IFileDetail } from "../../../../interfaces";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles({
  preview: {
    position: "relative",
    flex: 1,
    display: "flex",
    "align-items": "stretch",
    overflow: "hidden",
  },
});

interface IViewImage {
  assetData: IFileDetail;
}

const ViewImage = ({ assetData }: IViewImage) => {
  const location = useLocation();
  const classes = useStyles({});
  const { documentRepoId } = assetData;
  return (
    <div className={classes.preview}>
      <ImageZoom
        images={[
          apiUrls.getRenditionPublic.url(
            location.search.replace("?link=", ""),
            documentRepoId
          ),
        ]}
        imageIndex={0}
      />
    </div>
  );
};

export default ViewImage;
