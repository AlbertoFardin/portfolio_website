import { IItem } from "../../../componentsBase/Facets/FacetMultiSelection/IFacetMultiSelection";
import { missingKey } from "../../../constants";
import { IAggregationItem } from "../../../interfaces";
import concat from "lodash-es/concat";

export const checkMultiCatalog = ({
  multiCatalog,
  multiLanguage,
  catalogId,
  languageId,
}): boolean => {
  if (multiCatalog) return !!catalogId;
  if (multiLanguage) return !!languageId;
  return true;
};

export const prepareAggs = (aggs: IAggregationItem[]): IItem[] => {
  return aggs.reduce((acc, { key }) => {
    if (key === missingKey) {
      const itemUp = {
        id: missingKey,
        label: "No value",
      };
      return concat(itemUp, acc);
    } else {
      const itemUp = {
        id: key,
        label: key,
      };
      return concat(acc, itemUp);
    }
  }, [] as IItem[]);
};

export enum ACTION {
  SEARCH = "SEARCH",
  OPTION = "OPTION",
}

interface IReducerState {
  options: IItem[];
  optionsMore: number;
  inputValue: string;
}

export const reducerInitState: IReducerState = {
  options: [],
  optionsMore: 0,
  inputValue: "",
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACTION.SEARCH:
      newState.inputValue = action.inputValue;
      return newState;
    case ACTION.OPTION:
      newState.optionsMore = action.optionsMore || reducerInitState.optionsMore;
      newState.options = action.options || reducerInitState.options;
      return newState;
    default:
      console.error("FacetSearchDictionaries", action);
      return state;
  }
};

export default reducer;
