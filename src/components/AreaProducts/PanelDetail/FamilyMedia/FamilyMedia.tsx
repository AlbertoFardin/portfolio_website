import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import isEmpty from "lodash-es/isEmpty";
import isEqual from "lodash-es/isEqual";
import {
  IReady,
  IMedia,
  IProduct,
  SheetLayout,
  IMediaInfo,
} from "../../../../interfaces";
import { KEY_ENTITY_ID, KEY_READY } from "../../../../constants";
import getMediaSelected from "./getMediaSelected";
import getMediasGroupped from "./getMediasGroupped";
import LayoutDefault from "./LayoutDefault";
import LayoutFullscreen from "./LayoutFullscreen";
import ILayout from "./ILayout";
import { useHistory, useLocation } from "react-router-dom";
import getSearchString from "../../getSearchString";
import { PointSelector } from "../../../../componentsBase/ImageAnnotation";
import PlaceholderText from "./PlaceholderText";

const useStyles = makeStyles({
  sheet: {
    display: "flex",
    position: "relative",
    "flex-direction": "column",
    flex: 1,
  },
});

interface IFamilyMedia {
  fullscreen: boolean;
  assetData: IProduct;
  detailImgId: string;
  mediaData: IMediaInfo;
  annotationsSelector: PointSelector;
  annotationsEnabled: boolean;
}

const FamilyMedia = ({
  fullscreen,
  assetData,
  mediaData,
  detailImgId,
  annotationsSelector,
  annotationsEnabled,
}: IFamilyMedia) => {
  const classes = useStyles({});
  const history = useHistory();
  const queryString = useLocation().search;

  const assetId = assetData[KEY_ENTITY_ID];
  const setImageId = React.useCallback(
    (payload: string) => {
      history.push(
        getSearchString(
          {
            entityId: assetId,
            detailImgId: payload,
          },
          queryString
        )
      );
    },
    [assetId, history, queryString]
  );
  const setFullscreen = React.useCallback(
    (value: boolean) => {
      history.push(
        getSearchString(
          {
            entityId: assetId,
            detailSheet: value ? SheetLayout.FULLSCREEN : SheetLayout.OPENED,
          },
          queryString
        )
      );
    },
    [assetId, history, queryString]
  );
  const histories = getMediasGroupped(assetData);
  const mediaSelected = getMediaSelected({
    imageId: detailImgId,
    assetData,
  });
  const historySelected =
    histories.find(
      (h) => !!h.find(({ fileId }) => fileId === mediaSelected.fileId)
    ) ||
    histories[0] ||
    [];
  const historyIndex = histories.findIndex((h) => isEqual(h, historySelected));

  const ready: IReady[] = assetData[KEY_READY] || [];
  const mediaReady = historySelected.find((m: IMedia) => {
    const existAssociateReady = !!ready.find(
      (r: IReady) => r.contentId === m.fileId
    );
    const isThisView = m.view === mediaSelected.view;
    return existAssociateReady && isThisView;
  });
  const mediaIdReady = mediaReady ? mediaReady.fileId : "";
  const childProps: ILayout = {
    annotationsSelector,
    annotationsEnabled,
    assetData,
    imageId: detailImgId,
    histories,
    historySelected,
    historyIndex,
    mediaData,
    mediaSelected,
    mediaIdReady,
    setFullscreen,
    setImageId,
    fullscreen,
  };

  if (isEmpty(histories) || !mediaSelected) {
    return <PlaceholderText />;
  }

  return (
    <div className={classes.sheet}>
      {fullscreen ? (
        <LayoutFullscreen {...childProps} />
      ) : (
        <LayoutDefault {...childProps} />
      )}
    </div>
  );
};

export default FamilyMedia;
