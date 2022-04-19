import { IProduct } from "../../../../../interfaces";

export enum ACT_FIELD {
  OPEN = "OPEN",
  SEARCHING = "SEARCH",
  SEARCH_INPUT = "SEARCH_INPUT",
  SEARCH_ITEMS = "SEARCH_ITEMS",
}

interface IReducer {
  open: boolean;
  searching: boolean;
  searchInput: string;
  searchItems: IProduct[];
  searchTotal: number;
}

export const reducerInitState: IReducer = {
  open: false,
  searching: false,
  searchInput: "",
  searchItems: [],
  searchTotal: 0,
};

export const reducer = (state: IReducer, action): IReducer => {
  const newState = { ...state };
  switch (action.type) {
    case ACT_FIELD.OPEN:
      if (newState.open) return reducerInitState;
      newState.open = true;
      return newState;
    case ACT_FIELD.SEARCHING: {
      const { searchInput, searchItems } = newState;
      const searchIds = searchItems.map((x) => x.id).sort();
      const needSearchItems = action.valuedIds !== JSON.stringify(searchIds);
      newState.searching = !searchInput && needSearchItems;
      return newState;
    }
    case ACT_FIELD.SEARCH_INPUT:
      newState.searchInput = action.value;
      newState.searching = true;
      return newState;
    case ACT_FIELD.SEARCH_ITEMS:
      newState.searchItems = action.items || reducerInitState.searchItems;
      newState.searchTotal = action.total || reducerInitState.searchTotal;
      newState.searching = false;
      return newState;
    default:
      return newState;
  }
};
