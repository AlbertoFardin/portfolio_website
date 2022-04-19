import { action } from "@storybook/addon-actions";
import * as React from "react";
import FieldSelect from ".";
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

const valueDefault = [
  {
    id: "true",
    label: "True",
    selected: false,
  },
  {
    id: "false",
    label: "False",
    selected: false,
  },
];

const DemoFieldSelect = () => {
  const [readOnly, setReadOnly] = React.useState(false);
  const [value, setValue] = React.useState(valueDefault);
  const [menu, setMenu] = React.useState(false);
  const [adIcon, setAdIcon] = React.useState(false);
  const [adAvatar, setAdAvatar] = React.useState(false);
  const [adElement, setAdElement] = React.useState(false);

  const onChange = React.useCallback((newItem, newItems) => {
    setValue(newItems);
    action("onChange")(newItem, newItems);
  }, []);
  const onClear = React.useCallback(() => setValue(valueDefault), []);
  const onSetTrue = React.useCallback(() => {
    setValue(valueDefault.map((x) => ({ ...x, selected: x.id === "true" })));
  }, []);
  const onReadOnly = React.useCallback(() => setReadOnly(!readOnly), [
    readOnly,
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
      <FieldSelect
        label="FieldBoolean"
        value={value}
        style={style}
        onChange={onChange}
        readOnly={readOnly}
        itemsSelectedMaxLength={1}
        menu={menu ? menuItems : []}
        adornmentIcon={adIcon ? adornmentIcon : undefined}
        adornmentAvatar={adAvatar ? adornmentAvatar : undefined}
        adornmentElement={adElement ? adornmentElement : undefined}
      />
      <Paper>
        <BtnEdit label="Clear input" onClick={onClear} />
        <BtnEdit label="Set True" onClick={onSetTrue} />
        <BtnCheck label="readOnly" check={readOnly} onClick={onReadOnly} />
        <BtnCheck label="menu" check={menu} onClick={onMenu} />
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

export default DemoFieldSelect;
