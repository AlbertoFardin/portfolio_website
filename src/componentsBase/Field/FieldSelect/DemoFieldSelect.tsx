import { action } from "@storybook/addon-actions";
import * as React from "react";
import TextField from "@material-ui/core/TextField";
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

const fruits = [
  {
    id: "apple",
    label: "apple",
    selected: false,
  },
  {
    id: "banana",
    label: "banana",
    selected: false,
  },
  {
    id: "orange",
    label: "orange",
    selected: false,
  },
  {
    id: "tomato",
    label: "tomato",
    selected: false,
  },
];
const fruits1 = [
  {
    id: "tomato",
    label: "tomato",
    selected: true,
  },
];
const fruits2 = [
  {
    id: "banana",
    label: "banana",
    selected: true,
  },
  {
    id: "tomato",
    label: "tomato",
    selected: true,
  },
];

const DemoFieldSelect = () => {
  const [readOnly, setReadOnly] = React.useState(false);
  const [value, setValue] = React.useState(fruits);
  const [menu, setMenu] = React.useState(false);
  const [max, setMax] = React.useState(3);
  const [adIcon, setAdIcon] = React.useState(false);
  const [adAvatar, setAdAvatar] = React.useState(false);
  const [adElement, setAdElement] = React.useState(false);

  const onChange = React.useCallback((newItem, newItems) => {
    console.log("onChange", newItem, newItems);
    setValue(newItems);
    action("onChange")(newItem, newItems);
  }, []);
  const onClear = React.useCallback(() => setValue(fruits), []);
  const onSet1 = React.useCallback(() => setValue(fruits1), []);
  const onSet2 = React.useCallback(() => setValue(fruits2), []);
  const onReadOnly = React.useCallback(() => setReadOnly(!readOnly), [
    readOnly,
  ]);
  const onChangeMax = React.useCallback(
    (e) => setMax(Number(e.target.value)),
    []
  );
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
        label="FieldSelect"
        value={value}
        style={style}
        onChange={onChange}
        readOnly={readOnly}
        itemsSelectedMaxLength={max}
        menu={menu ? menuItems : []}
        adornmentIcon={adIcon ? adornmentIcon : undefined}
        adornmentAvatar={adAvatar ? adornmentAvatar : undefined}
        adornmentElement={adElement ? adornmentElement : undefined}
      />
      <Paper>
        <BtnEdit label="Clear input" onClick={onClear} />
        <BtnEdit label='Set "Tomato"' onClick={onSet1} />
        <BtnEdit label='Set "Banana" + "Orange"' onClick={onSet2} />
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
        <TextField
          style={{ margin: 10 }}
          type="number"
          label="itemsSelectedMaxLength"
          onChange={onChangeMax}
          defaultValue={max}
        />
      </Paper>
    </>
  );
};

export default DemoFieldSelect;
