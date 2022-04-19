import makeStyles from "@material-ui/core/styles/makeStyles";
import { colorTheme } from "../../../constants";

export default makeStyles({
  root: {
    width: "inherit",
    height: "inherit",
    "background-color": "#f1f1f1",
  },
  title: {
    color: colorTheme,
    "font-weight": "lighter",
    "font-size": 40,
    cursor: "default",
    margin: "0 auto 30px auto",
    "user-select": "none",
    "text-align": "center",
  },
  paper: {
    position: "absolute",
    "min-width": 400,
    "max-width": 400,
    height: "fit-content",
    padding: 30,
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
    "z-index": 2,
    margin: "auto",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  form: {
    flex: 1,
    position: "relative",
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
  },
  toolbar: {
    padding: "0 !important",
  },
  flex1: {
    flex: 1,
  },
});
