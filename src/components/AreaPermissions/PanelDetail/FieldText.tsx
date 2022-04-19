import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import FieldTextLibrary from "../../../componentsBase/Field/FieldText";
import { columns } from "../constants";
import { ContextDispatchViewport } from "../contexts";

const useStyles = makeStyles({
  field: {
    margin: "30px 20px 10px",
    maxHeight: 300,
  },
});

interface IFieldText {
  id: string;
  value: string;
}

const FieldText = ({ id, value }: IFieldText) => {
  const classes = useStyles({});
  const dispatchViewport = React.useContext(ContextDispatchViewport);

  const onChangeCb = React.useCallback(
    (value: string) => {
      dispatchViewport({ type: "TODO", id, value });
    },
    [dispatchViewport, id]
  );

  return (
    <FieldTextLibrary
      label={columns.find((c) => c.id === id).label}
      className={classes.field}
      value={value}
      onChange={onChangeCb}
      readOnly
    />
  );
};

export default FieldText;
