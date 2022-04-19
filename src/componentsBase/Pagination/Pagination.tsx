import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import classnames from "classnames";
import Tooltip from "../Tooltip";
import ActionsMenu from "../ActionsMenu";
import BtnArrow from "./BtnArrow";
import { IPageSize, IPagination } from ".";
import { emptyFn } from "../utils/common";

const getInputWidth = (value: number) => String(value).length * 6 + 10;
const pageMin = 1;
const useStyles = makeStyles(({ typography, palette }) => {
  const styleInputFocus = { borderColor: palette.primary.main };
  const styleInputBorderRadius = 3;
  const styleFontSize = typography.body1.fontSize;
  return {
    pagination: {
      display: "flex",
      "flex-direction": "row",
      "align-items": "center",
    },
    label: {
      margin: "0 5px",
      "font-size": styleFontSize,
      color: "#333",
    },
    labelSelected: {
      color: palette.primary.main,
    },
    input: {
      "background-color": "#ffffff",
      "border-radius": styleInputBorderRadius,
      "min-width": 10,
      "& input": {
        color: "#333",
        padding: 1,
        "text-align": "center",
        "border-radius": styleInputBorderRadius,
        "font-size": styleFontSize,
        border: "1px solid #eee",
      },
      "& :focus": styleInputFocus,
      "& :hover": styleInputFocus,
      "& :read-only": {
        cursor: "pointer",
      },
    },
  };
});

const Pagination = ({
  className,
  itemsCount,
  labelAdornmentEnd = "",
  labelAdornmentStart = "",
  onChangeCurrent,
  onChangeSizes = emptyFn,
  pageCurrent,
  pageSizes,
  style,
  minimized = false,
}: IPagination) => {
  const classes = useStyles({});
  const inputRef = React.useRef(null);
  const [inputValue, setInputValue] = React.useState(pageCurrent);
  const [menu, setMenu] = React.useState(null);
  const size = Number.isInteger(pageSizes)
    ? (pageSizes as number)
    : (pageSizes as IPageSize[]).find(({ selected }) => selected).value;
  const pageMax = Math.max(1, Math.ceil(itemsCount / size));
  const onCbInputChange = React.useCallback(
    (event) => {
      const newValue = event.target.value;
      // check if value is a number
      if (!isNaN(newValue)) setInputValue(newValue);
      // else reset input value
      else inputRef.current.value = inputValue;
    },
    [inputValue]
  );
  const onCbInputKeyPress = React.useCallback((event) => {
    if (event.key === "Enter") inputRef.current.blur();
  }, []);
  const onCbInputBlur = React.useCallback(
    (event) => {
      let newValue = event.target.value;

      if (!isNaN(newValue)) {
        newValue = Math.min(pageMax, newValue);
        newValue = Math.max(pageMin, newValue);
        onChangeCurrent(newValue);
        setInputValue(newValue);
        inputRef.current.value = newValue;
      }
    },
    [onChangeCurrent, pageMax]
  );
  const onCbChangeSizes = React.useCallback(
    (event, id: string) => {
      const { selected } = (pageSizes as IPageSize[]).find(
        (s) => String(id) === String(s.value)
      );
      if (!selected) {
        const newSizes = (pageSizes as IPageSize[]).map(
          ({ value, label }: IPageSize) => ({
            value: value,
            label,
            selected: String(id) === String(value),
          })
        );
        onChangeSizes(newSizes);
      }
    },
    [onChangeSizes, pageSizes]
  );
  const onCbMenuOpen = React.useCallback(
    (event: React.MouseEvent) => {
      if (!Number.isInteger(pageSizes)) {
        setMenu(event.currentTarget);
      }
    },
    [pageSizes]
  );
  const onCbMenuClose = React.useCallback(() => {
    setMenu(null);
  }, []);
  const onCbBtnLeft = React.useCallback(() => {
    const newValue = pageCurrent - 1;
    onChangeCurrent(newValue);
  }, [onChangeCurrent, pageCurrent]);
  const onCbBtnRight = React.useCallback(() => {
    const newValue = pageCurrent + 1;
    onChangeCurrent(newValue);
  }, [onChangeCurrent, pageCurrent]);
  const menuTitle = {
    id: "title",
    label: "Number of items per page",
    active: true,
    style: { opacity: 1 },
    disabled: true,
  };
  const menuItems = Number.isInteger(pageSizes)
    ? []
    : (pageSizes as IPageSize[]).map(
        ({ value, label, selected }: IPageSize) => ({
          id: String(value),
          label,
          active: selected,
          classNameLabel: selected ? classes.labelSelected : undefined,
          onClick: onCbChangeSizes,
        })
      );

  React.useEffect(() => {
    setInputValue(pageCurrent);
    if (inputRef && inputRef.current) inputRef.current.value = pageCurrent;
  }, [pageCurrent]);

  return (
    <div
      style={style}
      className={classnames({
        [classes.pagination]: true,
        [className]: !!className,
      })}
    >
      {minimized ? null : (
        <BtnArrow
          icon="keyboard_arrow_left"
          disabled={!inputValue || inputValue === pageMin}
          onClick={onCbBtnLeft}
        />
      )}
      {minimized || !labelAdornmentStart ? null : (
        <Typography
          variant="body1"
          className={classes.label}
          children={labelAdornmentStart}
        />
      )}
      <Tooltip title="go to page…">
        <InputBase
          className={classes.input}
          defaultValue={pageCurrent}
          onChange={onCbInputChange}
          onKeyPress={onCbInputKeyPress}
          inputProps={{
            ref: inputRef,
            min: pageMin,
            max: pageMax,
            style: { width: getInputWidth(Number(inputValue)) },
            onBlur: onCbInputBlur,
          }}
        />
      </Tooltip>
      <Typography variant="body1" className={classes.label} children="/" />
      {Number.isInteger(pageSizes) ? (
        <Typography
          variant="body1"
          className={classes.label}
          children={pageMax}
        />
      ) : (
        <Tooltip title="Select number of items per page">
          <InputBase
            className={classes.input}
            value={pageMax}
            readOnly
            disabled
            onClick={onCbMenuOpen}
            inputProps={{
              style: { width: getInputWidth(pageMax) },
            }}
          />
        </Tooltip>
      )}
      {minimized || !labelAdornmentEnd ? null : (
        <Typography
          variant="body1"
          className={classes.label}
          children={labelAdornmentEnd}
        />
      )}
      {minimized ? null : (
        <BtnArrow
          icon="keyboard_arrow_right"
          disabled={!inputValue || inputValue === pageMax}
          onClick={onCbBtnRight}
        />
      )}
      <ActionsMenu
        open={!!menu}
        onClose={onCbMenuClose}
        anchorEl={menu}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        actions={[].concat(menuTitle, menuItems)}
      />
    </div>
  );
};

export default Pagination;
