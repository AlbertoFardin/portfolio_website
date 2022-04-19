import * as React from "react";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Background from "../../Background";
import LoadingMask from "../../../componentsBase/LoadingMask";
import ContentSuccess from "./ContentSuccess";
import ContentPasswords from "./ContentPasswords";
import Snackbar from "@material-ui/core/Snackbar";
import { logOut } from "../../../api/fetchCookieJwt";
import useStyles from "../component/useStyles";

interface IReducer {
  activeSuccess: boolean;
  password: string;
  snackbar: string;
}
const initState: IReducer = {
  activeSuccess: false,
  password: "",
  snackbar: "",
};
enum IAction {
  SUCCESS_CHANGE_PASSWORD = "SUCCESS_CHANGE_PASSWORD",
  SET_PASSWORD = "SET_PASSWORD",
  SET_SNACKBAR = "SET_SNACKBAR",
}
const reducer = (state: IReducer, action): IReducer => {
  const newState = { ...state };
  switch (action.type) {
    case IAction.SUCCESS_CHANGE_PASSWORD:
      newState.activeSuccess = true;
      newState.password = initState.password;
      return newState;
    case IAction.SET_PASSWORD:
      newState.password = action.password || initState.password;
      return newState;
    case IAction.SET_SNACKBAR:
      newState.password = initState.password;
      newState.snackbar = action.snackbar || initState.snackbar;
      return newState;
    default:
      throw new Error();
  }
};

interface IChangePassword {
  email: string;
  code: string;
  groupId: string;
  password: string;
  applicationId: string;
}
interface IChoosePassword {
  i18n?: { [key: string]: string };
  email: string;
  code: string;
  groupId: string;
  changePassword: (p: IChangePassword) => Promise<void>;
}
const ChoosePassword = ({
  i18n: i18nInit,
  email,
  code,
  groupId,
  changePassword,
}: IChoosePassword) => {
  const classes = useStyles({});
  const i18n = {
    "button.confirm": "Confirm",
    "button.gotologin": "Go to Login",
    ...i18nInit,
  };
  const history = useHistory();
  const [state, dispatch] = React.useReducer(reducer, initState);
  const { activeSuccess, password, snackbar } = state;
  const onConfirm = React.useCallback((password) => {
    dispatch({ type: IAction.SET_PASSWORD, password });
  }, []);
  const onGoToLogin = React.useCallback(() => {
    logOut(history);
  }, [history]);
  const onSnackbarClose = React.useCallback(() => {
    dispatch({ type: IAction.SET_SNACKBAR });
  }, []);

  React.useEffect(() => {
    (async () => {
      if (!!password) {
        try {
          await changePassword({
            email,
            code,
            groupId,
            password,
            applicationId: process.env.PRODUCT_ID,
          });
          dispatch({ type: IAction.SUCCESS_CHANGE_PASSWORD });
        } catch (err) {
          dispatch({ type: IAction.SET_SNACKBAR, snackbar: err[0] });
        }
      }
    })();
  }, [changePassword, code, email, groupId, password]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={8}>
        <LoadingMask open={!!password} />
        <form className={classes.form}>
          {activeSuccess ? (
            <ContentSuccess
              onConfirm={onGoToLogin}
              confirmLabel={i18n["button.gotologin"].toLocaleUpperCase()}
            />
          ) : (
            <ContentPasswords
              email={email}
              onConfirm={onConfirm}
              confirmLabel={i18n["button.confirm"].toLocaleUpperCase()}
            />
          )}
        </form>
      </Paper>
      <Background />
      <Snackbar
        open={!!snackbar}
        message={snackbar}
        onClose={onSnackbarClose}
      />
    </div>
  );
};

export default ChoosePassword;
