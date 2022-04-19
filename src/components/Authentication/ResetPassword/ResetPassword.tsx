import * as React from "react";
import * as Colors from "../../../componentsBase/style/Colors";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Field from "../component/Field";
import Toolbar from "@material-ui/core/Toolbar";
import useStyles from "../component/useStyles";
import LoadingMask from "../../../componentsBase/LoadingMask/LoadingMask";
import Btn from "../../../componentsBase/Btn";
import { useHistory } from "react-router-dom";
import { colorTheme } from "../../../constants";

interface IResetPassword {
  backgroundNode?: JSX.Element | React.ReactNode;
  onResetPassword: (
    email: string,
    tenant: string,
    cbSuccess?: (a?: string) => void,
    cbFailure?: (b?: string) => void
  ) => Promise<void>;
}
const ResetPassword = ({ onResetPassword, backgroundNode }: IResetPassword) => {
  const classes = useStyles();
  const history = useHistory();

  const [tenant, setTenant] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [successResetPassword, setSuccessResetPassword] = React.useState(false);
  const [invalidCredential, setInvalidCredential] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const cbSuccessResetPassword = React.useCallback(() => {
    setLoading(false);
    setSuccessResetPassword(true);
  }, []);
  const cbFailureResetPassword = React.useCallback(() => {
    setLoading(false);
    setInvalidCredential(true);
  }, []);
  const cbOnClickResetpassword = React.useCallback(() => {
    setLoading(true);
  }, []);
  const cbOnChangeTenant = React.useCallback((key, value) => {
    setTenant(value);
    setInvalidCredential(false);
  }, []);
  const cbOnChangeEmail = React.useCallback((key, value) => {
    setEmail(value);
    setInvalidCredential(false);
  }, []);
  const cbBackOnLogin = React.useCallback(() => {
    history.push("/");
  }, [history]);

  React.useEffect(() => {
    (async () => {
      if (loading) {
        await onResetPassword(
          email,
          tenant,
          cbSuccessResetPassword,
          cbFailureResetPassword
        );
        setLoading(false);
      }
    })();
  }, [
    cbFailureResetPassword,
    cbSuccessResetPassword,
    email,
    onResetPassword,
    tenant,
    loading,
  ]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={8}>
        <form className={classes.form}>
          <Btn
            style={{ position: "absolute", top: 15, left: 0, margin: 0 }}
            onClick={cbBackOnLogin}
            icon="arrow_backward"
          />
          <Typography
            variant="body1"
            className={classes.title}
            children="Reset Password"
          />
          <LoadingMask open={loading} />
          <Field
            keyField="company"
            autoComplete="company"
            icon="domain"
            label="Company"
            value={tenant}
            onChangeInput={cbOnChangeTenant}
            readOnly={successResetPassword}
          />
          <Field
            keyField="username"
            autoComplete="username"
            icon="person"
            label="Email"
            value={email}
            onChangeInput={cbOnChangeEmail}
            readOnly={successResetPassword}
          />
          <br />
          <Toolbar className={classes.toolbar}>
            {successResetPassword ? (
              <>
                <div className={classes.flex1} />
                <Typography
                  style={{ color: Colors.Green }}
                  variant="body2"
                  children="We have sent an email with a link to reset your password"
                />
                <div className={classes.flex1} />
              </>
            ) : (
              <>
                <div style={{ width: 250 }}>
                  {invalidCredential ? (
                    <Typography
                      style={{ color: Colors.Red }}
                      variant="body2"
                      children="INVALID CREDENTIALS"
                    />
                  ) : (
                    <Typography variant="body2" children="IMPORTANT" />
                  )}
                  <Typography
                    variant="caption"
                    children={
                      <>
                        If you don’t remember your email or company
                        <br />
                        please contact your system administrator
                      </>
                    }
                  />
                </div>
                <div className={classes.flex1} />
                <Btn
                  variant={"bold"}
                  color={colorTheme}
                  disabled={!email || !tenant}
                  onClick={cbOnClickResetpassword}
                  icon="arrow_forward"
                  label={"Reset password".toLocaleUpperCase()}
                  labelPosition={"left"}
                />
              </>
            )}
          </Toolbar>
        </form>
      </Paper>
      {backgroundNode}
    </div>
  );
};

export default ResetPassword;
