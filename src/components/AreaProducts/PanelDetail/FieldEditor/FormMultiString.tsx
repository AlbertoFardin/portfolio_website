import * as React from "react";
import FieldMultiString from "../../../../componentsBase/Field/FieldMultiString";
import isEmpty from "lodash-es/isEmpty";
import createItem from "../../../../componentsBase/Field/FieldMultiString/createItem";
import { ACT_DETAIL } from "../reducer";
import getFieldProps from "./getProps";
import IForm from "./IForm";
import { ContextDispatchDetail } from "../../contexts";

interface IFormMultiString extends IForm {
  value: string[];
}

const FormMultiString = ({
  attributeKey,
  label,
  value = [],
  dirty = false,
  className,
  multiCatalog,
  multiLanguage,
  catalogId,
  languageId,
  isReady,
  btnReadyVisibled,
  btnReadyDisabled,
  btnResetVisibled,
  btnResetDisabled,
  mandatory = false,
  placeholderDifferentValues,
  readOnly = false,
  onMenuClose,
  onReadyClick,
  onReadyMouseHover,
  onResetClick,
  onResetMouseHover,
}: IFormMultiString) => {
  const dispatchDetail = React.useContext(ContextDispatchDetail);

  const onChange = React.useCallback(
    (item, items) => {
      const newValue = items.map((d) => d.label);
      dispatchDetail({
        type: ACT_DETAIL.EDITING_KEY_VALUE,
        attributeKey,
        attributeValue: isEmpty(newValue) ? undefined : newValue,
      });
    },
    [attributeKey, dispatchDetail]
  );
  const onClearValue = React.useCallback(() => {
    dispatchDetail({
      type: ACT_DETAIL.EDITING_KEY_CLEAN,
      attributeKey,
    });
  }, [attributeKey, dispatchDetail]);

  return (
    <FieldMultiString
      {...getFieldProps({
        label,
        className,
        dirty,
        multiCatalog,
        multiLanguage,
        catalogId,
        languageId,
        isReady,
        btnReadyVisibled,
        btnReadyDisabled,
        btnResetVisibled,
        btnResetDisabled,
        mandatory,
        placeholderDifferentValues,
        onClearValue,
        readOnly,
        onMenuClose,
        onReadyClick,
        onReadyMouseHover,
        onResetClick,
        onResetMouseHover,
      })}
      value={value !== null ? value.map(createItem) : []}
      onChange={onChange}
    />
  );
};

export default FormMultiString;
