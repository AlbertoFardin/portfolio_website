import * as React from "react";
import { IColumnSc } from "../../../../interfaces";
import FieldText from "../../../../componentsBase/Field/FieldText";
import { getValueString } from "../../../../componentsBase/StickyGrid";
import getFieldLabels from "./getFieldLabels";

interface IFieldReadOnly {
  className?: string;
  column: IColumnSc;
  value;
  catalogId?: string;
  languageId?: string;
  adornmentIcon?: string;
}

const FieldReadOnly = ({
  className,
  column,
  value,
  catalogId,
  languageId,
  adornmentIcon,
}: IFieldReadOnly) => {
  const { type, label, mandatory, multiCatalog, multiLanguage } = column;

  return (
    <FieldText
      readOnly
      className={className}
      label={getFieldLabels({
        label,
        multiCatalog,
        multiLanguage,
        catalogId,
        languageId,
        isDirty: false,
        isReady: false,
        isMandatory: mandatory,
      })}
      value={getValueString(value, type)}
      adornmentIcon={adornmentIcon}
    />
  );
};

export default FieldReadOnly;
