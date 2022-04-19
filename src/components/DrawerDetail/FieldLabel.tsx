import * as React from "react";

interface IFieldLabel {
  label: string;
  mandatory?: boolean;
}

const FieldLabel = ({ label, mandatory }: IFieldLabel) => (
  <>
    {label}
    {!mandatory ? null : (
      <span
        style={{
          color: "#ff0000",
          marginLeft: 2,
        }}
        children={"*"}
      />
    )}
  </>
);

export default FieldLabel;
