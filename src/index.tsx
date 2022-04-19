import * as React from 'react';
import version from '../version.json';
import { APP_COLORS, ROOT_DIV_ID } from './constants';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { jssPreset, StylesProvider } from '@material-ui/styles';
import { create } from 'jss';
import getTheme from './componentsBase/theme/getTheme';
import * as ReactDOM from 'react-dom';

const jss = create(jssPreset());

jss.setup({ insertionPoint: 'insertion-point-jss' });

console.log(version.version);

const App = () => {
  return <div>::: ALBERTO FARDIN PORTFOLIO :::2</div>;
};

const elToRender = document.getElementById(ROOT_DIV_ID);
ReactDOM.render(
  <StylesProvider jss={jss}>
    <MuiThemeProvider theme={getTheme(APP_COLORS)}>
      <App />
    </MuiThemeProvider>
  </StylesProvider>,
  elToRender,
);
