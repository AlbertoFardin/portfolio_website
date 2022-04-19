import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import { KEY_CARRYOVER_PARENT } from "../../../../constants";
import { IProduct } from "../../../../interfaces";
import BtnCarryOver from "../FamilyMedia/Buttons/BtnCarryOver";
import last from "lodash-es/last";

const useStyles = makeStyles({
  titleContainer: {
    position: "relative",
    marginTop: "-10px",
  },
  titleLabel: {
    position: "absolute",
    top: 15,
    color: "#9e9d9d",
    whiteSpace: "nowrap",
  },
  spacer: {
    width: 3,
  },
});

interface IHeaderSingle {
  assetDatas: IProduct[];
}

const HeaderSingle = ({ assetDatas }: IHeaderSingle) => {
  const classes = useStyles({});
  const assetData = last(assetDatas);
  const assetDataId = assetData.id;
  const assetCarryover = assetData[KEY_CARRYOVER_PARENT];
  const carryoverParentId =
    assetDataId && assetCarryover ? assetCarryover.entityId : "";

  return (
    <>
      <BtnCarryOver text={carryoverParentId} />
      <div className={classes.spacer} />
      <div className={classes.titleContainer}>
        <Typography variant="body2" children="Item Detail" />
        <Typography
          className={classes.titleLabel}
          variant="caption"
          children={assetDataId}
        />
      </div>
    </>
  );
};

export default HeaderSingle;
