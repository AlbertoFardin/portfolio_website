import * as React from "react";
import FieldDate from "../../../../componentsBase/Field/FieldDate";
import * as moment from "moment";
import { ACT_DETAIL } from "../reducer";
import { DATE_FORMAT } from "../../../../constants";
import getFieldProps from "./getProps";
import IForm from "./IForm";
import { ContextDispatchDetail } from "../../contexts";

interface IFormDate extends IForm {
  value: number;
}

const FormDate = ({
  attributeKey,
  label,
  value,
  dirty = false,
  className,
  multiCatalog,
  multiLanguage,
  languageId,
  catalogId,
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
}: IFormDate) => {
  const dispatchDetail = React.useContext(ContextDispatchDetail);

  const onChange = React.useCallback(
    (newValue: number) => {
      dispatchDetail({
        type: ACT_DETAIL.EDITING_KEY_VALUE,
        attributeKey,
        attributeValue: !newValue
          ? undefined
          : moment(newValue).format("YYYY-MM-DD"),
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
    <FieldDate
      dateFormat={DATE_FORMAT}
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

export default FormDate;
