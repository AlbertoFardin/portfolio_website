import makeStyles from "@material-ui/core/styles/makeStyles";
import * as Colors from "../../../../componentsBase/style/Colors";

const useStyles = makeStyles({
  toolbar: {
    padding: "0 0 0 15px",
  },
  icon: {
    padding: 0,
    margin: 0,
    width: 100,
    "margin-left": 2,
  },
  selector: {
    "border-radius": 5,
    margin: "10px 11px",
    "max-width": "inherit",
    flex: 1,
    border: `1px solid ${Colors.Gray2}`,
  },
  label: {
    "text-align": "left",
  },
  labelNoSelected: {
    "font-style": "italic",
    "font-weight": "normal",
  },
});

export default useStyles;
