/* eslint-disable jsx-a11y/no-autofocus */
import TextField from "@material-ui/core/TextField";
import classnames from "classnames";
import * as React from "react";
import { emptyFn } from "../../utils/common";
import useDebounce from "../../utils/useDebounce";
import { getLabels } from "../Label";
import useStyles from "../utils/useStyles";
import BtnMenu from "../utils/BtnMenu";
import IFieldText from "./IFieldText";
import Btn from "../../Btn";

const FieldText = ({
  autoFocus = false,
  className,
  debounce = 500,
  label,
  inputRef: inputRefInit,
  adornmentIcon,
  adornmentIconTooltip,
  adornmentIconColor,
  adornmentAvatar,
  adornmentAvatarTooltip,
  adornmentElement,
  menu = [],
  menuDisabled = false,
  menuOnHover = true,
  menuOnClose = emptyFn,
  multiline = false,
  onChange = emptyFn,
  onKeyPress = emptyFn,
  onBlur = emptyFn,
  onFocus = emptyFn,
  placeholder = "Write...",
  readOnly = false,
  style,
  type = "text",
  autoComplete,
  value = "",
}: IFieldText) => {
  const valueRef = React.useRef(value);
  const fieldRef = React.useRef(null);
  let inputRef = React.useRef(null);
  if (inputRefInit) inputRef = inputRefInit;

  const [width, setWidth] = React.useState(0);
  const [inputValue, setInputValue] = React.useState(value);
  const [inputHover, setInputHover] = React.useState(false);
  const inputValueDebounced = useDebounce(inputValue, debounce);
  const fieldWidth = fieldRef.current ? fieldRef.current.clientWidth : 1;

  const classes = useStyles({
    width,
    inputHide: !!adornmentElement,
    readOnly,
    hasIcon: !!adornmentIcon,
    hasAvatar: !!adornmentAvatar,
    hasMenu: !adornmentElement && !!menu.length,
  });

  // scatta onChange al cambiamento dell'input da parte dell'utente
  // valueRef serve per NON far scattare onChange al cambiamento del value esterno
  React.useEffect(() => {
    if (valueRef.current !== inputValueDebounced) {
      onChange(inputValueDebounced);
      valueRef.current = inputValueDebounced;
    }
  }, [inputValueDebounced, onChange]);

  // allinea lo stato interno ed l'input al cambiamento del value esterno
  React.useEffect(() => {
    const isFocus = document.activeElement === inputRef.current;
    if (valueRef.current !== value && !isFocus) {
      inputRef.current.value = value;
      valueRef.current = value;
      setInputValue(value);
    }
  }, [value]);

  // after first render, save width to use it in useStyles
  React.useEffect(() => {
    setWidth(fieldWidth);
  }, [fieldWidth]);

  const cbOnEnter = React.useCallback(() => {
    setInputHover(true);
  }, []);
  const cbOnLeave = React.useCallback(() => {
    setInputHover(false);
    menuOnClose();
  }, [menuOnClose]);
  const cbOnChange = React.useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    const v = event.target.value;
    setInputValue(v);
  }, []);
  const cbOnBlur = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const v = event.target.value;
      if (!v) {
        inputRef.current.value = value;
      }
      onBlur(v);
    },
    [inputRef, onBlur, value]
  );
  const cbOnFocus = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const v = event.target.value;
      onFocus(v);
    },
    [onFocus]
  );
  const cbOnKeyPressed = React.useCallback(
    (event) => {
      onKeyPress(event.key, inputRef.current.value);
    },
    [inputRef, onKeyPress]
  );

  return (
    <TextField
      ref={fieldRef}
      inputRef={inputRef}
      type={type}
      autoComplete={autoComplete}
      className={classnames({
        [classes.field]: true,
        [className]: !!className,
      })}
      style={style}
      multiline={multiline}
      variant="outlined"
      defaultValue={inputValue}
      autoFocus={autoFocus}
      InputProps={{
        className: classes.input,
        startAdornment: (
          <>
            {getLabels(label, readOnly)}
            {!adornmentIcon ? null : (
              <Btn
                disabled
                className={classes.adornmentIcon}
                icon={adornmentIcon}
                iconStyle={{ color: adornmentIconColor }}
                tooltip={adornmentIconTooltip}
              />
            )}
            {!adornmentAvatar ? null : (
              <Btn
                disabled
                className={classes.adornmentAvatar}
                avatar={adornmentAvatar}
                tooltip={adornmentAvatarTooltip}
              />
            )}
            {!adornmentElement ? null : (
              <div
                className={classes.adornmentElement}
                children={adornmentElement}
              />
            )}
          </>
        ),
        endAdornment: !!adornmentElement ? null : (
          <BtnMenu
            onClose={cbOnLeave}
            inputHover={inputHover}
            readOnly={readOnly}
            items={menu}
            disabled={menuDisabled}
            visibleOnHover={menuOnHover}
          />
        ),
        readOnly,
        placeholder: readOnly && !value ? "No value" : placeholder,
        onChange: cbOnChange,
        onFocus: cbOnFocus,
        onBlur: cbOnBlur,
        onKeyPress: cbOnKeyPressed,
        onMouseOver: cbOnEnter,
        onMouseLeave: cbOnLeave,
      }}
    />
  );
};

export default FieldText;
