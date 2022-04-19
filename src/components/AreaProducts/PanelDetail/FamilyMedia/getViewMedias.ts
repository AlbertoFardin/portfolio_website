import { IProduct, IMedia, IViewData } from "../../../../interfaces";
import { KEY_MEDIA, KEY_VIEW_DATA } from "../../../../constants";

/**
 * add a MediaPlaceholder for every viewsStatus
 */
const getViewMedias = (assetData: IProduct): IMedia[] => {
  const media = (assetData[KEY_MEDIA] || []) as IMedia[];
  const viewsData = (assetData[KEY_VIEW_DATA] || []) as IViewData[];
  const mediasPlaceholder = viewsData.map(
    (cur: IViewData) => ({
      fileId: cur.viewName,
      view: cur.viewName,
    }),
    []
  ) as IMedia[];
  const mediasWithView = media.filter((cur) =>
    viewsData.find((s) => s.viewName === cur.view)
  );
  return [].concat(mediasWithView, mediasPlaceholder);
};

export default getViewMedias;
