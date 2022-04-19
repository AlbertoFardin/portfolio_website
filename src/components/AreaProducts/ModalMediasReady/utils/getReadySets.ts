import isEmpty from "lodash-es/isEmpty";
import { KEY_MEDIA, KEY_VIEW_DATA, KEY_READY } from "../../../../constants";
import {
  IMedia,
  IViewData,
  MediaType,
  ContentType,
  IReadySet,
  IReadySetElement,
  ViewStatus,
  IReady,
  ViewCheck,
  IProduct,
} from "../../../../interfaces";
import getMediaLastUploaded from "../../getMediaLastUploaded";
import getMediaLastReady from "../../getMediaLastReady";
import IMultiReadyCatalog from "../IMultiReadyCatalog";
import IMultiReadyView from "../IMultiReadyView";
import getViewDetail from "../../getViewDetail";

const getCatalogIdsToReady = (
  catalog: string[],
  catalogIdsSelected: string[]
): string[] => {
  return (catalog || []).reduce((acc, catId) => {
    const isSelected = catalogIdsSelected.find((id: string) => id === catId);
    if (isSelected) acc.push(catId);
    return acc;
  }, []) as string[];
};

const isViewSelected = (
  viewData: IViewData,
  views: IMultiReadyView[],
  catalogIds: string[]
): boolean => {
  const catalogIdsSet = new Set(catalogIds);
  return !!views.find((v: IMultiReadyView) => {
    return (
      v.selected && v.view === viewData.viewName && catalogIdsSet.has(v.catalog)
    );
  });
};

interface IGetRedySets {
  items: IProduct[];
  catalogs: IMultiReadyCatalog[];
  views: IMultiReadyView[];
  skipItemsReady?: boolean;
  skipItemsReview?: boolean;
  onlyItemsChecked?: boolean;
}

interface ResRedySets {
  readySets: IReadySet[];
  countItemsTotal: number;
  countItemsToApply: number;
  countItemsInReview: number;
  countItemsInReady: number;
  countItemsInChecked: number;
}

/**
 * This function return the count of elements and an array of "readySet" to send to BE
 *
 * readySet is a object composed from:
 * * product's id
 * * product's version
 * * array of elements composed from:
 * * * element's id (media's fileId)
 * * * element's idType (ContentType.media)
 * * * element's array of catalog ids to apply Ready Status
 *
 * to obtain the array of readySet, we must cycle to items and, for every viewstatus,
 * check if this view is selected and get the viewstatus' catalogs and the media avaiable to apply Ready Status.
 *
 * The media, in this case, is our "element"
 * The media to apply Ready Status must be:
 * * last media uploaded in that viewstatus
 * * mediaType POST_PRODUCED or VIDEO
 */
const getReadySets = ({
  items,
  catalogs,
  views,
  skipItemsReady = false,
  skipItemsReview = false,
  onlyItemsChecked = false,
}: IGetRedySets): ResRedySets => {
  let countItemsToApply = 0;
  let countItemsTotal = 0;
  let countItemsInReview = 0;
  let countItemsInReady = 0;
  let countItemsInChecked = 0;

  // get all catalog ids selected whit checkboxes
  const catalogIdsSelected = catalogs.reduce((acc, cat: IMultiReadyCatalog) => {
    if (cat.selected) acc.push(cat.id);
    return acc;
  }, []);

  const readySets = items.reduce((acc, item: IProduct) => {
    const itemReady = (item[KEY_READY] || []) as IReady[];
    const itemMedia = (item[KEY_MEDIA] || []) as IMedia[];
    const itemViewsData = (item[KEY_VIEW_DATA] || []) as IViewData[];

    // find elementsReady for every viewstatus
    const elementsReady = itemViewsData.reduce((acc, v: IViewData) => {
      const mediaTypeAcceptable = new Set([MediaType.IMAGE_P, MediaType.VIDEO]);
      const lastMedia = getMediaLastUploaded(itemMedia, v.viewName);
      const { viewName, catalog, status, check } = getViewDetail(
        item,
        v.viewName
      );
      const catalogIdsToReady = getCatalogIdsToReady(
        catalog,
        catalogIdsSelected
      );
      const viewIsSelected = isViewSelected(v, views, catalogIdsSelected);
      if (
        // check if the view is selected
        viewIsSelected &&
        // check if exist a media uploaded
        lastMedia &&
        // check if the last media uploaded has the required mediaType
        mediaTypeAcceptable.has(lastMedia.mediaType) &&
        // check if viewstatus has catalogs to apply Ready Status
        !isEmpty(catalogIdsToReady)
      ) {
        const viewHasReady = !!getMediaLastReady(
          itemReady,
          itemMedia,
          viewName
        );
        const viewInReview = status === ViewStatus.REVIEW;
        const viewInChecked = check === ViewCheck.CHECK;

        countItemsTotal += 1;
        if (viewInChecked) countItemsInChecked += 1;
        if (viewInReview) countItemsInReview += 1;
        if (viewHasReady) countItemsInReady += 1;

        if (onlyItemsChecked && !viewInChecked) return acc;
        if (skipItemsReview && viewInReview) return acc;
        if (skipItemsReady && viewHasReady) return acc;

        countItemsToApply += 1;
        acc.push({
          id: lastMedia.fileId,
          idType: ContentType.MEDIA,
          catalogs: catalogIdsToReady,
        });
      }

      return acc;
    }, [] as IReadySetElement[]);

    // return this readySet only if there is at least one element to set Ready Status
    if (!isEmpty(elementsReady)) {
      acc.push({
        entityId: item.id,
        version: item.version,
        elementsReady,
      });
    }

    return acc;
  }, [] as IReadySet[]);

  return {
    readySets,
    countItemsTotal,
    countItemsToApply,
    countItemsInReview,
    countItemsInReady,
    countItemsInChecked,
  };
};

export default getReadySets;
