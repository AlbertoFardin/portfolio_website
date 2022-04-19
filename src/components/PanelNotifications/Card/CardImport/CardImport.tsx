import * as React from "react";
import * as Colors from "../../../../componentsBase/style/Colors";
import { INPayloadImport } from "../../../../interfaces";
import ICard from "../ICard";
import CardTitle from "../CardTitle";
import CardAvatar from "../CardAvatar";
import useStyles from "../useStyles";
import Typography from "@material-ui/core/Typography";

const CardImport = ({ notification }: ICard) => {
  const classes = useStyles({});
  const { creation, markedAsRead, payload } = notification;
  const { error, successes, failures } = payload as INPayloadImport;
  return (
    <>
      <CardAvatar
        icon={error ? "warning" : "check"}
        color={error ? Colors.Orange : Colors.Green}
      />
      <div className={classes.cardContent}>
        <CardTitle
          title={error ? "Unable to import data" : "Import data completed"}
          creation={creation}
          markedAsRead={markedAsRead}
        />
        {error ? (
          <Typography
            variant="body1"
            children="An error occurred, we were not able to import data"
          />
        ) : (
          <Typography
            variant="body1"
            children={`${
              failures ? `${successes}/${successes + failures}` : successes
            } product${
              successes > 1 ? "s" : ""
            } have been updated successfully`}
          />
        )}
      </div>
    </>
  );
};

export default CardImport;
