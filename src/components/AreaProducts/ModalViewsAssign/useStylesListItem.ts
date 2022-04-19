import makeStyles from "@material-ui/core/styles/makeStyles";
import { colorTheme } from "../../../constants";
import * as Colors from "../../../componentsBase/style/Colors";

interface IStyles {
  disabled: boolean;
  selected: boolean;
}
const useStyles = makeStyles({
  listItem: {
    display: "flex",
    "flex-direction": "row",
    "justify-content": "start",
    "align-items": "center",
    padding: "0 8px",
    "border-radius": 5,
    outline: "none",
    "min-height": 30,
    color: colorTheme,
    cursor: ({ disabled }: IStyles) => (disabled ? "default" : "pointer"),
    width: "-webkit-fill-available",
    "margin-top": 3,
    "margin-bottom": 3,
  },
  icon: {
    "font-size": "16px !important",
    "margin-right": 5,
    color: ({ selected }: IStyles) => (selected ? colorTheme : Colors.Gray2),
    opacity: ({ disabled }: IStyles) => (disabled ? 0.3 : 1),
  },
  label: {
    opacity: ({ disabled }: IStyles) => (disabled ? 0.3 : 1),
  },
  labelSub: {
    color: "#bbb",
    "font-size": 10,
    "margin-left": 5,
  },
  flex1: {
    flex: 1,
  },
});

export default useStyles;
