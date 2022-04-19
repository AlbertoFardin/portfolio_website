import * as React from "react";
import {
  FacetMultiSelection,
  IFacetType,
} from "../../../componentsBase/Facets";
import getAggregations from "../../../utils/getAggregations";
import reducer, {
  reducerInitState,
  ACTION,
  checkMultiCatalog,
} from "./reducer";
import { IFilter, ISearchEs, IResultEs, IColumnSc } from "../../../interfaces";
import { getDictionaries } from "../../../api/fetchesApi";
import { missingKey } from "../../../constants";
import { ATT_NO_LANG_ID } from "../../AreaProducts/PanelDetail/constants";
import { IItem } from "../../../componentsBase/Facets/FacetMultiSelection/IFacetMultiSelection";
import getProp from "../getFilterProp";

interface IFacetSearchDictionaries extends IFilter {
  className?: string;
  onChange?: (a) => void;
  searchEs: (k: ISearchEs) => Promise<IResultEs>;
  catalogId: string;
  languageId: string;
  column: IColumnSc;
}

const FacetSearchDictionaries = (p: IFacetSearchDictionaries) => {
  const {
    id,
    label,
    subLabel,
    type,
    value = [],
    onChange,
    searchEs,
    className,
    disabled,
    disabledInfo,
    catalogId,
    languageId,
    multiCatalog,
    multiLanguage,
    column,
  } = p;

  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const { options, optionsMore, inputValue } = state;
  const onSearch = React.useCallback((inputValue: string) => {
    dispatch({ type: ACTION.SEARCH, inputValue });
  }, []);

  const {
    editField: { dictionaryId, dictionaryType },
  } = column;

  const filters: IFilter[] = React.useMemo(() => [getProp(p)], [p]);

  React.useEffect(() => {
    (async () => {
      try {
        if (
          checkMultiCatalog({
            multiCatalog,
            multiLanguage,
            catalogId,
            languageId,
          })
        ) {
          const [{ items, sum_other_doc_count }] = await getAggregations({
            include: inputValue ? `.*${inputValue}.*` : undefined,
            searchEs,
            filters,
            catalogId,
            languageId,
          });

          const dictionaries = await getDictionaries({
            dictionaryId,
            dictionaryType,
            value: {
              [catalogId]: items
                .map((a) => a.key)
                .filter((key) => key !== missingKey),
            },
          });

          const options: IItem[] = items.map(({ key }) => {
            const dict = dictionaries.find((d) => d.code === key);
            const labelKey = multiLanguage ? languageId : ATT_NO_LANG_ID;
            return {
              id: key,
              label: dict?.value[labelKey] || "No value",
            };
          });

          dispatch({
            type: ACTION.OPTION,
            options,
            optionsMore: sum_other_doc_count,
          });
        }
      } catch (err) {
        console.warn({ id: filters[0].id, err });
        dispatch({ type: ACTION.OPTION });
      }
    })();
  }, [
    catalogId,
    dictionaryId,
    dictionaryType,
    filters,
    inputValue,
    languageId,
    multiCatalog,
    multiLanguage,
    searchEs,
  ]);

  return (
    <FacetMultiSelection
      id={id}
      type={type}
      label={label}
      subLabel={subLabel}
      onChange={onChange}
      onSearch={onSearch}
      options={options}
      optionsMore={optionsMore}
      value={value}
      valueMax={type === IFacetType.SELECTION ? 1 : undefined}
      className={className}
      disabled={disabled}
      disabledInfo={disabledInfo}
      i18n={{
        moreResults: "more results...",
      }}
    />
  );
};

export default FacetSearchDictionaries;
