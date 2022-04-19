import * as React from "react";
import ILabel from "./ILabel";
import { ILabelPositionX, ILabelPositionY } from "./ILabelPosition";
import Label from "./Label";

const getLabels = (
  label: string | ILabel[] | React.ReactElement,
  readOnly: boolean
) => {
  if (!label) return null;
  if (Array.isArray(label))
    return label.map((l: ILabel) => (
      <Label key={l.id} {...l} readOnly={readOnly} />
    ));
  return (
    <Label
      id="label"
      label={label}
      positionX={ILabelPositionX.left}
      positionY={ILabelPositionY.top}
      readOnly={readOnly}
    />
  );
};

export default getLabels;
