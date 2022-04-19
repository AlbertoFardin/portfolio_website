import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Btn from "../../../componentsBase/Btn";
import { colorTheme } from "../../../constants";
import FieldPassword from "./FieldPassword";
import Toolbar from "@material-ui/core/Toolbar";
import useStyles from "../component/useStyles";

const addIconValidation = (isValid: boolean, text: string): string =>
  (isValid ? "✅" : "❌") + " " + text;

interface IReducer {
  passwordOne: string;
  passwordTwo: string;
  validSizeChars: boolean;
  validCaseChars: boolean;
  validJustNumbs: boolean;
  passwordOneTooltip: boolean;
  passwordTwoTooltip: boolean;
}
const initState: IReducer = {
  passwordOne: "",
  passwordTwo: "",
  validSizeChars: false,
  validCaseChars: false,
  validJustNumbs: false,
  passwordOneTooltip: false,
  passwordTwoTooltip: false,
};
enum IAction {
  EDIT_FORM = "EDIT_FORM",
  VALIDATE_PASSWORD = "VALIDATE_PASSWORD",
  CHECK_PASSWORDS = "CHECK_PASSWORDS",
}
const reducer = (state: IReducer, action): IReducer => {
  switch (action.type) {
    case IAction.EDIT_FORM: {
      const { passwordOne, passwordTwo } = action;
      if (passwordOne !== undefined) {
        const validSizeChars = (passwordOne as string).length >= 8;
        const validCaseChars =
          /[a-z]/.test(passwordOne) && /[A-Z]/.test(passwordOne);
        const validJustNumbs = /[0-9]/.test(passwordOne);

        return {
          ...state,
          passwordOne,
          validSizeChars,
          validCaseChars,
          validJustNumbs,
        };
      }
      if (passwordTwo !== undefined) {
        return {
          ...state,
          passwordTwo,
          passwordTwoTooltip:
            state.passwordOne !== passwordTwo && !!passwordTwo,
        };
      }
      return state;
    }
    case IAction.VALIDATE_PASSWORD: {
      const { passwordOne } = state;
      const validSizeChars = (passwordOne as string).length >= 8;
      const validCaseChars =
        /[a-z]/.test(passwordOne) && /[A-Z]/.test(passwordOne);
      const validJustNumbs = /[0-9]/.test(passwordOne);

      return {
        ...state,
        validSizeChars,
        validCaseChars,
        validJustNumbs,
        passwordOneTooltip: !(
          validSizeChars &&
          validCaseChars &&
          validJustNumbs
        ),
      };
    }
    case IAction.CHECK_PASSWORDS: {
      const { passwordOne, passwordTwo } = state;
      return {
        ...state,
        passwordTwoTooltip:
          passwordOne !== passwordTwo &&
          passwordTwo.length >= passwordOne.length,
      };
    }
    default:
      throw new Error();
  }
};

interface IContentPasswords {
  email: string;
  onConfirm: (password: string) => void;
  confirmLabel: string;
}
const ContentPasswords = ({
  email,
  onConfirm,
  confirmLabel,
}: IContentPasswords) => {
  const classes = useStyles({});
  const [state, dispatch] = React.useReducer(reducer, initState);
  const {
    passwordOne,
    passwordTwo,
    validSizeChars,
    validCaseChars,
    validJustNumbs,
    passwordOneTooltip,
    passwordTwoTooltip,
  } = state;
  const validatePassword = React.useCallback(() => {
    dispatch({ type: IAction.VALIDATE_PASSWORD });
  }, []);
  const onChangePasswordOne = React.useCallback((value) => {
    dispatch({ type: IAction.EDIT_FORM, passwordOne: value });
  }, []);
  const onChangePasswordTwo = React.useCallback((value) => {
    dispatch({ type: IAction.EDIT_FORM, passwordTwo: value });
  }, []);
  const onClickBtnConfirm = React.useCallback(() => {
    onConfirm(passwordOne);
  }, [passwordOne, onConfirm]);
  const checkPasswords = React.useCallback(() => {
    dispatch({ type: IAction.CHECK_PASSWORDS });
  }, []);
  const validPasswordOne = validSizeChars && validJustNumbs && validCaseChars;
  const validPasswordTwo = passwordOne === passwordTwo;

  return (
    <>
      <Typography variant="body1" className={classes.title} children="🔑" />
      <Typography
        variant="body1"
        children={
          <>
            Please choose Warda password for <b>{email}</b>
          </>
        }
      />
      <div className={classes.flex1} />
      <FieldPassword
        tooltipNode={
          <Typography variant="body1" style={{ color: "#fff" }}>
            {addIconValidation(
              validSizeChars,
              "Minimum password length of 8 characters"
            )}
            <br />
            {addIconValidation(
              validCaseChars,
              "Password must contain upper and lower case"
            )}
            <br />
            {addIconValidation(
              validJustNumbs,
              "Password must contain at least one number"
            )}
          </Typography>
        }
        tooltipOpen={passwordOneTooltip}
        value={passwordOne}
        placeholder="Type password"
        onBlur={validatePassword}
        onFocus={validatePassword}
        onChange={onChangePasswordOne}
      />
      <FieldPassword
        tooltipNode={
          <Typography
            variant="body1"
            style={{ color: "#fff" }}
            children="❌ Password doesn't match"
          />
        }
        tooltipOpen={passwordTwoTooltip}
        value={passwordTwo}
        placeholder="Re-type password"
        onBlur={checkPasswords}
        onChange={onChangePasswordTwo}
      />
      <div className={classes.flex1} />
      <Toolbar className={classes.toolbar}>
        <div className={classes.flex1} />
        <Btn
          variant="bold"
          color={colorTheme}
          disabled={!validPasswordOne || !validPasswordTwo}
          onClick={onClickBtnConfirm}
          label={confirmLabel}
        />
      </Toolbar>
    </>
  );
};

export default ContentPasswords;
