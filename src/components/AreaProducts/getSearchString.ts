import {
  AREA_PRODUCTS,
  KEYPAR_ENTITY,
  KEYPAR_SHEET,
  KEYPAR_TAB,
  KEYPAR_IMG,
} from "../../constants";
import { AttributeFamily, SheetLayout } from "../../interfaces";

export const NO_VALUE = "-1";

interface IProductsQueryParams {
  entityId?: string;
  detailSheet?: SheetLayout;
  detailTabId?: string;
  detailImgId?: string;
}

const getSearchString = (
  { entityId, detailSheet, detailTabId, detailImgId }: IProductsQueryParams,
  queryString: string
): string => {
  const query = new URLSearchParams(queryString);
  const setQuery = (key, value, fallback) => {
    const newValue =
      value !== undefined
        ? value !== null
          ? value
          : fallback
        : query.get(key) || fallback;
    query.set(key, newValue);
  };

  setQuery(KEYPAR_ENTITY, entityId, NO_VALUE);
  setQuery(KEYPAR_SHEET, detailSheet, SheetLayout.CLOSED);
  setQuery(KEYPAR_TAB, detailTabId, AttributeFamily.ALL_ATTRIBUTES);
  setQuery(KEYPAR_IMG, detailImgId, NO_VALUE);

  return `/${AREA_PRODUCTS}/?${query.toString()}`;
};

export default getSearchString;
