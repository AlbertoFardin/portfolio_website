import * as React from "react";
import FieldRichEditor from "./FieldRichEditor";
import { action } from "@storybook/addon-actions";
import { IActions } from "../../ActionsMenu";
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
  "<p><strong>Lorem ipsum dolor</strong> <em>sit amet, consectetur adipiscing elit.</em>&nbsp;</p><ul><li>Vivamus accumsan lectus ut libero vulputate.</li></ul><p>Elementum felis aliquet. Fusce non tincidunt turpis, sit amet tincidunt magna. Nulla nec aliquam diam, eget gravida nisi. Nulla facilisis, dui lacinia sodales tristique, tellus magna bibendum enim, a tincidunt justo urna sit amet leo. Nulla facilisis nibh nec purus tempor, eu rutrum purus convallis. In sollicitudin velit urna, vitae iaculis justo fermentum in. Nam finibus augue nec elit varius, quis ultricies felis suscipit. Integer ac gravida risus. Sed vel urna vel mauris pellentesque interdum.</p><p>Elementum felis aliquet. Fusce non tincidunt turpis, sit amet tincidunt magna. Nulla nec aliquam diam, eget gravida nisi. Nulla facilisis, dui lacinia sodales tristique, tellus magna bibendum enim, a tincidunt justo urna sit amet leo. Nulla facilisis nibh nec purus tempor, eu rutrum purus convallis. In sollicitudin velit urna, vitae iaculis justo fermentum in. Nam finibus augue nec elit varius, quis ultricies felis suscipit. Integer ac gravida risus. Sed vel urna vel mauris pellentesque interdum.</p>";

enum ACTIONS {
  CHANGE_VALUE = "CHANGE_VALUE",
  SET_VALUE = "SET_VALUE",
  SAVE_START = "SAVE_START",
  SAVE_END = "SAVE_END",
  RESET = "RESET",
  READONLY = "READONLY",
  MENU = "MENU",
  AD_ICON = "AD_ICON",
  AD_AVATAR = "AD_AVATAR",
  AD_ELEMENT = "AD_ELEMENT",
}

interface IState {
  value: string;
  isSaving: boolean;
  readOnly: boolean;
  menu: IActions[];
  adIcon: boolean;
  adAvatar: boolean;
  adElement: boolean;
}

const stateInit: IState = {
  value: valueDefault,
  isSaving: false,
  readOnly: false,
  menu: [],
  adIcon: false,
  adAvatar: false,
  adElement: false,
};

const reducer = (state: IState, action): IState => {
  const newState = { ...state };
  switch (action.type) {
    case ACTIONS.CHANGE_VALUE:
      newState.value = action.value;
      return newState;
    case ACTIONS.SET_VALUE:
      newState.value = action.value;
      return newState;
    case ACTIONS.READONLY:
      newState.readOnly = !newState.readOnly;
      return newState;
    case ACTIONS.MENU:
      newState.menu = !newState.menu.length ? menuItems : [];
      return newState;
    case ACTIONS.AD_ICON:
      newState.adIcon = !newState.adIcon;
      return newState;
    case ACTIONS.AD_AVATAR:
      newState.adAvatar = !newState.adAvatar;
      return newState;
    case ACTIONS.AD_ELEMENT:
      newState.adElement = !newState.adElement;
      return newState;
    case ACTIONS.RESET:
      return stateInit;
    default:
      throw new Error();
  }
};

const Demo = () => {
  const [state, dispatch] = React.useReducer(reducer, stateInit);
  const {
    value,
    isSaving,
    readOnly,
    menu,
    adIcon,
    adAvatar,
    adElement,
  } = state;

  const onChange = React.useCallback((value: string) => {
    console.log("onChange", value);
    action("onChange")(value);
    dispatch({ type: ACTIONS.CHANGE_VALUE, value });
  }, []);
  const onFocus = React.useCallback(() => {
    console.log("onFocus");
    action("onFocus")();
  }, []);
  const setValueEmpty = React.useCallback(() => {
    dispatch({ type: ACTIONS.SET_VALUE, value: "" });
  }, []);
  const setValueProva = React.useCallback(() => {
    dispatch({ type: ACTIONS.SET_VALUE, value: "PROVA" });
  }, []);
  const setValueDefault = React.useCallback(() => {
    dispatch({ type: ACTIONS.SET_VALUE, value: valueDefault });
  }, []);
  const setValueBr = React.useCallback(() => {
    dispatch({ type: ACTIONS.SET_VALUE, value: "<p><br></p>" });
  }, []);
  const setValueNull = React.useCallback(() => {
    dispatch({ type: ACTIONS.SET_VALUE, value: null });
  }, []);
  const onReadOnly = React.useCallback(() => {
    dispatch({ type: ACTIONS.READONLY });
  }, []);
  const onMenu = React.useCallback(() => {
    dispatch({ type: ACTIONS.MENU });
  }, []);
  const onAdIcon = React.useCallback(() => {
    dispatch({ type: ACTIONS.AD_ICON });
  }, []);
  const onAdAvatar = React.useCallback(() => {
    dispatch({ type: ACTIONS.AD_AVATAR });
  }, []);
  const onAdElement = React.useCallback(() => {
    dispatch({ type: ACTIONS.AD_ELEMENT });
  }, []);

  return (
    <>
      <FieldRichEditor
        value={value}
        readOnly={readOnly || isSaving}
        label="FieldRichEditor"
        placeholder="Write here..."
        style={style}
        onChange={onChange}
        onFocus={onFocus}
        menu={menu}
        toolbarPosition="right"
        adornmentIcon={adIcon ? adornmentIcon : undefined}
        adornmentAvatar={adAvatar ? adornmentAvatar : undefined}
        adornmentElement={adElement ? adornmentElement : undefined}
      />
      <Paper>
        <BtnEdit label={"set value EMPTY string"} onClick={setValueEmpty} />
        <BtnEdit label={"set value PROVA"} onClick={setValueProva} />
        <BtnEdit label={"set value DEFAULT"} onClick={setValueDefault} />
        <BtnEdit label={"set value <p><br></p>"} onClick={setValueBr} />
        <BtnEdit label={"set value null"} onClick={setValueNull} />
        <BtnCheck check={readOnly} label="readOnly" onClick={onReadOnly} />
        <BtnCheck check={!!menu.length} label="menu" onClick={onMenu} />
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

export default Demo;
