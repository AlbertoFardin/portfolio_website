import { IFacetType } from "../componentsBase/Facets";
import { IFilter } from "../interfaces";
import { missingKey } from "../constants";
import getAttributeKey from "../components/AreaProducts/getAttributeKey";

const size = 30;
const min_doc_count = 1;
const order = { _key: "asc" };
interface ITerms {
  field: string;
  missing: string;
  include: string | string[];
  nested?: {
    id: string;
    path: string;
  };
}
const terms = ({ field, missing, include, nested }: ITerms) => {
  if (nested) {
    return {
      nested: { path: nested.path },
      aggs: {
        [nested.id]: {
          terms: {
            field,
            size,
            min_doc_count,
            missing,
            order,
            include,
          },
        },
      },
    };
  }

  return {
    field,
    size,
    min_doc_count,
    missing,
    order,
    include,
  };
};
interface IGetAggs {
  filters?: IFilter[];
  include?: string | string[];
  catalogId?: string;
  languageId?: string;
}

const getAggs = ({
  filters = [],
  include,
  catalogId,
  languageId,
}: IGetAggs) => {
  return (filters || [])
    .filter((facet) => {
      const { multiCatalog, multiLanguage } = facet;
      const checkMultiCatalog = multiCatalog ? !!catalogId : true;
      const checkMultiLanguage = multiLanguage ? !!languageId : true;
      return checkMultiCatalog && checkMultiLanguage;
    })
    .reduce((acc, facet) => {
      const { id, type, sticky, sortId, keyword, nested } = facet;
      const attributeKey = getAttributeKey(facet, catalogId, languageId);

      switch (type) {
        case IFacetType.DICTIONARY:
        case IFacetType.CATEGORY:
        case IFacetType.MULTISELECTION:
        case IFacetType.SELECTION:
        case IFacetType.USERSELECTION:
          if (sticky) {
            acc[id] = {
              terms: terms({
                field: id,
                missing: missingKey,
                include,
              }),
              aggs: {
                [sortId]: {
                  terms: {
                    field: sortId,
                  },
                },
              },
            };
            break;
          }

          if (nested) {
            acc[id] = terms({
              field: keyword ? `${attributeKey}.keyword` : attributeKey,
              missing: missingKey,
              include,
              nested: {
                id,
                path: id.split(".")[0],
              },
            });
            break;
          }

          acc[id] = {
            terms: terms({
              field: keyword ? `${attributeKey}.keyword` : attributeKey,
              missing: missingKey,
              include,
            }),
          };
          break;
        case IFacetType.BOOLEAN:
          acc[id] = {
            terms: terms({
              field: attributeKey,
              missing: undefined,
              include,
            }),
          };
          break;
        default:
          break;
      }

      return acc;
    }, {});
};

export default getAggs;
