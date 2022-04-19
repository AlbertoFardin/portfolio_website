import { MediaType } from "../interfaces";

const getMediaTypeLabel = (type: MediaType): string => {
  switch (type) {
    case MediaType.VIDEO:
      return "VIDEO";
    case MediaType.IMAGE_S:
      return "SHOOTING";
    case MediaType.IMAGE_P:
      return "POST PRODUCTION";
    default:
      return "";
  }
};

export default getMediaTypeLabel;
