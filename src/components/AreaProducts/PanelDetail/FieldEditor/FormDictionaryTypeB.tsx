import FieldSelect, {
  IFieldSelectItem,
} from "../../../../componentsBase/Field/FieldSelect";
import * as React from "react";
import { ACT_DETAIL } from "../reducer";
import { searchDictionaries } from "../../../../api/fetchesApi";
import { IDictionary, DictionaryType } from "../../../../interfaces";
import getFieldProps from "./getProps";
import IForm from "./IForm";
import { ATT_NO_LANG_ID } from "../constants";
import { ContextDispatchDetail } from "../../contexts";

enum ACTIONS {
  SEARCH = "SEARCH",
  FOUND = "FOUND",
  RESET = "RESET",
}

interface IReducer {
  search: boolean;
  searchText: string;
  options: IDictionary[];
}

const ReducerDefault: IReducer = {
  search: false,
  searchText: "",
  options: [],
};

const reducer = (state: IReducer, action) => {
  const newState = { ...ReducerDefault };
  switch (action.type) {
    case ACTIONS.FOUND:
      newState.options = action.payload;
      return newState;
    case ACTIONS.SEARCH:
      newState.search = true;
      newState.searchText = action.payload;
      return newState;
    case ACTIONS.RESET:
      return newState;
    default:
      return state;
  }
};

const getFieldItems = (
  dicts: IDictionary[],
  values: IFieldSelectItem[],
  languageId: string
): IFieldSelectItem[] =>
  (dicts || []).map((d: IDictionary) => ({
    id: d.code,
    label: d.value[languageId || ATT_NO_LANG_ID],
    selected: !!values && !!values.find((sel) => sel.id === d.code),
  }));

const getValue = (
  dict: { code: string; value: string }[]
): IFieldSelectItem[] =>
  (dict || []).map(({ code, value }) => ({
    id: code,
    label: value,
    selected: true,
  }));

interface IFormDictionaryTypeB extends IForm {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any[];
  multiSelectable: boolean;
  dictionaryId: string;
  dictionaryType: DictionaryType;
}

const FormDictionaryTypeB = ({
  attributeKey,
  label,
  value: valueInit = [],
  dirty = false,
  className,
  multiSelectable = false,
  dictionaryId,
  dictionaryType,
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
}: IFormDictionaryTypeB) => {
  const dispatchDetail = React.useContext(ContextDispatchDetail);

  const value = getValue(valueInit);

  const [stateField, dispatchField] = React.useReducer(reducer, ReducerDefault);
  const { search, searchText, options } = stateField;
  const onChange = React.useCallback(
    (item: IFieldSelectItem, items: IFieldSelectItem[]) => {
      dispatchDetail({
        type: ACT_DETAIL.EDITING_KEY_VALUE,
        attributeKey,
        attributeValue: items.map(({ id, label }) => ({
          code: id,
          value: label,
        })),
      });
    },
    [attributeKey, dispatchDetail]
  );
  const onSearch = React.useCallback((text: string) => {
    dispatchField({ type: ACTIONS.SEARCH, payload: text });
  }, []);
  const onClose = React.useCallback(() => {
    dispatchField({ type: ACTIONS.RESET });
  }, []);
  const onClearValue = React.useCallback(() => {
    dispatchDetail({
      type: ACT_DETAIL.EDITING_KEY_CLEAN,
      attributeKey,
    });
  }, [attributeKey, dispatchDetail]);

  React.useEffect(() => {
    if (search) {
      (async () => {
        const dicts: IDictionary[] = await searchDictionaries({
          dictionaryId,
          dictionaryType,
          searchableValue: searchText,
          catalog: catalogId,
        });
        dispatchField({ type: ACTIONS.FOUND, payload: dicts });
      })();
    }
  }, [catalogId, dictionaryId, dictionaryType, search, searchText]);

  return (
    <FieldSelect
      itemsSelectedMaxLength={multiSelectable ? 1000 : 1}
      value={value}
      options={getFieldItems(options, value, languageId)}
      loading={!!search}
      searchable
      onChange={onChange}
      onClose={onClose}
      onSearch={onSearch}
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

export default FormDictionaryTypeB;
