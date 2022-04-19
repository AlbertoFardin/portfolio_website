import { action } from "@storybook/addon-actions";
import * as React from "react";
import * as moment from "moment";
import FieldDate from ".";
import {
  Paper,
  BtnEdit,
  BtnCheck,
  style,
  menuItems,
  adornmentIcon,
  adornmentAvatar,
  adornmentElement,
} from "../utils/story";

const isDayBlocked = (date) => {
  const mounth = new Date(date).getMonth();
  const day = new Date(date).getDay();
  const nowMount = new Date().getMonth();
  const nowDay = new Date().getDay();
  return (
    mounth !== nowMount ||
    (day !== nowDay && day !== nowDay + 1 && day !== nowDay - 1)
  );
};
const newValue = new Date(1578006000000);

const DemoFieldDate = () => {
  const [readOnly, setReadOnly] = React.useState(false);
  const [menu, setMenu] = React.useState(false);
  const [value, setValue] = React.useState(null);
  const [dayBlock, setDayBlock] = React.useState(null);
  const [adIcon, setAdIcon] = React.useState(false);
  const [adAvatar, setAdAvatar] = React.useState(false);
  const [adElement, setAdElement] = React.useState(false);

  const onChange = React.useCallback((nValue: number) => {
    setValue(nValue);
    action("onChange")(nValue);
  }, []);
  const onClear = React.useCallback(() => setValue(""), []);
  const onSetDate = React.useCallback(() => setValue(newValue), []);
  const onReadOnly = React.useCallback(() => setReadOnly(!readOnly), [
    readOnly,
  ]);
  const onMenu = React.useCallback(() => setMenu(!menu), [menu]);
  const onDayBlock = React.useCallback(() => setDayBlock(!dayBlock), [
    dayBlock,
  ]);
  const onAdIcon = React.useCallback(() => setAdIcon(!adIcon), [adIcon]);
  const onAdAvatar = React.useCallback(() => setAdAvatar(!adAvatar), [
    adAvatar,
  ]);
  const onAdElement = React.useCallback(() => setAdElement(!adElement), [
    adElement,
  ]);

  return (
    <>
      <FieldDate
        dateFormat="DD/MM/YYYY"
        readOnly={readOnly}
        menu={menu ? menuItems : []}
        value={value}
        label="FieldDate"
        onChange={onChange}
        style={style}
        isDayBlocked={dayBlock ? isDayBlocked : undefined}
        adornmentIcon={adIcon ? adornmentIcon : undefined}
        adornmentAvatar={adAvatar ? adornmentAvatar : undefined}
        adornmentElement={adElement ? adornmentElement : undefined}
      />
      <Paper>
        <BtnEdit label="Clear input" onClick={onClear} />
        <BtnEdit
          label={`Set ${moment(newValue).format("L")}`}
          onClick={onSetDate}
        />
        <BtnCheck label="readOnly" check={readOnly} onClick={onReadOnly} />
        <BtnCheck label="menu" check={menu} onClick={onMenu} />
        <BtnCheck label="isDayBlocked" check={dayBlock} onClick={onDayBlock} />
        <BtnCheck check={adIcon} label="adornmentIcon" onClick={onAdIcon} />
        <BtnCheck
          check={adAvatar}
          label="adornmentAvatar"
          onClick={onAdAvatar}
        />
        <BtnCheck
          check={adElement}
          label="adornmentElement"
          onClick={onAdElement}
        />
      </Paper>
    </>
  );
};

export default DemoFieldDate;
