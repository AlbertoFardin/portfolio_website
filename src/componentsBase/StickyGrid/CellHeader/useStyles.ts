import makeStyles from "@material-ui/core/styles/makeStyles";
import hexToRgbA from "../../utils/hexToRgbA";
import { columnsPadding } from "../statics";
import * as Colors from "../../style/Colors";

interface IStyles {
  height: number | string;
  width: number | string;
  hoverMouse: boolean;
  isDefaultSorting: boolean;
  backgroundColor?: string;
  dragging: boolean;
}

const badgeSize = 16;

const useStyles = makeStyles(({ palette }) => {
  const colorMain = palette.primary.main;
  return {
    cell: {
      position: "absolute",
      "justify-content": "center",
      display: "inline-flex",
      "flex-direction": "column",
      "align-items": "stretch",
      "vertical-align": "middle",
      overflow: "hidden",
      "background-color": ({
        hoverMouse,
        backgroundColor,
        dragging,
      }: IStyles) => {
        if (dragging) return colorMain;
        if (hoverMouse) return "#f5f5f5";
        return backgroundColor;
      },
      height: ({ height }: IStyles) => height,
      width: ({ width }: IStyles) => width,
      "z-index": 2,
    },
    cellDragging: {
      "box-shadow":
        "0 8px 16px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.1)",
      "user-select": "none",
      outline: "none",
    },
    cellResizable: {
      resize: "horizontal",
    },
    label: {
      padding: `0 ${columnsPadding}px`,
      flex: 1,
      "font-style": ({ isDefaultSorting }: IStyles) =>
        isDefaultSorting ? "italic" : "normal",
      "font-weight": ({ isDefaultSorting }: IStyles) =>
        isDefaultSorting ? "bold" : "normal",
      color: ({ dragging }: IStyles) => (dragging ? "#fff" : Colors.Gray1),
    },
    iconSortHidden: {
      height: 15,
    },
    iconSort: {
      height: 15,
      "line-height": "16px !important",
      margin: "0px 2px 0 7px",
      color: "#e5e5e5",
      cursor: "pointer",
      "border-radius": "15%",
      "&:hover": {
        "background-color": hexToRgbA(colorMain, 0.15),
      },
    },
    colorTheme: {
      color: colorMain,
    },
    iconSortHide: {
      opacity: 0,
    },
    badge: {
      top: 2,
      right: 2,
      "min-height": `${badgeSize}px !important`,
      "min-width": `${badgeSize}px !important`,
      "border-width": 1,
    },
    badgeLabel: {
      "font-size": 10,
    },
    shadowHeader: {
      "box-shadow": "rgba(0, 0, 0, 0.1) 5px 2px 5px 0px",
    },
    dropIndicator: {
      position: "absolute",
      top: 0,
      left: 0,
      width: 2,
      height: ({ height }: IStyles) => height,
      backgroundColor: "#f00",
    },
  };
});

export default useStyles;
