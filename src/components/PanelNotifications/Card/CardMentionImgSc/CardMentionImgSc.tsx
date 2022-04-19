import * as React from "react";
import { INPayloadMentionImgSc } from "../../../../interfaces";
import ICard from "../ICard";
import FieldAnnotation from "./FieldAnnotation";
import FieldMediaInfo from "./FieldMediaInfo";
import CardTitle from "../CardTitle";
import BtnCopy from "../BtnCopy";
import CardAvatar from "../CardAvatar";
import useStyles from "../useStyles";

const CardMentionImgSc = ({ notification }: ICard) => {
  const classes = useStyles({});
  const { from, creation, markedAsRead, payload } = notification;
  const {
    entityId,
    annotation,
    mediaFileId,
    mediaUploaded,
    mediaView,
    mediaViewRequired,
  } = payload as INPayloadMentionImgSc;
  return (
    <>
      <CardAvatar userId={from} />
      <div className={classes.cardContent}>
        <CardTitle
          title="mentioned you on a media"
          from={from}
          creation={creation}
          markedAsRead={markedAsRead}
        />
        <BtnCopy
          label="Copy Product Key"
          tooltip={entityId}
          copyToClipboard={entityId}
        />
        <FieldMediaInfo
          mediaFileId={mediaFileId}
          mediaUploaded={mediaUploaded}
          mediaView={mediaView}
          mediaViewRequired={mediaViewRequired}
        />
        <FieldAnnotation value={annotation} />
      </div>
    </>
  );
};

export default CardMentionImgSc;
