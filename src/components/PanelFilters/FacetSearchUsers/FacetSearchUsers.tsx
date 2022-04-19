import { FacetMultiSelection } from "../../../componentsBase/Facets";
import * as React from "react";
import { ContextM2ms, ContextUsers } from "../../contexts";
import getAggregations from "../../../utils/getAggregations";
import reducer, {
  reducerInitState,
  ACTION,
  prepareAggs,
} from "../FacetSearchDictionaries/reducer";
import getUser from "../../../utils/getUser";
import {
  IM2m,
  IUserProfile,
  IFilter,
  ISearchEs,
  IResultEs,
} from "../../../interfaces";
import { IItem } from "../../../componentsBase/Facets/FacetMultiSelection/IFacetMultiSelection";
import { missingKey } from "../../../constants";
import getProp from "../getFilterProp";

interface IFacetSearchUsers extends IFilter {
  className?: string;
  onChange?: (a) => void;
  searchEs: (k: ISearchEs) => Promise<IResultEs>;
  catalogId: string;
  languageId: string;
}

const up = (t: string) => (t || "").toLocaleUpperCase();
const prepareValue = (
  items: IItem[],
  users: IUserProfile[],
  m2ms: IM2m[]
): IItem[] =>
  items.map((c) => {
    const { id } = c;
    if (id === missingKey) return c;
    const { name } = getUser(id, { users, m2ms });
    return { id, label: name };
  });

const FacetSearchUsers = (p: IFacetSearchUsers) => {
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
  } = p;
  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const { options, optionsMore, inputValue } = state;

  const m2ms = React.useContext(ContextM2ms);
  const users = React.useContext(ContextUsers);

  const onSearch = React.useCallback((inputValue: string) => {
    dispatch({ type: ACTION.SEARCH, inputValue });
  }, []);

  const filters: IFilter[] = React.useMemo(() => [getProp(p)], [p]);

  React.useEffect(() => {
    (async () => {
      try {
        const usersIdMatched: string[] = !inputValue
          ? users.map(({ id }) => id)
          : users.reduce((acc, user) => {
              const { id, firstName, lastName } = user;
              const inputUp = up(inputValue);
              const matched =
                up(firstName).includes(inputUp) ||
                up(lastName).includes(inputUp);
              if (matched) acc.push(id);
              return acc;
            }, []);

        const [{ items, sum_other_doc_count }] = await getAggregations({
          include: usersIdMatched,
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
      } catch (err) {
        console.warn({ id: filters[0].id, err });
        dispatch({ type: ACTION.OPTION });
      }
    })();
  }, [catalogId, filters, inputValue, languageId, searchEs, users]);

  return (
    <FacetMultiSelection
      id={id}
      type={type}
      label={label}
      subLabel={subLabel}
      onChange={onChange}
      onSearch={onSearch}
      options={prepareValue(options, users, m2ms)}
      optionsMore={optionsMore}
      value={prepareValue(value, users, m2ms)}
      className={className}
      disabled={disabled}
      disabledInfo={disabledInfo}
      i18n={{
        moreResults: "more results...",
      }}
    />
  );
};

export default FacetSearchUsers;
