import makeStyles from "@material-ui/core/styles/makeStyles";
import { PANEL_DETAIL_WIDTH } from "../../../constants";

const useStyles = makeStyles({
  family: {
    position: "relative",
    display: "flex",
    "flex-direction": "column",
    width: PANEL_DETAIL_WIDTH,
  },
  list: {
    display: "flex",
    "flex-direction": "column",
    overflow: "hidden overlay",
    flex: 1,
  },
});

export default useStyles;
