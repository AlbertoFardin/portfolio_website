import * as Colors from "../../../componentsBase/style/Colors";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
  card: {
    display: "flex",
    "flex-direction": "row",
    "align-items": "stretch",
    position: "relative",
    padding: 7,
    margin: "0 10px 12px",
    "border-radius": 5,
    border: `1px solid ${Colors.Gray3}`,
    "background-color": "#fff",
  },
  cardContent: {
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
    width: "-webkit-fill-available",
    flex: 1,
    overflow: "hidden",
  },
});

export default useStyles;
