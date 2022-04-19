import * as React from "react";
import FieldTextLibrary from "../../../../componentsBase/Field/FieldText";
import { emptyFn } from "../../../../componentsBase/utils/common";
import useStyles from "./useStyles";
import Label from "./Label";

interface IFieldText {
  id: string;
  value?: string;
  onChange?: (id: string, value: string) => void;
  readOnly?: boolean;
}

const FieldText = ({
  id,
  value = "",
  onChange = emptyFn,
  readOnly = false,
}: IFieldText) => {
  const classes = useStyles({});
  const onChangeCb = React.useCallback(
    (value: string) => {
      onChange(id, value);
    },
    [id, onChange]
  );

  return (
    <FieldTextLibrary
      label={<Label id={id} readOnly={readOnly} />}
      className={classes.field}
      value={value}
      onChange={onChangeCb}
      readOnly={readOnly}
    />
  );
};

export default FieldText;
