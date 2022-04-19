import { IFacetType } from "../../../componentsBase/Facets";
import { IItem } from "../../../componentsBase/Facets/FacetMultiSelection";
import concat from "lodash-es/concat";
import isEmpty from "lodash-es/isEmpty";
import {
  IFilter,
  ICatalog,
  IColumnSc,
  FiltersCondition,
} from "../../../interfaces";
import { missingKey } from "../../../constants";
import getAttributeKey from "../getAttributeKey";
import escapeKeyEs from "../../../utils/escapeKeyEs";

export const concantValues = (
  id: string,
  values: string[],
  wildcard?: boolean,
  caseInsensitive = false
) => {
  const w = wildcard ? "*" : "";
  return values.map((v) => ({
    wildcard: {
      [id]: {
        value: `${w}${v}${w}`,
        case_insensitive: caseInsensitive,
      },
    },
  }));
};

const getEsConditionFilterSelection = (
  key: string,
  value: IItem[],
  nested?: {
    path: string;
    key: string;
  }
) => {
  let itemNoValueIsSelected = false;
  const itemsSelectedKey = (value || []).reduce((acc, item: IItem) => {
    const { id } = item;

    if (id === missingKey) {
      itemNoValueIsSelected = true;
    } else {
      acc.push(id);
    }

    return acc;
  }, []);

  if (isEmpty(itemsSelectedKey) && !itemNoValueIsSelected) return null;

  let valuesConditions = [];

  if (!!nested) {
    itemsSelectedKey.forEach((k: string) => {
      valuesConditions.push({
        nested: {
          path: nested.path,
          query: { term: { [nested.key]: k } },
        },
      });
    });
    if (itemNoValueIsSelected) {
      valuesConditions.push({
        bool: {
          must_not: {
            nested: {
              path: nested.path,
              query: {
                wildcard: {
                  [nested.key]: {
                    value: "*",
                    case_insensitive: true,
                  },
                },
              },
            },
          },
        },
      });
    }
  } else {
    valuesConditions = concantValues(key, itemsSelectedKey);
    if (itemNoValueIsSelected) {
      valuesConditions.push({
        bool: { must_not: { exists: { field: key } } },
      });
    }
  }

  return { bool: { should: valuesConditions } };
};

export const getEsConditionFilters = (
  filter: IFilter,
  catalogId = "",
  languageId = ""
) => {
  const { type, value, nested, caseSensitive } = filter;
  const key = getAttributeKey(filter, catalogId, languageId);

  switch (type) {
    case IFacetType.TEXTAREA: {
      if (isEmpty(value)) return null;
      const values = concat(
        typeof value === "string" ? value : value.filter((x) => !!x)
      );
      return {
        bool: {
          should: concantValues(key, values, true, !caseSensitive),
        },
      };
    }
    case IFacetType.DATEPICKER: {
      const noDate = !value || value.startDate === null;
      if (noDate) return null;
      return {
        range: {
          [key]: {
            gte: value.startDate,
            lte: value.endDate,
          },
        },
      };
    }
    case IFacetType.PERCENTAGE: {
      if (!value) return null;
      const defaultCondition = {
        range: {
          [key]: {
            gte: value[0],
            lte: value[1],
          },
        },
      };

      if (!!value[0]) return defaultCondition;

      return {
        bool: {
          should: [
            defaultCondition,
            {
              bool: { must_not: { exists: { field: key } } },
            },
          ],
        },
      };
    }
    case IFacetType.BOOLEAN: {
      if (typeof value !== "boolean") return null;
      return {
        bool: {
          must: [
            {
              query_string: {
                query: `(${escapeKeyEs(key)}:${value})`,
              },
            },
          ],
        },
      };
    }
    case IFacetType.DICTIONARY: {
      return getEsConditionFilterSelection(key, value);
    }
    case IFacetType.CATEGORY: {
      return getEsConditionFilterSelection(key, value);
    }
    case IFacetType.USERSELECTION:
    case IFacetType.SELECTION:
    case IFacetType.MULTISELECTION: {
      const n = !nested
        ? undefined
        : {
            key,
            path: key.split(".")[0],
          };
      return getEsConditionFilterSelection(key, value, n);
    }
    default:
      return null;
  }
};

interface IGetQuery {
  conditionsAdditional?;
  itemsId?: string[];
  filtersCondition?: FiltersCondition;
  filters?: IFilter[];
  columns?: IColumnSc[];
  catalogs?: ICatalog[];
  indexIds?: string[];
  catalogId?: string;
  languageId?: string;
}

const getQuery = ({
  conditionsAdditional = [],
  filtersCondition = FiltersCondition.AND,
  filters = [],
  itemsId = [],
  indexIds = [],
  catalogId = "",
  languageId = "",
}: IGetQuery = {}) => {
  // condizioni di ricerca per array di id di documenti
  const conditionsItemsId = isEmpty(itemsId)
    ? []
    : [concantValues("id", itemsId)];

  // condizioni di ricerca con filtri a faccetta sticky
  const conditionsFacetedSticky = filters
    .filter((f) => f.sticky)
    .reduce((acc, facet) => {
      const condition = getEsConditionFilters(facet);
      if (condition) acc.push(condition);
      return acc;
    }, []);

  // condizioni di ricerca con filtri a faccetta
  const conditionsFacetedValued = filters
    .filter((f) => !f.sticky)
    .reduce((acc, facet) => {
      const condition = getEsConditionFilters(facet, catalogId, languageId);
      if (condition) acc.push(condition);
      return acc;
    }, []);
  const key = filtersCondition === FiltersCondition.AND ? "must" : "should";
  const conditionsFaceted = isEmpty(conditionsFacetedValued)
    ? []
    : [{ bool: { [key]: conditionsFacetedValued } }];

  // condizione per carcare per _id del documento
  const conditisionIndexIds = isEmpty(indexIds)
    ? []
    : [{ terms: { _id: indexIds } }];

  // concateno tutte le condizioni di ricerca
  const conditions = concat(
    conditionsItemsId,
    conditionsFacetedSticky,
    conditionsFaceted,
    conditionsAdditional,
    conditisionIndexIds
  );

  if (isEmpty(conditions)) return undefined;
  return { bool: { must: conditions } };
};

export default getQuery;
