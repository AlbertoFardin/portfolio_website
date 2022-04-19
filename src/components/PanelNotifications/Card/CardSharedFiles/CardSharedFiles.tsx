import * as React from "react";
import { INPayloadSharedFile } from "../../../../interfaces";
import ICard from "../ICard";
import CardTitle from "../CardTitle";
import CardAvatar from "../CardAvatar";
import useStyles from "../useStyles";
import BtnFile from "./BtnFile";

const CardSharedFiles = ({ notification }: ICard) => {
  const classes = useStyles({});
  const { from, creation, markedAsRead, payload } = notification;
  const { assetDatas } = payload as INPayloadSharedFile;
  return (
    <>
      <CardAvatar userId={from} />
      <div className={classes.cardContent}>
        <CardTitle
          title="shared with you"
          from={from}
          creation={creation}
          markedAsRead={markedAsRead}
        />
        {assetDatas.map((a) => (
          <BtnFile key={a.id} id={a.id} name={a.name} mimeType={a.mimeType} />
        ))}
      </div>
    </>
  );
};

export default CardSharedFiles;
