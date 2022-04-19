import * as React from "react";
import * as Colors from "../../componentsBase/style/Colors";
import Btn from "../../componentsBase/Btn";
import useDebounce from "../../componentsBase/utils/useDebounce";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Input from "@material-ui/core/Input";
import classnames from "classnames";

const useStyles = makeStyles({
  field: {
    border: `1px solid ${Colors.Gray3}`,
    transition: "all 250ms",
    "border-radius": 100,
    "background-color": "#fff",
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    width: 400,
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
  autofocus?: boolean;
  placeholder?: string;
  value: string;
  onChange: (s: string) => void;
  className?: string;
  style?: React.CSSProperties;
  children?: JSX.Element;
  disabled?: boolean;
}

const FieldSearch = ({
  autofocus,
  placeholder = "Search...",
  value,
  onChange,
  className,
  style,
  children,
  disabled,
}: IFieldSearch) => {
  const classes = useStyles({});
  const inputRef = React.useRef(null);
  const searching = React.useRef(false);
  const [inputValue, setInputValue] = React.useState(value);
  const inputValueDebounced = useDebounce(inputValue, 500);

  const onInputChange = React.useCallback((event) => {
    setInputValue(event.target.value);
    searching.current = true;
  }, []);
  const onInputClean = React.useCallback(() => {
    inputRef.current.value = "";
    onChange("");
    setInputValue("");
  }, [onChange]);

  React.useEffect(() => {
    if (searching.current) {
      onChange(inputValueDebounced);
      searching.current = false;
    }
  }, [inputValueDebounced, onChange]);

  return (
    <div
      style={style}
      className={classnames({
        [classes.field]: true,
        [className]: !!className,
      })}
    >
      <Btn
        className={classes.button}
        icon={!value ? "search" : "close"}
        tooltip={!value ? undefined : "Clean"}
        disabled={!value}
        onClick={onInputClean}
      />
      <Input
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autofocus}
        inputRef={inputRef}
        placeholder={placeholder}
        onChange={onInputChange}
        className={classes.fieldInput}
        disabled={!!disabled}
      />
      {children}
    </div>
  );
};

export default FieldSearch;
