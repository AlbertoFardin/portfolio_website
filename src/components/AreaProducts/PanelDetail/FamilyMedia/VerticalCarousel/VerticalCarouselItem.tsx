import PaperFold from "../../../../../componentsBase/PaperFold";
import * as Colors from "../../../../../componentsBase/style/Colors";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import * as moment from "moment";
import * as React from "react";
import Preview, { PreviewType } from "../../../../../componentsBase/Preview";
import apiUrls from "../../../../../api/endpoints";
import {
  IProduct,
  MediaType,
  ViewStatus,
  IMedia,
  Service,
} from "../../../../../interfaces";
import { KEY_READY, DATE_FORMAT } from "../../../../../constants";
import getCatalogsByContentId from "../../../../../utils/getCatalogsByContentId";
import BtnCarryOverMedia from "../Buttons/BtnCarryOverMedia";
import getMediaTypeIcon from "../../../../../utils/getMediaTypeIcon";
import getViewDetail from "../../../getViewDetail";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";

const borderRadius = 5;
const previewSize = 40;

interface IStyles {
  colorAsset: string;
  selected: boolean;
  disabled: boolean;
}
const useStyles = makeStyles({
  carouselItem: {
    width: 80,
    position: "relative",
    display: "flex",
    "flex-direction": "column",
    flex: "none",
    "align-items": "center",
    margin: "10px auto",
    "box-sizing": "border-box",
    padding: "5px 0 10px",
    borderRadius,
    "background-color": "#fff",
    opacity: ({ disabled }: IStyles) => (disabled ? 0.35 : undefined),
    border: "1px solid transparent",
    "border-color": ({ selected, colorAsset }: IStyles) =>
      selected ? colorAsset : "transparent",
    cursor: "pointer",
  },
  preview: {
    position: "relative",
  },
  label: {
    "font-size": 10,
    "margin-top": 5,
  },
  badge: {
    position: "absolute",
    bottom: "-10px",
    "border-radius": 50,
    "background-color": "#fff",
    "font-size": "14px !important",
    padding: 3,
    margin: "auto",
    "border-bottom": "1px solid transparent",
    "border-color": ({ selected, colorAsset }: IStyles) =>
      selected ? colorAsset : "transparent",
  },
  badge1: {
    left: 5,
  },
  badge2: {
    left: 0,
    right: 0,
  },
  badge3: {
    right: 5,
  },
});

interface IVerticalCarouselItem {
  colorTheme: string;
  media: IMedia;
  mediaSelected: IMedia;
  assetData: IProduct;
  onClick: (a: IMedia) => void;
  disabled?: boolean;
  color?: string;
}

const VerticalCarouselItem = ({
  colorTheme,
  media,
  mediaSelected,
  assetData,
  onClick,
  disabled,
  color,
}: IVerticalCarouselItem) => {
  const { status } = getViewDetail(assetData, mediaSelected.view);
  const catalogsReady = assetData[KEY_READY] || [];
  const selected = media.fileId === mediaSelected.fileId;
  const annResolved = media.annotationsResolved;
  const review = status === ViewStatus.REVIEW;
  const readyCount = getCatalogsByContentId({
    catalogs: catalogsReady,
    contentId: media.fileId,
  }).length;
  const cbOnClick = React.useCallback(() => {
    if (!disabled) onClick(media);
  }, [media, disabled, onClick]);
  const isVideo = media.mediaType === MediaType.VIDEO;
  const getSrcUrl = () => {
    if (!media.filename) return undefined;
    return `${apiUrls.getRendition.url(
      media.fileId,
      Service.SEECOMMERCE,
      isVideo ? "LQ" : "xs"
    )}?t=${assetData.version}`;
  };
  let colorAsset = colorTheme;
  if (readyCount) colorAsset = review ? Colors.Orange : Colors.Cyan;
  if (color) colorAsset = color;
  const classes = useStyles({
    colorAsset,
    selected,
    disabled,
  });

  return (
    <div
      role="presentation"
      className={classes.carouselItem}
      onClick={cbOnClick}
    >
      <div className={classes.preview}>
        <Preview
          colorTheme={colorAsset}
          srcUrl={getSrcUrl()}
          srcType={isVideo ? PreviewType.VIDEO : PreviewType.IMAGE}
          placeholderIcon={getMediaTypeIcon(media.mediaType)}
          style={{ borderRadius, width: previewSize, height: previewSize }}
          onClick={cbOnClick}
        />
        <PaperFold
          open={media.mediaType === MediaType.IMAGE_S}
          anchorHorizontal="right"
          anchorVertical="bottom"
          size={borderRadius}
          style={{
            bottom: 0,
            right: 0,
          }}
        />
      </div>
      <BtnCarryOverMedia assetData={assetData} imageId={media.fileId} mini />
      <Typography
        variant="body1"
        className={classes.label}
        children={moment(media.uploaded || 0).format(DATE_FORMAT)}
      />
      {annResolved === undefined ? null : (
        <Icon
          className={classnames([classes.badge, classes.badge1])}
          style={{ color: annResolved ? "#ccc" : Colors.Purple }}
          children="messenger"
        />
      )}
      {!media.postProduce ? null : (
        <Icon
          className={classnames([classes.badge, classes.badge2])}
          style={{ color: Colors.Purple }}
          children="photo_filter"
        />
      )}
      {!readyCount ? null : (
        <Icon
          className={classnames([classes.badge, classes.badge3])}
          style={{ color: review ? Colors.Orange : Colors.Cyan }}
          children="public"
        />
      )}
    </div>
  );
};

export default VerticalCarouselItem;
