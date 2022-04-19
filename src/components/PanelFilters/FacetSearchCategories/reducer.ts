import { IItem } from "../../../componentsBase/Facets/FacetMultiSelection/IFacetMultiSelection";
import { missingKey } from "../../../constants";
import { ICategory, IItemEs } from "../../../interfaces";

const up = (t: string) => (t || "").toLocaleUpperCase();
const itemNoValue: IItem = {
  id: missingKey,
  label: "No value",
};

export enum ACTION {
  SET_OPTIONS = "SET_OPTIONS",
}

interface IReducerState {
  inputValue: string;
  options: IItem[];
}

export const reducerInitState: IReducerState = {
  inputValue: "",
  options: [itemNoValue],
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACTION.SET_OPTIONS: {
      const categories: IItemEs<ICategory>[] = action.categories;
      const catalogId: string = action.catalogId;
      const languageId: string = action.languageId;
      const inputValue: string =
        action.inputValue !== undefined
          ? action.inputValue
          : newState.inputValue;

      const newOptions = categories
        .filter(({ data }) => {
          const { catalog, labels } = data;
          const label = labels[languageId];

          const checkCatalog = catalog === catalogId;
          const checkLanguage = up(label).includes(up(inputValue));

          return checkCatalog && checkLanguage;
        })
        .map(({ data }) => {
          const { id, labels } = data;
          return { id, label: labels[languageId] };
        });

      newState.options = [].concat(itemNoValue, newOptions);
      newState.inputValue = inputValue;

      return newState;
    }
    default:
      console.error("FacetSearchCategories", action);
      return state;
  }
};

export default reducer;
