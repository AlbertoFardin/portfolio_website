import { MediaType } from "../interfaces";

const getMediaTypeIcon = (type: MediaType): string => {
  switch (type) {
    case MediaType.VIDEO:
      return "movie";
    case MediaType.IMAGE_S:
      return "photo";
    case MediaType.IMAGE_P:
      return "photo_filter";
    default:
      return "";
  }
};

export default getMediaTypeIcon;
