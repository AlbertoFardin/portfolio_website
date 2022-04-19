import { FacetMultiSelection } from "../../../../componentsBase/Facets";
import * as React from "react";
import reducer, { reducerInitState, ACTION } from "./reducer";
import isEmpty from "lodash-es/isEmpty";
import { getTags } from "../../../../api/fetchesApi";
import { IFilter, ISearchEs, IResultEs } from "../../../../interfaces";
interface IFacetSearchTags extends IFilter {
  className?: string;
  onChange?: (a) => void;
  searchEs: (k: ISearchEs) => Promise<IResultEs>;
  catalogId: string;
  languageId: string;
}

const FacetSearchTags = ({
  id,
  label,
  subLabel,
  type,
  sortId,
  aggs = [],
  aggsMore = 0,
  value = [],
  onChange,
  searchEs,
  keyword,
  className,
  nested,
  disabled,
  disabledInfo,
}: IFacetSearchTags) => {
  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const { options, optionsMore, searchInput, searching } = state;
  const onSearch = React.useCallback((text: string) => {
    dispatch({ type: ACTION.SEARCH_START, value: text });
  }, []);

  React.useEffect(() => {
    if (!isEmpty(aggs) && !searchInput) {
      dispatch({ type: ACTION.SET_OPTIONS, aggs, aggsMore });
    }
  }, [aggs, aggsMore, searchInput]);

  React.useEffect(() => {
    (async () => {
      try {
        if (searching) {
          const res = await getTags(searchInput);
          const { items, sum_other_doc_count } = res;
          dispatch({
            type: ACTION.SET_OPTIONS,
            aggs: items,
            aggsMore: sum_other_doc_count,
          });
        }
      } catch (err) {
        console.log("⚠️ FacetSearchTags fetch error ", err);
        dispatch({ type: ACTION.SEARCH_STOP });
      }
    })();
  }, [id, keyword, searchEs, searchInput, searching, sortId, type, nested]);

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
      className={className}
      disabled={disabled}
      disabledInfo={disabledInfo}
      i18n={{
        moreResults: "more results...",
      }}
    />
  );
};

export default FacetSearchTags;
