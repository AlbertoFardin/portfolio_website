import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import BtnBadge from "../../componentsBase/BtnBadge";
import { colorTheme } from "../../constants";
import * as Colors from "../../componentsBase/style/Colors";

interface IStyles {
  direction: "right" | "left";
}
const useStyles = makeStyles({
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
    "z-index": 5,
    left: ({ direction }: IStyles) => (direction === "left" ? -10 : undefined),
    right: ({ direction }: IStyles) =>
      direction === "right" ? -10 : undefined,
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
    left: ({ direction }: IStyles) => (direction === "left" ? -3 : undefined),
    right: ({ direction }: IStyles) => (direction === "right" ? -3 : undefined),
    "border-color": colorTheme,
    "& *": { color: colorTheme },
    "&:hover": {
      "background-color": colorTheme,
      "& *": { color: "#fff" },
    },
  },
});

interface IBtnExpand {
  direction: "right" | "left";
  collapsed: boolean;
  onClick: () => void;
}

const BtnExpand = ({ direction, collapsed, onClick }: IBtnExpand) => {
  const classes = useStyles({ direction });

  return (
    <div role="presentation" className={classes.btnExpand} onClick={onClick}>
      <div className={classes.expandLine} style={{ borderColor: colorTheme }} />
      <BtnBadge
        color={Colors.Gray2}
        className={classes.expandIcon}
        icon={
          direction === "left"
            ? `chevron_${!collapsed ? "right" : "left"}`
            : `chevron_${!collapsed ? "left" : "right"}`
        }
        onClick={onClick}
      />
    </div>
  );
};

export default BtnExpand;
