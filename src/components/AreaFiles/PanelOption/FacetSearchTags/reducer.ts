import { IItem } from "../../../../componentsBase/Facets/FacetMultiSelection/IFacetMultiSelection";
import { IAggregationItem } from "../../../../interfaces";
import concat from "lodash-es/concat";
import { missingKey } from "../../../../constants";

const prepareAggs = (aggs: IAggregationItem[]): IItem[] => {
  return aggs.reduce((acc, { key }) => {
    // set "No Value" as first element
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
  SEARCH_START = "SEARCH_START",
  SEARCH_STOP = "SEARCH_STOP",
  SET_OPTIONS = "SET_OPTIONS",
}

interface IReducerState {
  options: IItem[];
  optionsMore: number;
  searchInput: string;
  searching: boolean;
}

export const reducerInitState: IReducerState = {
  options: [],
  optionsMore: 0,
  searchInput: "",
  searching: false,
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACTION.SEARCH_START:
      newState.searchInput = action.value;
      newState.searching = true;
      return newState;
    case ACTION.SEARCH_STOP:
      newState.searching = false;
      return newState;
    case ACTION.SET_OPTIONS:
      newState.searching = false;
      newState.options = prepareAggs(action.aggs);
      newState.optionsMore = action.aggsMore;
      return newState;
    default:
      console.error("-> FacetSearch REDUCER ${}", action);
      return state;
  }
};

export default reducer;
