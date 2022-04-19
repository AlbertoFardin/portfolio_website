import * as React from "react";
import FacetTextarea from "./FacetTextarea";
import Btn from "../../Btn";
import IFacetType from "../IFacetType";
import { action } from "@storybook/addon-actions";

const FacetTextareaDemo = () => {
  const [value, setValue] = React.useState("");
  const [caseSensitive, setCaseSensitive] = React.useState(true);
  const [disabled, setDisabled] = React.useState(false);
  const [subLabel, setSubLabel] = React.useState(false);
  const onChange = React.useCallback((v) => {
    setValue(v.value);
    action("onChange")(v);
  }, []);
  const onClear = React.useCallback(() => setValue(""), []);
  const onSetCiao = React.useCallback(() => setValue("ciao👋"), []);
  const onDisabled = React.useCallback(() => setDisabled(!disabled), [
    disabled,
  ]);
  const onSubLabel = React.useCallback(() => setSubLabel(!subLabel), [
    subLabel,
  ]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <FacetTextarea
        type={IFacetType.TEXTAREA}
        value={value}
        showCaseSensitiveSwitch={true}
        caseSensitiveSwitch={caseSensitive}
        onCaseSensitiveSwitch={setCaseSensitive}
        onChange={onChange}
        id="facetTextarea"
        label="facetTextarea"
        cartridgeSplit
        style={{
          border: "1px solid #f00",
          width: 250,
        }}
        disabled={disabled}
        disabledInfo="Please enable to edit"
        subLabel={!subLabel ? undefined : "This is a sub-label"}
      />
      <Btn variant="bold" label="Clear input" onClick={onClear} />
      <Btn variant="bold" label="Set ciao👋" onClick={onSetCiao} />
      <Btn
        variant="bold"
        label={"disabeld: " + String(disabled)}
        onClick={onDisabled}
      />
      <Btn
        variant="bold"
        label={"subLabel: " + String(subLabel)}
        onClick={onSubLabel}
      />
    </div>
  );
};

export default FacetTextareaDemo;
