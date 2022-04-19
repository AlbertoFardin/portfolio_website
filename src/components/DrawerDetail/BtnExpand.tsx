import * as React from "react";
import * as Colors from "../../componentsBase/style/Colors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import BtnBadge from "../../componentsBase/BtnBadge";
import { colorTheme } from "../../constants";
import { SheetLayout } from "../../interfaces";

const useStyles = makeStyles(({ zIndex }) => ({
  container: {
    position: "relative",
    width: 0,
    overflow: "visible",
  },
  btnExpand: {
    opacity: 0,
    position: "absolute",
    top: 0,
    height: "100%",
    width: 20,
    cursor: "ew-resize",
    transition: "all 250ms",
    display: "flex",
    "align-items": "center",
    "flex-direction": "column",
    "z-index": zIndex.drawer + 1,
    left: -10,
    "&:hover": {
      opacity: 1,
    },
  },
  expandLine: {
    height: "100%",
    width: 0,
    "border-style": "solid",
    "border-width": "0 1px 0 0",
  },
  expandIcon: {
    "border-width": 1,
    width: 18,
    height: 18,
    top: 40,
    margin: 0,
    left: -1,
    "border-color": colorTheme,
    "& *": { color: colorTheme },
    "&:hover": {
      "background-color": colorTheme,
      "& *": { color: "#fff" },
    },
  },
  borderShadow: {
    "z-index": 2,
    position: "absolute",
    top: 0,
    right: 0,
    height: "-webkit-fill-available",
    width: 10,
    transition: "right 200ms",
    background:
      "linear-gradient(to left," +
      "rgba(0, 0, 0, 0.1) 0px, rgba(0, 0, 0, 0.1) 1px, rgba(0, 0, 0, 0.05) 1px, rgba(0, 0, 0, 0) 100%)",
  },
}));

interface IBtnExpand {
  layout: SheetLayout;
  onChange: (l: SheetLayout) => void;
}

const BtnExpand = ({ layout, onChange }: IBtnExpand) => {
  const classes = useStyles({});

  const open = layout === SheetLayout.OPENED;
  const onClick = React.useCallback(() => {
    onChange(open ? SheetLayout.CLOSED : SheetLayout.OPENED);
  }, [open, onChange]);

  if (layout === SheetLayout.FULLSCREEN) return null;

  return (
    <div className={classes.container}>
      <div className={classes.borderShadow} />
      <div role="presentation" className={classes.btnExpand} onClick={onClick}>
        <div
          className={classes.expandLine}
          style={{ borderColor: colorTheme }}
        />
        <BtnBadge
          color={Colors.Gray2}
          className={classes.expandIcon}
          icon={`chevron_${open ? "right" : "left"}`}
          onClick={onClick}
        />
      </div>
    </div>
  );
};

export default BtnExpand;
