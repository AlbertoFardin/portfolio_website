import * as Colors from "../../componentsBase/style/Colors";
import { IBtn } from "../../componentsBase/Btn";
import mixColors from "../../componentsBase/utils/mixColors";
import {
  IProduct,
  ViewStatus,
  IMedia,
  ContentType,
  IReady,
  ICatalog,
  IViewDetail,
  IMenuViewReadys,
} from "../../interfaces";
import { KEY_PUBLICATIONS, KEY_READY, KEY_MEDIA } from "../../constants";
import { ACT_VPORT } from "./reducer";
import getMediaLastReady from "./getMediaLastReady";

interface IGetTooltipSingleCatalog {
  review: boolean;
  ready: boolean;
}
const getTooltipSingleCatalog = ({
  review,
  ready,
}: IGetTooltipSingleCatalog) => {
  if (ready) {
    return review ? "Media Ready / View in Review" : "Media Ready";
  }
  if (review) return "View in Review";
  return "";
};

interface IGetTooltipMultiCatalogs {
  review: boolean;
  cReady: number;
  cTotal: number;
}
const getTooltipMultiCatalogs = ({
  review,
  cReady,
  cTotal,
}: IGetTooltipMultiCatalogs): string => {
  const count = `${cReady}/${cTotal}`;
  const labelReadys = `${count} catalog${cTotal > 1 ? "s" : ""} set Ready`;
  const labelReview = review ? " / View in Review" : "";
  return labelReadys + labelReview;
};

interface IGetBadgeViewCatalogs {
  dispatch: React.Dispatch<unknown>;
  item: IProduct;
  tenantCatalogs: ICatalog[];
  viewDetail: IViewDetail;
  style?: React.CSSProperties;
}

const getBadgeViewCatalogs = ({
  dispatch,
  item,
  tenantCatalogs,
  viewDetail,
  style,
}: IGetBadgeViewCatalogs): IBtn => {
  const publications = (item[KEY_PUBLICATIONS] || []) as IReady[];
  const readys = (item[KEY_READY] || []) as IReady[];
  const medias = (item[KEY_MEDIA] || []) as IMedia[];

  const { viewName, status, catalog } = viewDetail;

  const mediaLastReady = getMediaLastReady(readys, medias, viewName);
  const mediaIdReady = mediaLastReady ? mediaLastReady.fileId : "";

  const viewCatalogs = (catalog || []).filter((c: string) => {
    // check if the catalog still exists among the catalogs' tenant
    return tenantCatalogs.find(({ id }) => id === c);
  });
  const viewCatalogsReady = readys.reduce((acc, cur: IReady) => {
    // check if the catalog still exists among the catalogs' tenant
    const exist = tenantCatalogs.find(({ id }) => id === cur.catalog);
    // check if catalog is for this view
    const isMedia = cur.contentType === ContentType.MEDIA;
    const catMedia = medias.find((m: IMedia) => m.fileId === cur.contentId);
    const isView = !!catMedia && catMedia.view === viewName;
    if (exist && isMedia && !!catMedia && isView) acc.push(cur);
    return acc;
  }, []);
  const noViewCatalogsReady = viewCatalogsReady.length === 0;
  const inReview = status === ViewStatus.REVIEW;
  const color = inReview
    ? Colors.Orange
    : noViewCatalogsReady
    ? Colors.Gray2
    : Colors.Cyan;
  const colorLight = mixColors(0.75, color, "#fff");
  const publicationConfirmed = publications.some((r: IReady) => {
    const { contentId, contentType } = r;
    return contentId === mediaIdReady && contentType === ContentType.MEDIA;
  });

  if (viewCatalogs.length === 0) return null;

  const onClick = (event) => {
    const data: IMenuViewReadys = {
      open: true,
      positionTop: event.clientY,
      positionLeft: event.clientX,
      contentsCatalogs: viewCatalogs,
      contentsPublication: publications,
      contentsReady: readys,
      mediaId: mediaIdReady,
    };
    dispatch({ type: ACT_VPORT.MENU_VIEW_READYS, data });
  };

  if (tenantCatalogs.length === 1) {
    if (!inReview && viewCatalogsReady.length === 0) return null;
    const isReady = viewCatalogsReady.length === 1;
    return {
      variant: "light",
      color,
      icon: isReady ? "public" : "feedback",
      tooltip: getTooltipSingleCatalog({
        review: inReview,
        ready: isReady,
      }),
      onClick,
      style: {
        ...style,
        backgroundColor: publicationConfirmed ? colorLight : "#fff",
      },
    };
  }

  return {
    variant: publicationConfirmed ? "bold" : "light",
    color,
    label: `${String(viewCatalogsReady.length)}/${viewCatalogs.length}`,
    tooltip: getTooltipMultiCatalogs({
      review: inReview,
      cReady: viewCatalogsReady.length,
      cTotal: viewCatalogs.length,
    }),
    onClick,
    style: {
      ...style,
      backgroundColor: noViewCatalogsReady
        ? "#fff"
        : publicationConfirmed
        ? undefined
        : colorLight,
    },
  };
};

export default getBadgeViewCatalogs;
