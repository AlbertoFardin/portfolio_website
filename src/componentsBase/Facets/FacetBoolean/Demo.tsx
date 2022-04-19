import * as React from "react";
import FacetBoolean from "./FacetBoolean";
import Btn from "../../Btn";
import IFacetType from "../IFacetType";

const FacetBooleanDemo = () => {
  const [value, setValue] = React.useState(undefined as boolean);
  const onChange = React.useCallback((r) => setValue(r.value), []);
  const onClear = React.useCallback(() => setValue(undefined), []);
  const onSetTrue = React.useCallback(() => setValue(true), []);
  const onSetFalse = React.useCallback(() => setValue(false), []);

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
      <FacetBoolean
        type={IFacetType.BOOLEAN}
        value={value}
        onChange={onChange}
        id="facetBoolean"
        label="facetBoolean"
        style={{
          border: "1px solid #f00",
          width: 250,
        }}
      />
      {`-> VALUE: ${value}`}
      <Btn variant="bold" label="Clear" onClick={onClear} />
      <Btn variant="bold" label="Set TRUE" onClick={onSetTrue} />
      <Btn variant="bold" label="Set FALSE" onClick={onSetFalse} />
    </div>
  );
};

export default FacetBooleanDemo;
