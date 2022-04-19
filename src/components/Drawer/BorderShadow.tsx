import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

interface IDrawer {
  direction: "right" | "left";
}

const useStyles = makeStyles({
  bordershadow: {
    "z-index": 2,
    position: "absolute",
    top: 0,
    right: ({ direction }: IDrawer) => (direction === "right" ? 0 : undefined),
    left: ({ direction }: IDrawer) => (direction === "left" ? 0 : undefined),
    height: "-webkit-fill-available",
    width: 10,
    background: ({ direction }: IDrawer) =>
      `linear-gradient(to ${direction === "right" ? "left" : "right"},` +
      "rgba(0, 0, 0, 0.1) 0px, rgba(0, 0, 0, 0.1) 1px, rgba(0, 0, 0, 0.05) 1px, rgba(0, 0, 0, 0) 100%)",
  },
});

const BorderShadow = ({ direction }: IDrawer) => {
  const classes = useStyles({ direction });
  return <div className={classes.bordershadow} />;
};

export default BorderShadow;
