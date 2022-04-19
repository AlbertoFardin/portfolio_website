import * as React from "react";
import * as Colors from "../../../../../componentsBase/style/Colors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AssetPreview from "../../../../../componentsBase/AssetPreview";
import PaperFold from "../../../../../componentsBase/PaperFold";
import { IProduct, MediaType, IMedia } from "../../../../../interfaces";
import VerticalCarousel from "../VerticalCarousel";
import { PANEL_DETAIL_WIDTH } from "../../../../../constants";
import BtnCarryOverMedia from "../Buttons/BtnCarryOverMedia";
import { getSrcUrl, getSrcType } from "../getSrc";

const previewContainerHeight = 400;
const previewContainerWidth = PANEL_DETAIL_WIDTH - 140;
const borderRadius = 6;
const useStyles = makeStyles({
  previewContainer: {
    display: "flex",
    "flex-direction": "row",
    "align-items": "stretch",
    margin: "0 auto",
    "background-color": Colors.Gray4,
    "border-radius": borderRadius,
    overflow: "hidden",
    height: previewContainerHeight,
    width: "fit-content",
  },
  mediaVerticalCarousel: {
    "min-width": 110,
    "flex-direction": "column",
    "background-color": Colors.Gray4,
  },
});

interface IPreviewContainer {
  colorTheme: string;
  assetData?: IProduct;
  imagesHistory?: IMedia[];
  image?: IMedia;
  imageRequired?: boolean;
  setFullscreen: (b: boolean) => void;
  setImageId: (s: string) => void;
}

const PreviewContainer = ({
  colorTheme,
  assetData,
  imagesHistory,
  image,
  imageRequired = false,
  setFullscreen,
  setImageId,
}: IPreviewContainer) => {
  const classes = useStyles({});
  const imageExist = !!image.filename;
  const onCbEastpanelFullscreen = React.useCallback(() => {
    setFullscreen(true);
  }, [setFullscreen]);
  const onCbVerticalCarouselClick = React.useCallback(
    (a: IMedia) => {
      setImageId(a.fileId);
    },
    [setImageId]
  );

  return (
    <div className={classes.previewContainer}>
      {!imageExist ? null : (
        <VerticalCarousel
          className={classes.mediaVerticalCarousel}
          colorTheme={colorTheme}
          medias={imagesHistory}
          mediaSelected={image}
          assetData={assetData}
          onClick={onCbVerticalCarouselClick}
        />
      )}
      <AssetPreview
        colorTheme={colorTheme}
        id={image.fileId}
        srcUrl={getSrcUrl(image, assetData)}
        srcType={getSrcType(image)}
        placeholderLabel={image.view}
        placeholderLabelRequired={imageRequired}
        placeholderLabelStyle={{ color: "#D9D9D9" }}
        style={{
          width: imageExist
            ? previewContainerWidth
            : previewContainerWidth + 110,
          height: previewContainerHeight,
          margin: 0,
          border: 0,
          backgroundColor: Colors.Gray4,
          borderRadius,
        }}
        onDoubleClick={onCbEastpanelFullscreen}
        children={
          <>
            <BtnCarryOverMedia assetData={assetData} imageId={image.fileId} />
            <PaperFold
              open={image.mediaType === MediaType.IMAGE_S}
              anchorHorizontal="right"
              anchorVertical="bottom"
              size={borderRadius + 2}
              style={{
                right: 6,
                bottom: 6,
              }}
            />
          </>
        }
      />
    </div>
  );
};

export default PreviewContainer;
