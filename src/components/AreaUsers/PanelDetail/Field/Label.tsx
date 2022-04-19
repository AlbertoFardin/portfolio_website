import * as React from "react";
import FieldLabel from "../../../DrawerDetail/FieldLabel";
import getLabel from "../../getLabel";
import { isRequired } from "../hasRequired";

interface ILabel {
  id: string;
  readOnly?: boolean;
}

const Label = ({ id, readOnly = false }: ILabel) => {
  return (
    <FieldLabel label={getLabel(id)} mandatory={!readOnly && isRequired(id)} />
  );
};

export default Label;
