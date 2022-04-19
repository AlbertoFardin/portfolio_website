import * as Colors from "../style/Colors";
import getTheme from "./getTheme";
import setTheme from "./setTheme";

const setThemeDefault = (cmp) => {
  const theme = getTheme({
    color: Colors.Blue,
    colorDark: Colors.Blue,
    colorLight: Colors.Blue,
  });
  return setTheme(cmp, theme);
};

export default setThemeDefault;
