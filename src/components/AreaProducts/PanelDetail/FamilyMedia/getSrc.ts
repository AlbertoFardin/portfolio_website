import PreviewType from "../../../../componentsBase/Preview/PreviewType";
import apiUrls from "../../../../api/endpoints";
import { IProduct, MediaType, IMedia, Service } from "../../../../interfaces";

export const getSrcUrl = (media: IMedia, { version }: IProduct): string => {
  if (!media) return undefined;

  const { filename, fileId, mediaType } = media;

  if (!filename) return undefined;

  const rendition = mediaType === MediaType.VIDEO ? "LQ" : "l";
  return `${apiUrls.getRendition.url(
    fileId,
    Service.SEECOMMERCE,
    rendition
  )}?t=${version}`;
};

export const getSrcType = (media: IMedia): PreviewType => {
  if (!media) return undefined;

  const { filename, mediaType } = media;

  if (!filename) return undefined;

  return mediaType === MediaType.VIDEO ? PreviewType.VIDEO : PreviewType.IMAGE;
};
