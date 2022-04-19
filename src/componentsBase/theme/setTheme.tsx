import { MuiThemeProvider } from "@material-ui/core/styles";
import { jssPreset, StylesProvider } from "@material-ui/styles";
import { create } from "jss";
import * as React from "react";

const jss = create(jssPreset());
// Custom material-ui-next class name generator for better debug and performance.
// jss.options.createGenerateClassName = createGenerateClassName
// We define a custom insertion point JSS will look for injecting the styles in the DOM.

jss.setup({ insertionPoint: "insertion-point-jss" });
// jss.options.insertionPoint = 'insertion-point-jss';

const setTheme = (cmp, theme) => (
  <StylesProvider jss={jss}>
    <MuiThemeProvider theme={theme} children={cmp} />
  </StylesProvider>
);

export default setTheme;
