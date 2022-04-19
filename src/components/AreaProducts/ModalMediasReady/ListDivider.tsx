import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";

const useStyles = makeStyles(() => ({
  listDivider: {
    width: 2,
    background: "#f1f1f1",
    margin: "0 10px",
  },
}));

const ListDivider = () => {
  const classes = useStyles({});
  return <div className={classes.listDivider} />;
};

export default ListDivider;
