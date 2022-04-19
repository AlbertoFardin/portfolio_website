import FieldText from "../../../../componentsBase/Field/FieldText";
import * as React from "react";
import { ContextDispatchDetail } from "../../contexts";
import { ACT_DETAIL } from "../reducer";
import getFieldProps from "./getProps";
import IForm from "./IForm";

interface IFormText extends IForm {
  value: string;
}

const FormText = ({
  attributeKey,
  label,
  value,
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
}: IFormText) => {
  const dispatchDetail = React.useContext(ContextDispatchDetail);

  const onChange = React.useCallback(
    (newValue: string) => {
      dispatchDetail({
        type: ACT_DETAIL.EDITING_KEY_VALUE,
        attributeKey,
        attributeValue: newValue || undefined,
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
    <FieldText
      value={value}
      onChange={onChange}
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
    />
  );
};

export default FormText;
