import * as React from "react";
import FieldSelect, {
  IFieldSelectItem,
} from "../../../../componentsBase/Field/FieldSelect";
import { ACT_DETAIL } from "../reducer";
import getFieldProps from "./getProps";
import IForm from "./IForm";
import { ContextDispatchDetail } from "../../contexts";

const idYes = "idYes";
const idNo = "idNo";

interface IFormBoolean extends IForm {
  value: boolean;
}

const FormBoolean = ({
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
}: IFormBoolean) => {
  const dispatchDetail = React.useContext(ContextDispatchDetail);
  const onChange = React.useCallback(
    (newItem: IFieldSelectItem, newItems: IFieldSelectItem[]) => {
      const itemSelected = newItems.find((n) => n.selected);
      dispatchDetail({
        type: ACT_DETAIL.EDITING_KEY_VALUE,
        attributeKey,
        attributeValue: !itemSelected ? undefined : itemSelected.id === idYes,
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
    <FieldSelect
      itemsSelectedMaxLength={1}
      value={[
        {
          id: idYes,
          label: "Yes",
          selected: value === true,
        },
        {
          id: idNo,
          label: "No",
          selected: value === false,
        },
      ]}
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

export default FormBoolean;
