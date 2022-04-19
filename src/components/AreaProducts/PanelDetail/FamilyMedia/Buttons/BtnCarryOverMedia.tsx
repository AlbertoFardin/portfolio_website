import * as React from "react";
import classnames from "classnames";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { KEY_MEDIA } from "../../../../../constants";
import { IProduct } from "../../../../../interfaces";
import BtnCarryOver from "./BtnCarryOver";

const useStyles = makeStyles({
  media: {
    position: "absolute",
    left: 18,
    top: 18,
    "z-index": 3,
  },
  mediaMini: {
    top: 1,
    left: 3,
  },
  btnMini: {
    padding: "0 5px",
  },
  iconMini: {
    "font-size": "15px !important",
  },
});

interface IBtnCarryOverMedia {
  assetData: IProduct;
  imageId: string;
  mini?: boolean;
}

const BtnCarryOverMedia = ({
  assetData,
  imageId,
  mini = false,
}: IBtnCarryOverMedia) => {
  const classes = useStyles({});
  const media = (assetData[KEY_MEDIA] || []).find(
    ({ fileId }) => fileId === imageId
  );
  const carryover = media ? media.carryOverFatherId : "";
  return (
    <div
      className={classnames({
        [classes.media]: true,
        [classes.mediaMini]: mini,
      })}
    >
      <BtnCarryOver
        text={carryover}
        className={classnames({
          [classes.btnMini]: mini,
        })}
        classNameIcon={classnames({
          [classes.iconMini]: mini,
        })}
      />
    </div>
  );
};

export default BtnCarryOverMedia;
