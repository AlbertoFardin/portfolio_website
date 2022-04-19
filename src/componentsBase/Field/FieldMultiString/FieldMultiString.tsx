import TextField from "@material-ui/core/TextField";
import classnames from "classnames";
import * as React from "react";
import isEmpty from "lodash-es/isEmpty";
import { emptyFn } from "../../utils/common";
import Chip from "../utils/Chip";
import { getLabels } from "../Label";
import useStyles from "../utils/useStyles";
import BtnMenu from "../utils/BtnMenu";
import IFieldMultiString from "./IFieldMultiString";
import createItem from "./createItem";
import Btn from "../../Btn";

const multiStringSeparator = ";";

const FieldMultiString = ({
  className,
  adornmentIcon,
  adornmentIconTooltip,
  adornmentIconColor,
  adornmentAvatar,
  adornmentAvatarTooltip,
  adornmentElement,
  renderChip,
  itemsSelectedMaxLength = 999,
  label,
  onChange = emptyFn,
  onClick = emptyFn,
  menu = [],
  menuDisabled = false,
  menuOnHover = true,
  menuOnClose = emptyFn,
  placeholder = "Input value and press ENTER...",
  readOnly = false,
  readOnlyInput = false,
  style,
  value = [],
}: IFieldMultiString) => {
  const fieldRef = React.useRef(null);
  const [width, setWidth] = React.useState(0);
  const [inputHover, setInputHover] = React.useState(false);

  const itemsMaxLength = value.length >= itemsSelectedMaxLength;
  const inputHide =
    (readOnly && !isEmpty(value)) || itemsMaxLength || !!adornmentElement;
  const fieldWidth = fieldRef.current ? fieldRef.current.clientWidth : 1;
  const classes = useStyles({
    width,
    readOnly,
    inputHide,
    hasIcon: !!adornmentIcon,
    hasAvatar: !!adornmentAvatar,
    hasMenu: !adornmentElement && !!menu.length,
  });

  const cbOnEnter = React.useCallback(() => {
    setInputHover(true);
  }, []);
  const cbOnLeave = React.useCallback(() => {
    setInputHover(false);
    menuOnClose();
  }, [menuOnClose]);
  const cbOnBlur = React.useCallback((event) => (event.target.value = ""), []);
  const cbOnChipClick = React.useCallback(
    (id: string) => {
      const chips = Array.from(value);
      const found = chips.find((x) => x.id === id);
      if (found) {
        const newValues = chips.filter((x) => x.id !== found.id);
        onChange(
          found,
          newValues.map((x) => x)
        );
      } else {
        console.error("Chip not found");
      }
    },
    [onChange, value]
  );
  const cbOnKeyPressed = React.useCallback(
    (event) => {
      const chips = Array.from(value);
      const val = event.target.value.trim();
      if (event.key === "Enter" && !isEmpty(val)) {
        // split stringa ;
        const splitStrings = val.split(multiStringSeparator);
        // genero items da stringa/stringhe splittate
        const splitItems = splitStrings.reduce((acc, cur) => {
          if (!isEmpty(cur.trim())) acc.push(createItem(cur));
          return acc;
        }, []);

        // se ci sono stringhe da aggiungere
        if (splitItems.length > 0) {
          const newItems = [...chips, ...splitItems];
          onChange(val, newItems);
          event.target.value = "";
        }
      }
    },
    [onChange, value]
  );
  const cbOnClick = React.useCallback(() => {
    if (!readOnly) onClick();
  }, [onClick, readOnly]);
  const cbRenderChip = React.useCallback(
    ({ id, label }) => {
      return !!renderChip ? (
        renderChip({
          id,
          label,
          readOnly,
          onClick: cbOnChipClick,
        })
      ) : (
        <Chip
          key={id}
          id={id}
          label={label}
          readOnly={readOnly}
          onRemove={cbOnChipClick}
        />
      );
    },
    [cbOnChipClick, readOnly, renderChip]
  );

  React.useEffect(() => {
    setWidth(fieldWidth);
  }, [fieldWidth]);

  return (
    <TextField
      ref={fieldRef}
      className={classnames({
        [classes.field]: true,
        [className]: !!className,
      })}
      style={style}
      variant="outlined"
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
            {!!adornmentElement || isEmpty(value) ? null : (
              <div className={classes.containerChips}>
                {value.map(cbRenderChip)}
              </div>
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
        readOnly: inputHide || readOnlyInput,
        placeholder:
          readOnly && isEmpty(value)
            ? "No value"
            : readOnlyInput
            ? "Click to input value..."
            : placeholder,
        onBlur: cbOnBlur,
        onMouseOver: cbOnEnter,
        onMouseLeave: cbOnLeave,
        onKeyPress: cbOnKeyPressed,
        onClick: cbOnClick,
      }}
    />
  );
};

export default FieldMultiString;
