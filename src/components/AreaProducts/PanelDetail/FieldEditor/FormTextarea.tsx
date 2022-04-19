import * as React from "react";
import FieldRichEditor, {
  EMPTY_TAG,
} from "../../../../componentsBase/Field/FieldRichEditor";
import getFieldProps from "./getProps";
import { ACT_DETAIL } from "../reducer";
import IForm from "./IForm";
import { ContextDispatchDetail } from "../../contexts";

interface IFormTextarea extends IForm {
  value: string;
}

const FormTextarea = ({
  attributeKey,
  label,
  value,
  dirty,
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
  mandatory,
  placeholderDifferentValues,
  readOnly,
  onMenuClose,
  onReadyClick,
  onReadyMouseHover,
  onResetClick,
  onResetMouseHover,
}: IFormTextarea) => {
  const dispatchDetail = React.useContext(ContextDispatchDetail);

  const onChange = React.useCallback(
    (newValue: string) => {
      dispatchDetail({
        type: ACT_DETAIL.EDITING_KEY_VALUE,
        attributeKey,
        attributeValue: newValue === EMPTY_TAG ? undefined : newValue,
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
    <FieldRichEditor
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

export default FormTextarea;
