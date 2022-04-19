import { action } from "@storybook/addon-actions";
import * as React from "react";
import FieldText from "./FieldText";
import {
  Paper,
  BtnEdit,
  BtnCheck,
  menuItems,
  style,
  adornmentIcon,
  adornmentAvatar,
  adornmentElement,
} from "../utils/story";

const valueDefault =
  "Once Upon a Time,\nthere are a little girl called Red Hood";

const DemoFieldText = () => {
  const [value, setValue] = React.useState(valueDefault);
  const [readOnly, setReadOnly] = React.useState(false);
  const [multiline, setMultiline] = React.useState(true);
  const [menu, setMenu] = React.useState(false);
  const [adIcon, setAdIcon] = React.useState(false);
  const [adAvatar, setAdAvatar] = React.useState(false);
  const [adElement, setAdElement] = React.useState(false);

  const onChange = React.useCallback((newValue: string) => {
    setValue(newValue);
    action("onChange")(newValue);
  }, []);
  const onSetEmptyString = React.useCallback(() => setValue(""), []);
  const onSetCiao = React.useCallback(() => setValue("ciao👋"), []);
  const onSetNull = React.useCallback(() => setValue(null), []);
  const onSetUndefined = React.useCallback(() => setValue(undefined), []);
  const onReadOnly = React.useCallback(() => setReadOnly(!readOnly), [
    readOnly,
  ]);
  const onMultiline = React.useCallback(() => setMultiline(!multiline), [
    multiline,
  ]);
  const onMenu = React.useCallback(() => setMenu(!menu), [menu]);
  const onAdIcon = React.useCallback(() => setAdIcon(!adIcon), [adIcon]);
  const onAdAvatar = React.useCallback(() => setAdAvatar(!adAvatar), [
    adAvatar,
  ]);
  const onAdElement = React.useCallback(() => setAdElement(!adElement), [
    adElement,
  ]);

  return (
    <>
      <FieldText
        readOnly={readOnly}
        multiline={multiline}
        menu={menu ? menuItems : []}
        value={value}
        label="FieldText"
        style={style}
        onChange={onChange}
        adornmentIcon={adIcon ? adornmentIcon : undefined}
        adornmentAvatar={adAvatar ? adornmentAvatar : undefined}
        adornmentElement={adElement ? adornmentElement : undefined}
      />
      <Paper>
        <BtnEdit label='Set "ciao👋"' onClick={onSetCiao} />
        <BtnEdit label='Set ""' onClick={onSetEmptyString} />
        <BtnEdit label='Set "null"' onClick={onSetNull} />
        <BtnEdit label='Set "undefined"' onClick={onSetUndefined} />
        <BtnCheck check={readOnly} label="readOnly" onClick={onReadOnly} />
        <BtnCheck check={multiline} label="multiline" onClick={onMultiline} />
        <BtnCheck check={menu} label="menu" onClick={onMenu} />
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

export default DemoFieldText;
