import { PreviewType } from "../../../componentsBase/Preview";
import apiUrls from "../../../api/endpoints";
import getMediaTypeIcon from "../../../utils/getMediaTypeIcon";
import { IItemStagingArea, MediaType, Service } from "../../../interfaces";
import { IThumbnail } from "../../../componentsBase/StickyGrid";

const getRendition = (mediaType: MediaType): string => {
  switch (mediaType) {
    case MediaType.VIDEO:
      return "LQ";
    default:
      return "s";
  }
};

const decorateCellThumbnails = ({
  view,
  mediaType,
  fileId,
}: IItemStagingArea): IThumbnail[] => {
  const badges = [];

  // add badge view name
  if (view) {
    const badgeView = {
      label: view,
      tooltip: view,
      style: {
        minWidth: 40,
        top: 6,
        left: 8,
      },
    };
    badges.push(badgeView);
  }

  return [
    {
      id: "thumb",
      badges,
      srcUrl: apiUrls.getRendition.url(
        fileId,
        Service.SEECOMMERCE,
        getRendition(mediaType)
      ),
      srcType:
        mediaType === MediaType.VIDEO ? PreviewType.VIDEO : PreviewType.IMAGE,
      placeholderIcon: getMediaTypeIcon(mediaType),
      placeholderIconStyle: { color: "#ddd" },
      paperFold: mediaType === MediaType.IMAGE_S,
    },
  ];
};

export default decorateCellThumbnails;
