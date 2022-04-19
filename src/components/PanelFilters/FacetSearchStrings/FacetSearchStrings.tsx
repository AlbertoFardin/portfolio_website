import * as React from "react";
import {
  FacetMultiSelection,
  IFacetType,
} from "../../../componentsBase/Facets";
import getAggregations from "../../../utils/getAggregations";
import reducer, {
  reducerInitState,
  ACTION,
  prepareAggs,
  checkMultiCatalog,
} from "../FacetSearchDictionaries/reducer";
import { IFilter, ISearchEs, IResultEs } from "../../../interfaces";
import getProp from "../getFilterProp";

interface IFacetSearchStrings extends IFilter {
  className?: string;
  onChange?: (a) => void;
  searchEs: (k: ISearchEs) => Promise<IResultEs>;
  catalogId: string;
  languageId: string;
}

const FacetSearchStrings = (p: IFacetSearchStrings) => {
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
  } = p;

  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const { options, optionsMore, inputValue } = state;
  const onSearch = React.useCallback((inputValue: string) => {
    dispatch({ type: ACTION.SEARCH, inputValue });
  }, []);

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

          dispatch({
            type: ACTION.OPTION,
            options: prepareAggs(items),
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

export default FacetSearchStrings;
