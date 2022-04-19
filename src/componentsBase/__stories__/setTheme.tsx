import { MuiThemeProvider } from "@material-ui/core";
import jssPreset from "@material-ui/styles/jssPreset";
import StylesProvider from "@material-ui/styles/StylesProvider";
import { create } from "jss";
import * as React from "react";
import { getTheme } from "../theme";
import * as Colors from "../style/Colors";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jss: any = create(jssPreset());
// Custom material-ui class name generator for better debug and performance.
// jss.options.createGenerateClassName = createGenerateClassName
// We define a custom insertion point JSS will look for injecting the styles in the DOM.
jss.options.insertionPoint = "insertion-point-jss";

const setTheme = (cmp) => {
  const theme = getTheme({
    color: Colors.Blue,
    colorDark: "#0000ca",
    colorLight: "#7059ff",
  });
  return (
    <StylesProvider jss={jss}>
      <MuiThemeProvider theme={theme}>{cmp}</MuiThemeProvider>
    </StylesProvider>
  );
};

export default setTheme;
