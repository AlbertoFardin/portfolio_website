import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { ACTIONS, IReducerState, reducerInitState, reducer } from "./reducer";
import Field from "../component/Field";
import Toolbar from "@material-ui/core/Toolbar";
import { ILogin } from ".";
import useStyles from "../component/useStyles";
import LoadingMask from "../../../componentsBase/LoadingMask/LoadingMask";
import Btn from "../../../componentsBase/Btn";
import Link from "@material-ui/core/Link";
import { colorTheme } from "../../../constants";

const Login = ({ title, backgroundNode, onLogin, onResetPassword }: ILogin) => {
  const classes = useStyles();

  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const {
    username,
    password,
    tenant,
    loading,
    invalidCredential,
  } = state as IReducerState;
  const cbOnLogin = React.useCallback(() => {
    dispatch({ type: ACTIONS.SET_LOADING });
  }, []);
  const fnFail = React.useCallback(
    () => dispatch({ type: ACTIONS.SET_INVALID_CREDENTIAL }),
    []
  );
  const cbOnChangeTenant = React.useCallback(
    (key, value) => dispatch({ type: ACTIONS.SET_TENANT, value }),
    []
  );
  const cbOnResetPassword = React.useCallback(
    (evt) => {
      evt.preventDefault();
      if (evt) onResetPassword();
    },
    [onResetPassword]
  );
  const cbOnChangeEmail = React.useCallback(
    (key, value: string) =>
      dispatch({ type: ACTIONS.SET_USERNAME, value, check: false }),
    []
  );
  const cbOnChangePassword = React.useCallback(
    (key, value: string) => dispatch({ type: ACTIONS.SET_PASSWORD, value }),
    []
  );

  const loginDisabled = !username || !password || !tenant;
  const onEnterField = React.useCallback(() => {
    if (!loginDisabled && !invalidCredential) {
      cbOnLogin();
      document.documentElement.blur();
    }
  }, [cbOnLogin, invalidCredential, loginDisabled]);

  React.useEffect(() => {
    (async () => {
      if (loading && !invalidCredential) {
        onLogin(username, password, tenant, fnFail);
      }
    })();
  }, [fnFail, invalidCredential, loading, onLogin, password, tenant, username]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={8}>
        <form className={classes.form}>
          <Typography
            variant="body1"
            className={classes.title}
            children={title}
          />
          <LoadingMask open={loading} />
          <Field
            keyField="company"
            autoComplete="organization"
            icon="domain"
            label="Company"
            value={tenant}
            onEnter={onEnterField}
            onChangeInput={cbOnChangeTenant}
          />
          <Field
            keyField="username"
            autoComplete="username"
            icon="person"
            label="Email"
            value={username}
            onEnter={onEnterField}
            onChangeInput={cbOnChangeEmail}
          />
          <Field
            keyField="password"
            type="password"
            autoComplete="current-password"
            icon="lock"
            label="Password"
            value={password}
            onEnter={onEnterField}
            onChangeInput={cbOnChangePassword}
          />
          <Toolbar className={classes.toolbar}>
            {!invalidCredential ? (
              <Btn
                color={colorTheme}
                tabIndex={-1}
                onClick={cbOnResetPassword}
                label="Forgotten credentials?"
              />
            ) : (
              <div style={{ width: 250 }}>
                <Typography color="error" variant="body2">
                  Invalid credentials!
                </Typography>
                <Typography>
                  If you don’t remember your email or company, please contact
                  your system administrator or
                </Typography>
                <Link variant="body2" onClick={cbOnResetPassword}>
                  Reset your password
                </Link>
              </div>
            )}
            <div className={classes.flex1} />
            <Btn
              variant="bold"
              color={colorTheme}
              disabled={loginDisabled}
              onClick={cbOnLogin}
              icon="arrow_forward"
              label="LOGIN"
              labelPosition="left"
            />
          </Toolbar>
        </form>
      </Paper>
      {backgroundNode}
    </div>
  );
};

export default Login;
