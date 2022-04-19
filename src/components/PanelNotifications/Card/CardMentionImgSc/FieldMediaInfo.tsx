import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import { DATE_FORMAT } from "../../../../constants";
import * as moment from "moment";
import BtnBadge from "../../../../componentsBase/BtnBadge";
import apiUrls from "../../../../api/endpoints";
import * as Colors from "../../../../componentsBase/style/Colors";
import { Service } from "../../../../interfaces";

const useStyles = makeStyles({
  mediaInfo: {
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    margin: "5px 0",
  },
  media: {
    position: "relative",
    width: 24,
    height: 24,
    margin: "0 5px",
    "border-radius": 5,
    "background-size": "cover",
    "background-color": Colors.Gray4,
    border: `1px solid ${Colors.Gray4}`,
  },
});

interface IFieldMediaInfo {
  mediaFileId: string;
  mediaUploaded: number;
  mediaView: string;
  mediaViewRequired: boolean;
}

const FieldMediaInfo = ({
  mediaFileId,
  mediaUploaded,
  mediaView,
  mediaViewRequired,
}: IFieldMediaInfo) => {
  const classes = useStyles({});
  const mediaUrl = apiUrls.getRendition.url(
    mediaFileId,
    Service.SEECOMMERCE,
    "xs"
  );
  return (
    <div className={classes.mediaInfo}>
      <BtnBadge
        style={{ position: "relative" }}
        labelRequired={mediaViewRequired}
        label={mediaView}
      />
      <div
        className={classes.media}
        style={{ backgroundImage: `url(${mediaUrl})` }}
      />
      <Typography
        variant={"caption"}
        children={moment(Number(mediaUploaded)).format(DATE_FORMAT)}
      />
    </div>
  );
};

export default FieldMediaInfo;
