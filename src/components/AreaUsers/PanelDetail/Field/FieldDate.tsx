import * as React from "react";
import FieldText from "./FieldText";
import formatHoursMinutes from "../../../../utils/formatHoursMinutes";

interface IFieldDate {
  id: string;
  value?: string;
}

const FieldDate = ({ id, value }: IFieldDate) => {
  return (
    <FieldText
      id={id}
      value={value ? formatHoursMinutes(value) : ""}
      readOnly
    />
  );
};

export default FieldDate;
