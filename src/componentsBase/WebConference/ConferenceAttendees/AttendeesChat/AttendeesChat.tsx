import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Placeholder from "../../../Placeholder";

const useStyles = makeStyles({
  attendeesChat: {
    position: "relative",
    "min-height": 100,
    height: "100%",
    width: "inherit",
  },
});

export interface IAttendeesChat {
  TBD?: string;
}

const AttendeesChat = ({}: IAttendeesChat) => {
  const classes = useStyles();
  return (
    <div className={classes.attendeesChat}>
      <Placeholder label="...chat in development..." />
    </div>
  );
};

export default AttendeesChat;
