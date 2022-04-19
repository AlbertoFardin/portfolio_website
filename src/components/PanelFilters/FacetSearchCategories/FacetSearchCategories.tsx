import * as React from "react";
import { FacetMultiSelection } from "../../../componentsBase/Facets";
import reducer, { reducerInitState, ACTION } from "./reducer";
import { ContextCategories } from "../../AreaProducts/contexts";
import { IFilter } from "../../../interfaces";

interface IFacetSearch extends IFilter {
  className?: string;
  onChange?: (a) => void;
  catalogId: string;
  languageId: string;
}

const FacetSearchCategories = (p: IFacetSearch) => {
  const categories = React.useContext(ContextCategories);

  const {
    id,
    label,
    subLabel,
    type,
    value = [],
    onChange,
    className,
    disabled,
    disabledInfo,
    catalogId,
    languageId,
  } = p;
  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const { options } = state;

  const updateOptions = React.useCallback(
    (inputValue?: string) => {
      dispatch({
        type: ACTION.SET_OPTIONS,
        inputValue,
        categories,
        catalogId,
        languageId,
      });
    },
    [catalogId, categories, languageId]
  );

  React.useEffect(() => {
    if (!!categories.length && catalogId && languageId) {
      updateOptions();
    }
  }, [catalogId, categories.length, languageId, updateOptions]);

  return (
    <FacetMultiSelection
      id={id}
      type={type}
      label={label}
      subLabel={subLabel}
      onChange={onChange}
      onSearch={updateOptions}
      options={options}
      value={value}
      className={className}
      disabled={disabled}
      disabledInfo={disabledInfo}
    />
  );
};

export default FacetSearchCategories;
