import makeStyles from "@material-ui/core/styles/makeStyles";
import Btn from "../../../../../componentsBase/Btn";
import BtnBadge from "../../../../../componentsBase/BtnBadge";
import * as React from "react";
import { IProduct, IMedia, IViewDetail } from "../../../../../interfaces";
import getMediaSelected from "../getMediaSelected";
import getBadgeViewName from "../../../getBadgeViewName";

const useStyles = makeStyles({
  changeview: {
    position: "relative",
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    width: 120,
  },
  flex1: {
    flex: 1,
  },
});

interface IBtnChangeView {
  assetData: IProduct;
  histories: IMedia[][];
  historyIndex: number;
  viewDetail: IViewDetail;
  onChange: (v: string) => void;
}

const BtnChangeView = ({
  assetData,
  histories,
  historyIndex,
  viewDetail,
  onChange,
}: IBtnChangeView) => {
  const classes = useStyles({});
  const newMedias = histories
    .map((h) => {
      return !!h[0] ? h[0].view : undefined;
    })
    .map((v) => {
      return getMediaSelected({
        imageView: v,
        assetData,
      });
    });
  const onCbBtnLeft = React.useCallback(() => {
    const newImageId = newMedias[historyIndex - 1].fileId;
    onChange(newImageId);
  }, [historyIndex, newMedias, onChange]);
  const onCbBtnRight = React.useCallback(() => {
    const newImageId = newMedias[historyIndex + 1].fileId;
    onChange(newImageId);
  }, [historyIndex, newMedias, onChange]);
  const badgeViewName = getBadgeViewName({
    viewDetail,
    style: { position: "relative" },
  });

  return (
    <div className={classes.changeview}>
      {newMedias.length < 2 ? null : (
        <Btn
          icon="chevron_left"
          disabled={historyIndex === 0}
          style={{ margin: 0, left: 0 }}
          onClick={onCbBtnLeft}
          tooltip={historyIndex === 0 ? "" : "Previous view"}
        />
      )}
      <div className={classes.flex1} />
      <BtnBadge {...badgeViewName} />
      <div className={classes.flex1} />
      {newMedias.length < 2 ? null : (
        <Btn
          icon="chevron_right"
          disabled={historyIndex === newMedias.length - 1}
          style={{ margin: 0, right: 0 }}
          onClick={onCbBtnRight}
          tooltip={historyIndex === newMedias.length - 1 ? "" : "Next view"}
        />
      )}
    </div>
  );
};

export default BtnChangeView;
