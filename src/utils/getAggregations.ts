import isEmpty from "lodash-es/isEmpty";
import {
  IAggregation,
  IAggregationItem,
  IFilter,
  ISearchEs,
  IResultEs,
} from "../interfaces";
import getAggs from "./getAggs";

export const getAggsItems = (
  id: string,
  items: IAggregationItem[]
): IAggregationItem[] => {
  if (isEmpty(items)) return items;

  const keySort = `${id}weight`;

  // if has keySort, need to sort
  const aggsItems = !items[0][keySort]
    ? items
    : items.sort((a, b) => {
        try {
          const aKey = a[keySort].buckets[0].key;
          const bKey = b[keySort].buckets[0].key;
          if (aKey > bKey) return 1;
          if (aKey < bKey) return -1;
          return 0;
        } catch {
          return 0;
        }
      });

  return aggsItems.map(({ key, doc_count }) => ({ key, doc_count }));
};

interface IGetAggregations {
  searchEs: (k: ISearchEs) => Promise<IResultEs>;
  include?: string | string[];
  filters?: IFilter[];
  catalogId?: string;
  languageId?: string;
}
const getAggregations = async ({
  searchEs,
  include,
  filters = [],
  catalogId = "",
  languageId = "",
}: IGetAggregations): Promise<IAggregation[]> => {
  const { aggregations } = await searchEs({
    size: 0,
    from: 0,
    aggs: getAggs({
      filters,
      include,
      catalogId,
      languageId,
    }),
  });

  return aggregations.map((f) => {
    const { id, items, sum_other_doc_count } = f;
    const itemsProcessed = getAggsItems(id, items);
    return {
      id,
      items: itemsProcessed,
      sum_other_doc_count,
    };
  });
};

export default getAggregations;
