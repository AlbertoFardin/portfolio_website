import * as React from "react";
import * as Colors from "../style/Colors";
import Btn from "../Btn";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Input from "@material-ui/core/Input";

const useStyles = makeStyles({
  field: {
    border: `1px solid ${Colors.Gray3}`,
    transition: "all 250ms",
    "border-radius": 100,
    "background-color": "#fff",
    display: "flex",
    "flex-direction": "row",
    "align-items": "stretch",
    margin: "0 10px",
  },
  fieldInput: {
    "&::before": {
      display: "none",
    },
    "&::after": {
      display: "none",
    },
    flex: 1,
    padding: "0 10px",
  },
  button: {
    margin: 0,
  },
});

interface IFieldSearch {
  focus: boolean;
  onChange: (s: string) => void;
  onFocus: () => void;
  onClean: () => void;
}

const FieldSearch = ({ focus, onChange, onFocus, onClean }: IFieldSearch) => {
  const classes = useStyles({});
  const inputRef = React.useRef(null);
  const onInputChange = React.useCallback(
    (event) => {
      onChange(event.target.value);
    },
    [onChange]
  );
  const onInputClean = React.useCallback(() => {
    inputRef.current.value = "";
    onClean();
  }, [onClean]);
  const cbOnFocus = React.useCallback(() => {
    onFocus();
  }, [onFocus]);

  return (
    <div className={classes.field}>
      <Btn
        className={classes.button}
        icon={focus ? "close" : "search"}
        tooltip={focus ? "Clean" : undefined}
        disabled={!focus}
        onClick={onInputClean}
      />
      <Input
        inputRef={inputRef}
        placeholder="Search..."
        onChange={onInputChange}
        onFocus={cbOnFocus}
        className={classes.fieldInput}
      />
    </div>
  );
};

export default FieldSearch;
