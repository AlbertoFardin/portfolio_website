import * as React from "react";
import * as Colors from "../../../../componentsBase/style/Colors";
import FieldTextLibrary from "../../../../componentsBase/Field/FieldText";
import { emptyFn } from "../../../../componentsBase/utils/common";
import useStyles from "./useStyles";
import Label from "./Label";
import { EMAIL_KEY } from "../../constants";

const id = EMAIL_KEY;

interface IFieldEmail {
  email: string;
  emailVerified: boolean;
  onChange?: (id: string, value: string) => void;
  readOnly: boolean;
}

const FieldEmail = ({
  email,
  emailVerified,
  onChange = emptyFn,
  readOnly,
}: IFieldEmail) => {
  const classes = useStyles({});
  const onChangeCb = React.useCallback(
    (value: string) => {
      onChange(id, value);
    },
    [onChange]
  );

  return (
    <FieldTextLibrary
      label={<Label id={id} readOnly={readOnly} />}
      className={classes.field}
      value={email}
      onChange={onChangeCb}
      readOnly={readOnly}
      adornmentIcon="check_circle"
      adornmentIconTooltip={
        emailVerified ? "Email verified" : "Email not verified"
      }
      adornmentIconColor={emailVerified ? Colors.Green : Colors.Gray2}
    />
  );
};

export default FieldEmail;
