import Popover from "@material-ui/core/Popover";
import TextField from "@material-ui/core/TextField";
import classnames from "classnames";
import * as moment from "moment";
import * as React from "react";
import Btn from "../../Btn/Btn";
import DatePicker from "../../DatePicker";
import { emptyFn } from "../../utils/common";
import Chip from "../utils/Chip";
import { getLabels } from "../Label";
import useStyles from "../utils/useStyles";
import BtnMenu from "../utils/BtnMenu";
import IFieldDate from "./IFieldDate";

const FieldDate = ({
  dateFormat,
  className,
  label,
  adornmentIcon,
  adornmentIconTooltip,
  adornmentIconColor,
  adornmentAvatar,
  adornmentAvatarTooltip,
  adornmentElement,
  isDayBlocked = () => false,
  menu = [],
  menuDisabled = false,
  menuOnHover = true,
  menuOnClose = emptyFn,
  onChange = emptyFn,
  placeholder = "Select a date...",
  readOnly = false,
  style,
  value = 0,
}: IFieldDate) => {
  const fieldRef = React.useRef(null);

  const [width, setWidth] = React.useState(0);
  const [inputFocus, setInputFocus] = React.useState(false);
  const [inputHover, setInputHover] = React.useState(false);
  const [date, setDate] = React.useState(value);

  const inputHide = !!value || !!adornmentElement;
  const classes = useStyles({
    width,
    inputHide,
    readOnly,
    hasIcon: !!adornmentIcon,
    hasAvatar: !!adornmentAvatar,
    hasMenu: !adornmentElement && !readOnly,
  });

  const fieldWidth = fieldRef.current ? fieldRef.current.clientWidth : 1;
  const cbOnEnter = React.useCallback(() => {
    setInputHover(true);
  }, []);
  const cbOnLeave = React.useCallback(() => {
    setInputHover(false);
    menuOnClose();
  }, [menuOnClose]);
  const cbOnFocus = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!readOnly && !inputFocus) {
        setInputFocus(!inputFocus);
      }
    },
    [inputFocus, readOnly]
  );
  const cbOnBlur = React.useCallback(() => {
    setInputFocus(false);
  }, []);
  const cbOnChange = React.useCallback(
    (d) => {
      const dateSelected = d.startDate;
      setDate(dateSelected);
      if (dateSelected !== date) {
        onChange(dateSelected);
      }
      cbOnBlur();
    },
    [date, onChange, cbOnBlur]
  );
  const cbOnDayBlocked = React.useCallback(
    (e) => {
      const blocked = moment(e).valueOf();
      return isDayBlocked(blocked);
    },
    [isDayBlocked]
  );
  const cbOnRemove = React.useCallback(() => {
    setDate(0);
    onChange(null);
  }, [onChange]);
  const endAdornmentDefault = readOnly ? null : (
    <Btn
      icon="arrow_drop_down"
      onClick={cbOnFocus}
      style={{
        position: "absolute",
        bottom: 5,
        right: 5,
        margin: 0,
      }}
    />
  );

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  React.useEffect(() => {
    setWidth(fieldWidth);
  }, [fieldWidth]);

  return (
    <>
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
              {!!adornmentElement || !date ? null : (
                <div className={classes.containerChips}>
                  <Chip
                    id="dateChip"
                    label={moment(date).format(dateFormat)}
                    readOnly={readOnly}
                    onRemove={cbOnRemove}
                  />
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
              renderDefault={endAdornmentDefault}
            />
          ),
          readOnly: true,
          placeholder: readOnly && !date ? "No value" : placeholder,
          onClick: cbOnFocus,
          onMouseOver: cbOnEnter,
          onMouseLeave: cbOnLeave,
        }}
      />
      <Popover
        open={inputFocus}
        anchorEl={fieldRef.current}
        onClose={cbOnBlur}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        disableAutoFocus
        disableEnforceFocus
      >
        <DatePicker
          isDayBlocked={cbOnDayBlocked}
          numberOfMonths={1}
          singleDate
          startDate={date}
          endDate={date}
          onDatesChange={cbOnChange}
        />
      </Popover>
    </>
  );
};

export default FieldDate;
