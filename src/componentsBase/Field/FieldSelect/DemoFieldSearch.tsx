import { action } from "@storybook/addon-actions";
import * as React from "react";
import TextField from "@material-ui/core/TextField";
import { urlImage, urlImage2, urlImage3 } from "../../__stories__/mediaUrls";
import FieldSelect, { IFieldSelectItem } from ".";
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

const DemoFieldSearch = () => {
  const [readOnly, setReadOnly] = React.useState(false);
  const [options, setOptions] = React.useState([] as IFieldSelectItem[]);
  const [value, setValue] = React.useState([] as IFieldSelectItem[]);
  const [menu, setMenu] = React.useState(false);
  const [searchingText, setSearchingText] = React.useState("");
  const [max, setMax] = React.useState(2);
  const [adIcon, setAdIcon] = React.useState(false);
  const [adAvatar, setAdAvatar] = React.useState(false);
  const [adElement, setAdElement] = React.useState(false);

  const onClose = React.useCallback(() => {
    setOptions([]);
    action("onChange")();
  }, []);
  const onChange = React.useCallback((newItem, newItems) => {
    console.log("onChange", newItem, newItems);
    setValue(newItems);
    action("onChange")(newItem, newItems);
  }, []);
  const onSearch = React.useCallback((text) => {
    console.log("onSearch", text);
    setSearchingText(text || "default");
    action("onSearch")(text);
  }, []);
  const onClear = React.useCallback(() => setValue(fruits), []);
  const onSet1 = React.useCallback(() => setValue(fruits1), []);
  const onSet2 = React.useCallback(() => setValue(fruits2), []);
  const onChangeMax = React.useCallback(
    (e) => setMax(Number(e.target.value)),
    []
  );
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

  React.useEffect(() => {
    if (searchingText) {
      setTimeout(() => {
        const newOptions = [urlImage, urlImage2, urlImage3].reduce(
          (acc, avatar, i) => {
            const v = `${searchingText}_${i}`;
            acc.push({
              id: v,
              label: v,
              selected: !!value.find(({ id }) => id === v),
              avatar,
            });
            return acc;
          },
          []
        );
        setOptions(newOptions);
        setSearchingText("");
      }, 1000);
    }
  }, [searchingText, value]);

  return (
    <>
      <FieldSelect
        label="FieldSearch"
        placeholder="Search..."
        loading={!!searchingText}
        value={value}
        options={options}
        style={style}
        searchable
        onClose={onClose}
        onChange={onChange}
        onSearch={onSearch}
        itemsSelectedMaxLength={max}
        menu={menu ? menuItems : []}
        readOnly={readOnly}
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

export default DemoFieldSearch;
