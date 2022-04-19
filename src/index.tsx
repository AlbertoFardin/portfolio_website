import * as React from "react";
import version from "../version.json";
import {
  APP_COLORS,
  APP_NAME,
  CHOOSE_PASSWORD_ID,
  FORGOT_PASSWORD_ID,
  REFRESH_TOKEN,
  RESET_PASSWORD_ID,
  ROOT_DIV_ID,
  SHARE_ID,
} from "./constants";
import Background from "./components/Background";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { jssPreset, StylesProvider } from "@material-ui/styles";
import { create } from "jss";
import LoadingMask from "./componentsBase/LoadingMask";
import {
  BrowserRouter,
  Route,
  useHistory,
  useLocation,
} from "react-router-dom";
import getTheme from "./componentsBase/theme/getTheme";
import * as ReactDOM from "react-dom";
import { client } from "./api/graphqlAPI";
import { ApolloProvider } from "@apollo/client";
import {
  activateUser,
  forgotPassword,
  onLogin,
  onResetPasswordRequest,
  readQueryString,
} from "./loginUtils";
import ChoosePassword from "./components/Authentication/ChoosePassword";
import Login from "./components/Authentication/Login";
import Cookies from "js-cookie";
import ResetPassword from "./components/Authentication/ResetPassword/ResetPassword";
import loadable from "@loadable/component";

require("./componentsBase/style");

const jss = create(jssPreset());
// Custom material-ui-next class name generator for better debug and performance.
// jss.options.createGenerateClassName = createGenerateClassName
// We define a custom insertion point JSS will look for injecting the styles in the DOM.

jss.setup({ insertionPoint: "insertion-point-jss" });

const Main = loadable(() => import("./components/Main"));

const AreaFilesShared = loadable(() => import("./components/AreaFilesShared"));

console.log(version.version);

const App = () => {
  localStorage.setItem("lang", "en");
  const history = useHistory();
  const location = useLocation();

  const onLoginWithHistory = React.useCallback(
    (username, password, groupId, cbFailure) => {
      onLogin(username, password, groupId, cbFailure, history, location);
    },
    [history, location]
  );

  const onResetPassword = React.useCallback(() => {
    history.push("/" + RESET_PASSWORD_ID);
  }, [history]);

  return (
    <React.Suspense fallback={<LoadingMask open />}>
      <Route
        path="/:viewId?"
        // eslint-disable-next-line react/jsx-no-bind
        render={(routeConf) => {
          const { viewId } = routeConf.match.params;

          if (viewId === SHARE_ID) {
            return <AreaFilesShared />;
          }

          if (viewId === CHOOSE_PASSWORD_ID || viewId === FORGOT_PASSWORD_ID) {
            const { email, code, groupId } = readQueryString(location);
            return (
              <ChoosePassword
                email={email}
                code={code}
                groupId={groupId}
                changePassword={
                  viewId === CHOOSE_PASSWORD_ID ? activateUser : forgotPassword
                }
              />
            );
          }

          if (viewId === RESET_PASSWORD_ID) {
            return (
              <ResetPassword
                backgroundNode={<Background />}
                onResetPassword={onResetPasswordRequest}
              />
            );
          }

          const isRefreshTokenPresent = Cookies.get(REFRESH_TOKEN);
          if (!isRefreshTokenPresent) {
            return (
              <Login
                title={APP_NAME}
                backgroundNode={<Background />}
                onLogin={onLoginWithHistory}
                onResetPassword={onResetPassword}
              />
            );
          }

          return (
            <ApolloProvider client={client}>
              <Main {...routeConf} viewId={viewId} />
            </ApolloProvider>
          );
        }}
      />
    </React.Suspense>
  );
};

const elToRender = document.getElementById(ROOT_DIV_ID);
ReactDOM.render(
  <StylesProvider jss={jss}>
    <MuiThemeProvider theme={getTheme(APP_COLORS)}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MuiThemeProvider>
  </StylesProvider>,
  elToRender
);
