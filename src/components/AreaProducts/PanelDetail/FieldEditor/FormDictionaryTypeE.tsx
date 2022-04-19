import * as React from "react";
import FieldMultiString from "../../../../componentsBase/Field/FieldMultiString";
import isEmpty from "lodash-es/isEmpty";
import { DictionaryType } from "../../../../interfaces";
import { ACT_DETAIL } from "../reducer";
import IForm from "./IForm";
import getFieldProps from "./getProps";
import { IAttributeSelector, IDialogDictionary } from "../interfaces";
import { ACT_FIELD } from "./reducer";
import { ContextCatalogs, ContextDispatchDetail } from "../../contexts";

interface IFormDictionaryTypeE extends IForm {
  value: { code: string; value: string }[];
  multiSelectable: boolean;
  dictionaryId: string;
  dictionaryType: DictionaryType;
}

const FormDictionaryTypeE = ({
  attributeId,
  attributeKey,
  label,
  value = [],
  dirty = false,
  className,
  dispatchField,
  multiCatalog,
  multiLanguage,
  catalogId,
  languageId,
  isReady,
  btnReadyVisibled,
  btnReadyDisabled,
  btnResetVisibled,
  btnResetDisabled,
  multiSelectable,
  dictionaryId,
  dictionaryType,
  mandatory = false,
  placeholderDifferentValues,
  readOnly = false,
  onMenuClose,
}: IFormDictionaryTypeE) => {
  const dispatchDetail = React.useContext(ContextDispatchDetail);
  const catalogs = React.useContext(ContextCatalogs);

  const catalog = catalogs.find((c) => c.id === catalogId);
  const languages = catalogs.find((c) => c.id === catalogId).languages;

  const onChange = React.useCallback(
    (item, items) => {
      const newValue = items.map((d) => ({
        code: d.id,
        value: d.label,
      }));
      languages.forEach((langId) => {
        dispatchDetail({
          type: ACT_DETAIL.EDITING_KEY_VALUE,
          attributeKey: attributeId + `.(${catalogId}).(${langId})`,
          attributeValue: isEmpty(newValue) ? undefined : newValue,
        });
      });
    },
    [attributeId, catalogId, dispatchDetail, languages]
  );
  const onClick = React.useCallback(() => {
    dispatchDetail({
      type: ACT_DETAIL.SHOW_DIALOG_DICTIONARY,
      data: {
        open: true,
        attributeId,
        attributeKey,
        label,
        multiSelectable,
        dictionaryId,
        dictionaryType,
        catalogId,
      } as IDialogDictionary,
    });
  }, [
    attributeId,
    attributeKey,
    catalogId,
    dictionaryId,
    dictionaryType,
    dispatchDetail,
    label,
    multiSelectable,
  ]);
  const onClearValue = React.useCallback(() => {
    languages.forEach((langId) => {
      dispatchDetail({
        type: ACT_DETAIL.EDITING_KEY_CLEAN,
        attributeKey: attributeId + `.(${catalogId}).(${langId})`,
      });
    });
  }, [attributeId, catalogId, dispatchDetail, languages]);
  const onReadyClick = React.useCallback(() => {
    const selector: IAttributeSelector = {
      attributeId,
      catalogId,
      languages,
    };
    dispatchDetail({ type: ACT_DETAIL.SET_ATTRIBUTE_READY, selector });
  }, [attributeId, catalogId, dispatchDetail, languages]);
  const onReadyMouseHover = React.useCallback(() => {
    dispatchField({
      type: ACT_FIELD.HIGHLIGHT_COLOR_READY,
      languages,
    });
  }, [dispatchField, languages]);
  const onResetClick = React.useCallback(() => {
    const selector: IAttributeSelector = {
      attributeId,
      catalogId,
    };
    dispatchDetail({ type: ACT_DETAIL.SET_ATTRIBUTE_RESET, selector });
  }, [attributeId, catalogId, dispatchDetail]);
  const onResetMouseHover = React.useCallback(() => {
    dispatchField({
      type: ACT_FIELD.HIGHLIGHT_COLOR_RESET,
      languages,
    });
  }, [dispatchField, languages]);

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
        onReadyLabel: `Ready all languages of ${catalog.displayName}`,
        onResetClick,
        onResetMouseHover,
        onResetLabel: `Reset all languages of ${catalog.displayName}`,
      })}
      value={(value || []).map((d) => ({
        id: d.code,
        label: d.value,
      }))}
      onChange={onChange}
      onClick={onClick}
      readOnlyInput
    />
  );
};

export default FormDictionaryTypeE;
