import makeStyles from "@material-ui/core/styles/makeStyles";
import * as Colors from "../../style/Colors";

interface IStyles {
  width: number;
  readOnly: boolean;
  inputHide: boolean;
  hasMenu: boolean;
  hasIcon: boolean;
  hasAvatar: boolean;
}

const btnSize = 30;
const inputPaddingX = 10;
const inputWidth = ({ width, hasMenu, hasIcon, hasAvatar }: IStyles) =>
  width -
  inputPaddingX * 2 -
  (hasIcon ? btnSize : 0) -
  (hasAvatar ? btnSize : 0) -
  (hasMenu ? btnSize : 0);
const inputMargin = ({ hasIcon, hasAvatar }: IStyles) =>
  0 + (hasIcon ? btnSize : 0) + (hasAvatar ? btnSize : 0);
const inputDisplay = ({ inputHide }: IStyles) =>
  inputHide ? "none" : "inline-block";
const inputCursor = ({ readOnly }: IStyles) => (readOnly ? "default" : "text");

const useStyles = makeStyles(({ palette }) => ({
  field: {
    margin: "18px 0",
    "& > div": {
      "border-radius": 5,
      "min-height": 42,
      "background-color": ({ readOnly }: IStyles) =>
        readOnly ? "#F5F5F5" : "#FFFFFF",
    },
  },
  input: {
    color: "#333333",
    height: "inherit",
    flex: 1,
    padding: `5px ${inputPaddingX}px`,
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
    cursor: "default",
    "& > fieldset": {
      "border-color": "#dddddd !important",
      "border-width": "1px !important",
    },
    "& input": {
      width: inputWidth,
      display: inputDisplay,
      cursor: inputCursor,
      "margin-left": inputMargin,
      padding: 0,
      "min-height": 30,
      margin: "1px 0",
      "vertical-align": "middle",
    },
    "& textarea": {
      width: inputWidth,
      display: inputDisplay,
      cursor: inputCursor,
      "margin-left": inputMargin,
      "max-height": 120,
      margin: "7px 0",
      padding: "2px 0",
      overflow: "auto !important",
      "vertical-align": "top",
    },
  },
  containerChips: {
    display: "inline-block",
    "vertical-align": "middle",
    flex: 1,
    overflow: "auto",
    "padding-top": 3,
    "margin-left": inputMargin,
  },
  adornmentIcon: {
    left: 5,
    bottom: 5,
    position: "absolute",
    margin: 0,
  },
  adornmentAvatar: {
    left: ({ hasIcon }: IStyles) => 5 + (hasIcon ? btnSize : 0),
    bottom: 5,
    position: "absolute",
    margin: 0,
  },
  adornmentElement: {
    width: inputWidth,
    "margin-left": inputMargin,
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
  },
  menuIcon: {
    color: Colors.Gray1,
  },
  menuIconChecked: {
    color: palette.primary.main,
  },
}));

export default (p: IStyles) => useStyles(p);
