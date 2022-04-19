import { IProduct, IReady, IMedia, IViewData } from "../../../../interfaces";
import {
  KEY_READY,
  SHOW_MEDIAREADY,
  KEY_VIEW_DATA,
} from "../../../../constants";
import getMediaLastReady from "../../getMediaLastReady";
import getMediaLastUploaded from "../../getMediaLastUploaded";
import getMediaPlaceholder from "../../getMediaPlaceholder";
import { getCookieBoolean } from "../../../../componentsBase/utils/cookie";
import { NO_VALUE } from "../../getSearchString";
import getViewMedias from "./getViewMedias";

interface IGetMediaSelected {
  imageId?: string;
  imageView?: string;
  assetData: IProduct;
}

const getMediaSelected = ({
  imageId,
  imageView,
  assetData,
}: IGetMediaSelected): IMedia => {
  const medias: IMedia[] = getViewMedias(assetData);
  const ready: IReady[] = assetData[KEY_READY] || [];
  const viewsData: IViewData[] = (assetData[KEY_VIEW_DATA] || []).sort(
    (a, b) => {
      if (a.viewName > b.viewName) return 1;
      if (a.viewName < b.viewName) return -1;
      return 0;
    }
  );

  const mediaFindById =
    imageId === NO_VALUE
      ? undefined
      : medias.find((m: IMedia) => m.fileId === imageId);

  if (mediaFindById) return mediaFindById;

  const view =
    imageView || (viewsData[0] && viewsData[0].viewName) || undefined;
  const mediaPlaceholder = getMediaPlaceholder(medias, view);
  const mediaLastUploaded = getMediaLastUploaded(medias, view);
  const mediaLastReady = getMediaLastReady(ready, medias, view);

  if (mediaLastReady && getCookieBoolean(SHOW_MEDIAREADY)) {
    return mediaLastReady;
  }

  return mediaLastUploaded || mediaPlaceholder;
};

export default getMediaSelected;
