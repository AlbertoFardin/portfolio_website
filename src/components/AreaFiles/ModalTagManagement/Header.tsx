import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import Input from "@material-ui/core/Input";
import Btn from "../../../componentsBase/Btn";
import * as Colors from "../../../componentsBase/style/Colors";
import { colorTheme } from "../../../constants";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ACT_MODAL } from "./reducer";

const useStyles = makeStyles({
  search: {
    position: "relative",
    width: "100%",
    "background-color": Colors.Gray4,
    border: "1px solid #ddd",
    "border-radius": 5,
    display: "flex",
    "align-items": "center",
    "box-sizing": "border-box",
    height: 40,
  },
  input: {
    height: 26,
    "font-weight": "lighter",
    width: "100%",
    "& input": {
      padding: 0,
      "font-size": 12,
      width: "100%",
      "&::placeholder": {
        "font-style": "italic",
      },
    },
    "&::before": {
      display: "none",
    },
    "&::after": {
      display: "none",
    },
  },
  iconBox: {
    "min-width": 40,
    height: "100%",
    display: "flex",
    "align-items": "center",
  },
  spinner: {
    color: colorTheme,
    margin: "auto",
  },
  flex1: {
    flex: 1,
  },
});

interface IHeader {
  dispatchCmp: React.Dispatch<unknown>;
  loading: boolean;
  searchingInput: string;
}

const Header = ({ dispatchCmp, loading, searchingInput }: IHeader) => {
  const classes = useStyles({});
  const inputRef = React.useRef(null);
  const cbOnClear = React.useCallback(() => {
    inputRef.current.value = "";
    dispatchCmp({ type: ACT_MODAL.RESET });
  }, [dispatchCmp]);
  const cbOnChange = React.useCallback(
    (event) => {
      const input = event.target.value;
      if (input === "") {
        dispatchCmp({ type: ACT_MODAL.RESET });
      } else {
        dispatchCmp({ type: ACT_MODAL.SEARCH_START, input });
      }
    },
    [dispatchCmp]
  );

  return (
    <div className={classes.search}>
      <div className={classes.iconBox}>
        <div className={classes.flex1} />
        {loading ? (
          <CircularProgress size={20} className={classes.spinner} />
        ) : !!searchingInput ? (
          <Btn color={colorTheme} icon="clear" onClick={cbOnClear} />
        ) : (
          <Btn color={colorTheme} icon="search" />
        )}
        <div className={classes.flex1} />
      </div>
      <Input
        inputRef={inputRef}
        className={classes.input}
        placeholder="Search tag..."
        onChange={cbOnChange}
      />
    </div>
  );
};

export default Header;
