import * as React from "react";
import ICard from "../ICard";
import CardTitle from "../CardTitle";
import Typography from "@material-ui/core/Typography";
import CardAvatar from "../CardAvatar";
import useStyles from "../useStyles";

const CardMentionImgDa = ({ notification }: ICard) => {
  const classes = useStyles({});
  const { from, creation, markedAsRead } = notification;
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
        <Typography variant="body1" children="todo" />
      </div>
    </>
  );
};

export default CardMentionImgDa;
