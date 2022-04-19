import * as React from "react";
import Btn from "../../componentsBase/Btn";
import { PopoverOrigin } from "@material-ui/core/Popover/Popover";
import { ACT_VPORT } from "./reducer";
import { IItemEs, ICategory } from "../../interfaces";
import { colorTheme } from "../../constants";

const ORIGIN_ANCHOR: PopoverOrigin = {
  vertical: "bottom",
  horizontal: "left",
};
const ORIGIN_TRANSFORM: PopoverOrigin = {
  vertical: "top",
  horizontal: "left",
};

const getMenuIcon = (active: boolean) => ({
  active,
  icon: active ? "radio_button_checked" : "radio_button_unchecked",
  styleIcon: active ? { color: colorTheme } : {},
});
const style: React.CSSProperties = {
  padding: "0px 5px 0 8px",
  borderRadius: 5,
};

interface ISelectLanguage {
  items: IItemEs<ICategory>[];
  language: string;
  dispatchViewport: React.Dispatch<unknown>;
}

const SelectLanguage = ({
  items,
  language,
  dispatchViewport,
}: ISelectLanguage) => {
  const langs: string[] = items.reduce((acc, c) => {
    Object.keys(c.data.labels).forEach((l) => {
      if (!new Set(acc).has(l)) acc.push(l);
    });
    return acc;
  }, []);

  const onClick = React.useCallback(
    (event, value: string) => {
      dispatchViewport({ type: ACT_VPORT.LANGUAGE, value });
    },
    [dispatchViewport]
  );

  if (langs.length < 2) return null;

  return (
    <Btn
      style={style}
      tooltip="Select Language"
      icon="flag"
      label={language.toLocaleUpperCase()}
      menu={{
        anchorOrigin: ORIGIN_ANCHOR,
        transformOrigin: ORIGIN_TRANSFORM,
        items: langs.map((l) => ({
          id: l,
          label: l.toLocaleUpperCase(),
          onClick,
          ...getMenuIcon(l === language),
        })),
      }}
    />
  );
};

export default SelectLanguage;
