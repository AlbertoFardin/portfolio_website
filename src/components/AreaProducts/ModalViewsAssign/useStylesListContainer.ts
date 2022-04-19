import makeStyles from "@material-ui/core/styles/makeStyles";
import { colorTheme } from "../../../constants";

const useStyles = makeStyles({
  listContainer: {
    flex: 1,
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
    width: 250,
    height: 350,
    position: "relative",
  },
  listContainerScroll: {
    "overflow-y": "auto",
    flex: 1,
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
  },
  listGroupItem: {
    "& *": {
      "font-weight": "bold",
      "font-size": 11,
    },
  },
  listItemNested: {
    "margin-left": 15,
  },
  listTitle: {
    display: "flex",
    "align-items": "center",
    "flex-direction": "row",
    margin: "10px 0",
  },
  listTitleLabel: {
    "font-size": 16,
  },
  listTitleCount: {
    color: colorTheme,
    "font-size": 14,
  },
});

export default useStyles;
