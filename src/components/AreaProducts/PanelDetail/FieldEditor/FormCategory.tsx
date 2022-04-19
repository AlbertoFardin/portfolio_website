import * as React from "react";
import FieldMultiString from "../../../../componentsBase/Field/FieldMultiString";
import ChipCategory from "../../../../componentsBase/ChipCategory";
import IForm from "./IForm";
import getProps from "./getProps";
import { ACT_DETAIL } from "../reducer";
import isEmpty from "lodash-es/isEmpty";
import { IAttributeSelector, IDialogCategory } from "../interfaces";
import getCategoryPath from "../../../AreaCategories/getCategoryPath";
import getCategoryData from "../../../AreaCategories/getCategoryData";
import {
  ContextCatalogs,
  ContextCategories,
  ContextDispatchDetail,
} from "../../contexts";
import { ACT_FIELD } from "./reducer";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";

const useStyles = makeStyles({
  formCategory: { minHeight: 80 },
});
interface IFormCategory extends IForm {
  value: { path: string; label: string }[];
}

const FormCategory = ({
  attributeId,
  attributeKey,
  dispatchField,
  label,
  value = [],
  className,
  multiCatalog,
  multiLanguage,
  catalogId,
  languageId,
  mandatory,
  dirty,
  readOnly,
  placeholderDifferentValues,
  isReady,
  btnReadyVisibled,
  btnReadyDisabled,
  btnResetVisibled,
  btnResetDisabled,
  onMenuClose,
}: IFormCategory) => {
  const classes = useStyles({});

  const dispatchDetail = React.useContext(ContextDispatchDetail);
  const categories = React.useContext(ContextCategories);
  const catalogs = React.useContext(ContextCatalogs);

  const catalog = catalogs.find((c) => c.id === catalogId);
  const languages = catalogs.find((c) => c.id === catalogId).languages;

  const onClick = React.useCallback(() => {
    dispatchDetail({
      type: ACT_DETAIL.SHOW_DIALOG_CATEGORY,
      data: {
        open: true,
        attributeId,
        attributeKey,
        label,
        catalogId,
      } as IDialogCategory,
    });
  }, [attributeId, attributeKey, catalogId, dispatchDetail, label]);
  const onChange = React.useCallback(
    (item, items) => {
      const newValue = items.map((d) => ({
        path: d.id,
        label: d.label,
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
      languages: languages,
    });
  }, [dispatchField, languages]);

  const renderChip = React.useCallback(
    ({ id, readOnly, onClick }) => {
      if (!id) return null;

      const category = getCategoryData({
        categoryDataId: id,
        categoryDataCatalog: catalogId,
        categories,
      });

      return (
        <ChipCategory
          key={id}
          id={id}
          label={category.data.labels[languageId]}
          tooltip={getCategoryPath({
            categoryId: category.id,
            languageId,
            categories,
          })}
          onRemove={readOnly ? undefined : onClick}
        />
      );
    },
    [catalogId, categories, languageId]
  );

  return (
    <FieldMultiString
      {...getProps({
        label,
        className: classnames([className, classes.formCategory]),
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
        id: d.path,
        label: d.label,
      }))}
      onClick={onClick}
      onChange={onChange}
      renderChip={renderChip}
      readOnlyInput
    />
  );
};

export default FormCategory;
