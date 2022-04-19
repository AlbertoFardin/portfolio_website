import * as React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AssetPreview from "../../../../../../componentsBase/AssetPreview";
import apiUrls from "../../../../../../api/endpoints";
import {
  IProduct,
  IMedia,
  MediaType,
  Service,
} from "../../../../../../interfaces";
import ImageTypeLabel from "../ImageTypeLabel";
import { reducer, reducerInitState, ACTION } from "./reducer";
import PreviewImageZoom from "./PreviewImageZoom";
import PreviewImageAnnotation from "./PreviewImageAnnotation";

const useStyles = makeStyles({
  previewImage: {
    position: "relative",
    overflow: "hidden",
    flex: 1,
    display: "flex",
    "align-items": "center",
    "background-color": "#F5F5F5",
  },
  loading: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: "auto",
  },
  flex1: {
    flex: 1,
  },
});

interface IPreviewImage {
  assetData: IProduct;
  annotationsSelector?: string;
  annotationsEnabled?: boolean;
  colorTheme: string;
  loading: boolean;
  media: IMedia;
  required?: boolean;
  setLoading: (b: boolean) => void;
}

const PreviewImage = ({
  assetData,
  annotationsSelector,
  annotationsEnabled = false,
  colorTheme,
  loading,
  media,
  required = false,
  setLoading,
}: IPreviewImage) => {
  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const { imgHeight, imgWidth, annotationAction, annotationPending } = state;
  const { fileId, filename } = media;
  const classes = useStyles({});
  const divRef = React.useRef(null);
  const imageExist = !!filename;
  const imageUrl = apiUrls.getRendition.url(fileId, Service.SEECOMMERCE, "xxl");
  const assetViewId = media.view;
  const getImageSize = React.useCallback(
    (event) => {
      const imgWidth = event.path[0].width;
      const imgHeight = event.path[0].height;
      const boxWidth = divRef.current.clientWidth;
      const boxHeight = divRef.current.clientHeight;
      // adapt to container size, keeeping the image ratio, no matter the image natural size
      const offPerc = Math.min(boxWidth / imgWidth, boxHeight / imgHeight);
      dispatch({
        type: ACTION.IMG_SIZE,
        width: imgWidth * offPerc,
        height: imgHeight * offPerc,
      });
      setLoading(false);
    },
    [setLoading]
  );

  React.useEffect(() => {
    if (loading) {
      setTimeout(() => {
        const imageHtml = new Image();
        imageHtml.src = imageUrl;
        imageHtml.addEventListener("load", getImageSize);
        imageHtml.addEventListener("error", getImageSize);
      }, 500); // wait EastPanel animation fullscreen
    }
  }, [filename, getImageSize, imageUrl, loading]);

  React.useEffect(() => {
    if (filename) setLoading(true);
  }, [filename, setLoading]);

  return (
    <div ref={divRef} className={classes.previewImage}>
      {loading ? (
        <CircularProgress className={classes.loading} />
      ) : (
        <>
          {!imageExist ? (
            <>
              <div className={classes.flex1} />
              <AssetPreview
                colorTheme={colorTheme}
                id={fileId}
                placeholderLabel={assetViewId}
                placeholderLabelStyle={{ fontStyle: "30px" }}
                placeholderLabelRequired={required}
                style={{
                  width: 650,
                  height:
                    (!!divRef &&
                      !!divRef.current &&
                      divRef.current.clientHeight - 100) ||
                    0,
                  margin: 0,
                }}
              />
              <div className={classes.flex1} />
            </>
          ) : (
            <>
              {annotationsEnabled ? (
                <PreviewImageAnnotation
                  dispatchPreview={dispatch}
                  itemId={assetData.id}
                  annotationsSelector={annotationsSelector}
                  media={media}
                  required={required}
                  annotationAction={annotationAction}
                  annotationPending={annotationPending}
                  imgWidth={imgWidth}
                  imgHeight={imgHeight}
                />
              ) : (
                <PreviewImageZoom fileId={media.fileId} />
              )}
            </>
          )}
        </>
      )}
      <ImageTypeLabel original={media.mediaType === MediaType.IMAGE_S} />
    </div>
  );
};

export default PreviewImage;
