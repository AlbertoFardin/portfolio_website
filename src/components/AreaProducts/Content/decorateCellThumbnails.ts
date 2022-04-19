import { IBtn } from "../../../componentsBase/Btn";
import { PreviewType } from "../../../componentsBase/Preview";
import {
  IUserProfile,
  IProduct,
  IViewData,
  MediaType,
  IMedia,
  IReady,
  ICatalog,
  SheetLayout,
  AttributeFamily,
  IM2m,
  Service,
} from "../../../interfaces";
import {
  colorTheme,
  KEY_READY,
  KEY_VIEW_DATA,
  categoryDefault,
} from "../../../constants";
import apiUrls from "../../../api/endpoints";
import getMedias from "../PanelDetail/FamilyMedia/getViewMedias";
import sortByKey from "../../../utils/sortByKey";
import getMediaTypeIcon from "../../../utils/getMediaTypeIcon";
import getMediaLastUploaded from "../getMediaLastUploaded";
import getMediaLastReady from "../getMediaLastReady";
import getViewDetail from "../getViewDetail";
import { IThumbnail } from "../../../componentsBase/StickyGrid";
import getBadgeViewName from "../getBadgeViewName";
import getBadgeViewCatalogs from "../getBadgeViewCatalogs";
import getBadgeViewAssignee from "../getBadgeViewAssignee";
import getBadgeMediaAnnotations from "../getBadgeMediaAnnotations";
import concat from "lodash-es/concat";

interface IDecorateCellThumbnails {
  dispatch: React.Dispatch<unknown>;
  item: IProduct;
  attributeKey: string;
  gridShowMediaReady?: boolean;
  users: IUserProfile[];
  m2ms: IM2m[];
  tenantCatalogs: ICatalog[];
  assetDataId?: string;
  detailTabId?: string;
  detailImgId?: string;
  detailSheet?: SheetLayout;
}

const decorateCellThumbnails = ({
  dispatch,
  item,
  attributeKey,
  gridShowMediaReady = false,
  users,
  m2ms,
  tenantCatalogs,
  assetDataId = "",
  detailTabId = "",
  detailImgId = "",
  detailSheet = SheetLayout.CLOSED,
}: IDecorateCellThumbnails): IThumbnail[] => {
  const { id } = item;
  const readys = (item[KEY_READY] || []) as IReady[];
  const medias = (item[attributeKey] || []) as IMedia[];
  const viewsData = (item[KEY_VIEW_DATA] || []) as IViewData[];
  const eastpanelMedia = getMedias(item).find(
    ({ fileId }: IMedia) => fileId === detailImgId
  );
  const eastpanelMediaView = !eastpanelMedia
    ? detailImgId
    : eastpanelMedia.view;

  return sortByKey(viewsData, "viewName").map((v: IViewData, index) => {
    const viewDetail = getViewDetail(item, v.viewName);
    const { viewName, mediaType, category } = viewDetail;
    let useViewMediaReady = false;
    const mediaLastReady = getMediaLastReady(readys, medias, viewName);
    const mediaLastUploaded = getMediaLastUploaded(medias, viewName);
    let media = mediaLastUploaded;

    if (gridShowMediaReady && !!mediaLastReady) {
      media = mediaLastReady;
    }

    if (mediaLastReady && media.fileId === mediaLastReady.fileId) {
      useViewMediaReady = true;
    }

    const mediaId = media ? media.fileId : viewName;
    const isMediaType = (x: MediaType): boolean =>
      media ? media.mediaType === x : mediaType === x;

    const getSrcUrl = (): string => {
      if (!media) return "";
      const rendition = isMediaType(MediaType.VIDEO) ? "LQ" : "s";
      return `${apiUrls.getRendition.url(
        mediaId,
        Service.SEECOMMERCE,
        rendition
      )}?t=${item.version}`;
    };

    const badges: IBtn[] = concat(
      getBadgeViewName({ viewDetail, style: { top: 6, left: 8 } }),
      getBadgeViewCatalogs({
        dispatch,
        item,
        tenantCatalogs,
        viewDetail,
        style: {
          top: 6,
          right: 8,
        },
      }),
      getBadgeMediaAnnotations({
        media,
        style: {
          bottom: 6,
          left: 52,
        },
      }),
      getBadgeViewAssignee({
        dispatch,
        item,
        viewDetail,
        users,
        m2ms,
      }).map((b, i) => ({
        ...b,
        style: {
          bottom: 6 + i * 19,
          left: 8,
        },
      }))
    ).filter((a) => !!a);

    const eastpanelOpen = detailSheet === SheetLayout.OPENED;

    // this thumbnail is selected
    const selected =
      // ...if EastPanelMedia is open and is focus on that view
      (assetDataId === id &&
        eastpanelOpen &&
        detailTabId === AttributeFamily.MEDIA &&
        eastpanelMediaView === viewName) ||
      // ...if EastPanelMedia is open and have't mediaId to focus, so focus the first media
      (assetDataId === id &&
        eastpanelOpen &&
        detailTabId === AttributeFamily.MEDIA &&
        !detailImgId &&
        !index);

    const style = { borderColor: selected ? colorTheme : "transparent" };

    const stylePreview =
      gridShowMediaReady && !useViewMediaReady && media
        ? { opacity: 0.5 }
        : undefined;

    return {
      id: mediaId,
      srcUrl: getSrcUrl(),
      srcType: isMediaType(MediaType.VIDEO)
        ? PreviewType.VIDEO
        : PreviewType.IMAGE,
      placeholderIcon: getMediaTypeIcon(v.mediaType),
      paperFold: isMediaType(MediaType.IMAGE_S),
      badges,
      style,
      stylePreview,
      label: category === categoryDefault ? "" : category,
    };
  });
};

export default decorateCellThumbnails;
