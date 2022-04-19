import { action } from "@storybook/addon-actions";
import * as React from "react";
import TextField from "@material-ui/core/TextField";
import FieldMultiString from "./FieldMultiString";
import ChipCategory from "../../ChipCategory";
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
  { id: "apple", label: "apple" },
  { id: "banana", label: "banana" },
  { id: "curry", label: "curry" },
];
const renderChip = ({ id, label, readOnly, onClick }) => (
  <ChipCategory
    key={id}
    id={id}
    label={label}
    onRemove={readOnly ? undefined : onClick}
  />
);

const DemoFieldMultiString = () => {
  const [value, setValue] = React.useState(valueDefault);
  const [readOnly, setReadOnly] = React.useState(false);
  const [menu, setMenu] = React.useState(false);
  const [maxChips, setMaxChips] = React.useState(5);
  const [customChip, setCustomChip] = React.useState(false);
  const [adIcon, setAdIcon] = React.useState(false);
  const [adAvatar, setAdAvatar] = React.useState(false);
  const [adElement, setAdElement] = React.useState(false);
  const [readOnlyInput, setReadOnlyInput] = React.useState(false);

  const onCustomChip = React.useCallback(() => setCustomChip(!customChip), [
    customChip,
  ]);
  const onReadOnly = React.useCallback(() => setReadOnly(!readOnly), [
    readOnly,
  ]);
  const onMenu = React.useCallback(() => setMenu(!menu), [menu]);
  const onMaxChips = React.useCallback(
    (e) => setMaxChips(Number(e.target.value)),
    []
  );
  const onChange = React.useCallback((newItem, newItems) => {
    setValue(newItems);
    action("onChange")(newItem, newItems);
  }, []);
  const onSetValueDefault = React.useCallback(() => {
    setValue(valueDefault);
  }, []);
  const onSetValueMany = React.useCallback(() => {
    const valueMany = [];
    for (let i = 0; i < 35; i++) {
      const id = `item_${i}`;
      valueMany.push({ id, label: id });
    }
    setValue(valueMany);
  }, []);
  const onClear = React.useCallback(() => {
    setValue([]);
  }, []);
  const onAdIcon = React.useCallback(() => setAdIcon(!adIcon), [adIcon]);
  const onAdAvatar = React.useCallback(() => setAdAvatar(!adAvatar), [
    adAvatar,
  ]);
  const onAdElement = React.useCallback(() => setAdElement(!adElement), [
    adElement,
  ]);
  const onReadOnlyInput = React.useCallback(
    () => setReadOnlyInput(!readOnlyInput),
    [readOnlyInput]
  );

  return (
    <>
      <FieldMultiString
        label="FieldMultiString"
        value={value}
        style={style}
        onChange={onChange}
        onClick={action("onClick")}
        readOnly={readOnly}
        itemsSelectedMaxLength={maxChips}
        menu={menu ? menuItems : []}
        renderChip={customChip ? renderChip : undefined}
        adornmentIcon={adIcon ? adornmentIcon : undefined}
        adornmentAvatar={adAvatar ? adornmentAvatar : undefined}
        adornmentElement={adElement ? adornmentElement : undefined}
        readOnlyInput={readOnlyInput}
      />
      <Paper>
        <BtnEdit label="Clear input" onClick={onClear} />
        <BtnEdit label="Set default value" onClick={onSetValueDefault} />
        <BtnEdit label="Set many values" onClick={onSetValueMany} />
        <BtnCheck
          label="customChip"
          check={customChip}
          onClick={onCustomChip}
        />
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
        <BtnCheck
          check={readOnlyInput}
          label="readOnlyInput"
          onClick={onReadOnlyInput}
        />
        <TextField
          style={{ margin: 10 }}
          type="number"
          label="Max Chips"
          onChange={onMaxChips}
          defaultValue={maxChips}
        />
      </Paper>
    </>
  );
};

export default DemoFieldMultiString;
