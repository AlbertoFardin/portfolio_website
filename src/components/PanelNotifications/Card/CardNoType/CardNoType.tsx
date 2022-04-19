import * as React from "react";
import ICard from "../ICard";
import CardTitle from "../CardTitle";
import Typography from "@material-ui/core/Typography";
import CardAvatar from "../CardAvatar";
import useStyles from "../useStyles";
import * as Colors from "../../../../componentsBase/style/Colors";

const CardNoType = ({ notification }: ICard) => {
  const classes = useStyles({});
  const { type, creation, markedAsRead } = notification;
  return (
    <>
      <CardAvatar icon="warning" color={Colors.Orange} />
      <div className={classes.cardContent}>
        <CardTitle
          title={type}
          creation={creation}
          markedAsRead={markedAsRead}
        />
        <Typography variant="body1" children="Unknown type" />
        <Typography
          variant="body1"
          children="Please delete this notification"
        />
      </div>
    </>
  );
};

export default CardNoType;
