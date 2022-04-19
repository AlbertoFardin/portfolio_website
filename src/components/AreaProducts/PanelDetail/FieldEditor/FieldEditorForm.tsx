import * as React from "react";
import * as Colors from "../../../../componentsBase/style/Colors";
import useStyles from "./useStyles";
import {
  IProduct,
  EditFieldType,
  IColumnSc,
  IReady,
  ContentType,
  DictionaryType,
  AttributeType,
  AttributeFamily,
} from "../../../../interfaces";
import { KEY_EDITED_ATTRIBUTES, KEY_READY } from "../../../../constants";
import FormText from "./FormText";
import FormDate from "./FormDate";
import FormBoolean from "./FormBoolean";
import FormTextarea from "./FormTextarea";
import FormMultiString from "./FormMultiString";
import FormDictionaryTypeA from "./FormDictionaryTypeA";
import FormDictionaryTypeB from "./FormDictionaryTypeB";
import FormDictionaryTypeE from "./FormDictionaryTypeE";
import FormCategory from "./FormCategory";
import FormLinks from "../FamilyAssociation/FieldLinks";
import checkValueConsistency from "./checkValueConsistency";
import { ContextPermissions } from "../../../contexts";
import permissionsCheck from "../../../../utils/permissionsCheck";
import PERMISSIONS from "../../../../permissions";
import classnames from "classnames";
import IForm from "./IForm";
import { IAssetdataDiffs, IAttributeSelector } from "../interfaces";
import getAttributeKey from "../../getAttributeKey";
import { ACT_FIELD } from "./reducer";
import { ACT_DETAIL } from "../reducer";
import { ContextDispatchDetail } from "../../contexts";
import FieldReadOnly from "./FieldReadOnly";
import { inScope } from "../filterColumns";

const isHighlight = (
  hightlightColor: string,
  hightlightLanguages: string[],
  languageId: string
): boolean =>
  !!hightlightColor &&
  (!languageId ? true : new Set(hightlightLanguages).has(languageId));

interface IFieldEditorForm {
  column: IColumnSc;
  assetdataMerge: IProduct;
  assetdataDirty?;
  assetdataDiffs?: IAssetdataDiffs;
  assetdataCount: number;
  dispatchField: React.Dispatch<unknown>;
  catalogId?: string;
  languageId?: string;
  hightlightColor: string;
  hightlightLanguages: string[];
  readOnly?: boolean;
}

const FieldEditorForm = ({
  column,
  assetdataMerge,
  assetdataDirty,
  assetdataDiffs,
  assetdataCount,
  dispatchField,
  catalogId = "",
  languageId = "",
  hightlightColor,
  hightlightLanguages,
  readOnly,
}: IFieldEditorForm) => {
  const dispatchDetail = React.useContext(ContextDispatchDetail);
  const permissions = React.useContext(ContextPermissions);

  const classes = useStyles({ hightlightColor, column });
  const className = classnames({
    [classes.field]: true,
    [classes.fieldHighlight]: isHighlight(
      hightlightColor,
      hightlightLanguages,
      languageId
    ),
  });

  const {
    id,
    label,
    editField,
    multiCatalog,
    multiLanguage,
    attributeName,
    attributeType,
    attributeFamily,
    exportable,
    mandatory,
  } = column;
  const canEdit =
    attributeFamily !== AttributeFamily.MASTER &&
    permissionsCheck({
      keys: [PERMISSIONS.seecommerce_edit_product_attributes],
      permissions,
    });
  const key = getAttributeKey(column, catalogId, languageId);

  const onMenuClose = React.useCallback(() => {
    dispatchField({ type: ACT_FIELD.RESET });
  }, [dispatchField]);
  const onResetMouseHover = React.useCallback(() => {
    dispatchField({
      type: ACT_FIELD.HIGHLIGHT_COLOR_RESET,
      languages: [languageId],
    });
  }, [dispatchField, languageId]);
  const onResetClick = React.useCallback(() => {
    const selector: IAttributeSelector = {
      attributeId: id,
      catalogId: multiCatalog ? catalogId : undefined,
      languages: multiLanguage ? [languageId] : undefined,
    };
    dispatchDetail({ type: ACT_DETAIL.SET_ATTRIBUTE_RESET, selector });
  }, [catalogId, dispatchDetail, id, languageId, multiCatalog, multiLanguage]);
  const onReadyMouseHover = React.useCallback(() => {
    dispatchField({
      type: ACT_FIELD.HIGHLIGHT_COLOR_READY,
      color: Colors.Cyan,
      languages: [languageId],
    });
  }, [dispatchField, languageId]);
  const onReadyClick = React.useCallback(() => {
    const selector: IAttributeSelector = {
      attributeId: id,
      catalogId: multiCatalog ? catalogId : undefined,
      languages: multiLanguage ? [languageId] : undefined,
    };
    dispatchDetail({ type: ACT_DETAIL.SET_ATTRIBUTE_READY, selector });
  }, [catalogId, dispatchDetail, id, languageId, multiCatalog, multiLanguage]);

  const dirty = !!Object.keys(assetdataDirty).find((k) => k === key);
  const value = dirty ? assetdataDirty[key] : assetdataMerge[key];

  // mostro gli attributi MASTER in readonly
  if (!editField) {
    return (
      <FieldReadOnly
        className={className}
        column={column}
        value={value}
        catalogId={catalogId}
        languageId={languageId}
      />
    );
  }

  const {
    type: fieldType,
    dictionaryType,
    dictionaryId,
    multiSelectable,
  } = editField;

  // per un cambio di configurazione degli attributi,
  // il valore dell'attributo potrebbe non essere consistente con il tipo
  if (!checkValueConsistency(fieldType, value)) {
    return (
      <FieldReadOnly
        className={className}
        column={column}
        value="Editing temporarily unavailable, please try later"
        adornmentIcon="warning"
        catalogId={catalogId}
        languageId={languageId}
      />
    );
  }

  if (!inScope(column, catalogId)) {
    return (
      <FieldReadOnly
        className={className}
        column={column}
        value="This attribute is not associated to selected catalog"
        catalogId={catalogId}
        languageId={languageId}
      />
    );
  }

  const isDirty = !!dirty;
  const differentValue: number =
    assetdataDiffs && assetdataDiffs[key] && assetdataDiffs[key].different
      ? assetdataDiffs[key].withValue
      : 0;
  const placeholderDifferentValues = !!differentValue
    ? `${differentValue} products with value saved`
    : "";
  const valueInitSaved = assetdataMerge[key] != undefined;

  const readys = assetdataMerge[KEY_READY] || [];
  const isReady = !!readys.find((r: IReady) => {
    const thisId = r.contentId === attributeName;
    const thisType = r.contentType === ContentType.ATTRIBUTE;
    if (multiCatalog) {
      const thisCatalog = r.catalog === catalogId;

      if (multiLanguage) {
        const thisLanguage = r.language === languageId;

        return thisId && thisType && thisCatalog && thisLanguage;
      }
      return thisId && thisType && thisCatalog;
    }
    return thisId && thisType;
  });

  const btnReadyVisibled =
    !dirty &&
    assetdataCount === 1 &&
    exportable &&
    !!catalogId &&
    permissionsCheck({
      keys: [PERMISSIONS.seecommerce_manage_attribute_ready],
      permissions,
    });
  const btnReadyDisabled = !(!isDirty && valueInitSaved && !isReady);

  const btnResetVisibled = !dirty && assetdataCount === 1;
  const btnResetDisabled = !assetdataMerge[KEY_EDITED_ATTRIBUTES].find((k) => {
    const checkName = k.name === attributeName;
    const checkType = attributeType === AttributeType.USER;
    const checkCatalog = !multiCatalog
      ? true
      : !!(k.catalog || []).find((c) => c === catalogId);
    const checkLanguage = !multiLanguage
      ? true
      : !!(k.language || []).find((l) => l === languageId);

    return checkName && checkType && checkCatalog && checkLanguage;
  });

  if (key === "product://?made_in_italy.(boolean).().()") {
    console.log({
      isReady,
      isDirty,
      valueInitSaved,
    });
  }

  const p: IForm = {
    attributeId: id,
    attributeKey: key,
    assetdataMerge,
    readOnly: !canEdit || readOnly,
    dirty: isDirty,
    value,
    label,
    multiCatalog,
    multiLanguage,
    catalogId,
    languageId,
    className,
    dispatchField,
    isReady,
    btnReadyVisibled,
    btnReadyDisabled,
    btnResetVisibled,
    btnResetDisabled,
    mandatory,
    placeholderDifferentValues,
    onReadyClick,
    onReadyMouseHover,
    onResetClick,
    onResetMouseHover,
    onMenuClose,
  };

  switch (fieldType) {
    case EditFieldType.MultiLinkField:
      return <FormLinks {...p} />;
    case EditFieldType.TextAreaField:
      return <FormTextarea {...p} />;
    case EditFieldType.TextField:
      return <FormText {...p} />;
    case EditFieldType.DateField:
      return <FormDate {...p} />;
    case EditFieldType.BooleanField:
      return <FormBoolean {...p} />;
    case EditFieldType.MultiStringField:
      return <FormMultiString {...p} />;
    case EditFieldType.CategoryField:
      return <FormCategory {...p} />;
    case EditFieldType.SelectField: {
      const pp = {
        ...p,
        label,
        multiSelectable,
        dictionaryType,
        dictionaryId,
      };

      switch (dictionaryType) {
        case DictionaryType.PLAIN:
          return <FormDictionaryTypeA {...pp} />;
        case DictionaryType.ENTRIES_BY_CATALOG:
          return <FormDictionaryTypeB {...pp} />;
        case DictionaryType.MULTI_LANGUAGE:
          return <FormDictionaryTypeE {...pp} />;
        default:
          return (
            <FieldReadOnly
              className={className}
              column={column}
              value={value}
              catalogId={catalogId}
              languageId={languageId}
            />
          );
      }
    }
    default:
      return (
        <FieldReadOnly
          className={className}
          column={column}
          value={value}
          catalogId={catalogId}
          languageId={languageId}
        />
      );
  }
};

export default FieldEditorForm;
