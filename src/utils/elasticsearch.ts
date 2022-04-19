/* eslint-disable @typescript-eslint/no-explicit-any */
import { ISortType } from "../componentsBase/StickyGrid";
import isEmpty from "lodash-es/isEmpty";
import { IItemEs } from "../interfaces";

interface IElasticSrc {
  items: any[];
  otherCount: number;
  hits: {
    total: {
      value: number;
      relation: string;
    };
    hits: any[];
  };
  aggregations?: {
    aggr: {
      sum_other_doc_count: number;
      buckets: any;
    };
  };
  error: string;
}

export interface IElasticResult<T> {
  items: IItemEs<T>[];
  itemsTotal: number;
  aggregations: any[];
}

const getAggrItems = (aggr, facetKey) => {
  const items1 = aggr[facetKey][facetKey]?.buckets;
  if (!isEmpty(items1)) return items1;

  const items2 = aggr[facetKey].buckets;
  if (!isEmpty(items2)) return items2;

  return [];
};

const getAggregations = (aggr) => {
  return Object.keys(aggr).map((id) => {
    const { doc_count_error_upper_bound, sum_other_doc_count } = aggr[id];
    return {
      id,
      items: getAggrItems(aggr, id),
      doc_count_error_upper_bound,
      sum_other_doc_count,
    };
  });
};

const getElasticSrcAggregations = (elasticSrc: IElasticSrc): any[] => {
  const aggr = elasticSrc.aggregations;

  if (isEmpty(elasticSrc.aggregations)) return [];

  return getAggregations(aggr);
};

export const normalizeElasticSrc = <T>(
  elasticSrc: IElasticSrc
): IElasticResult<T> => {
  if (elasticSrc.error) {
    console.warn("⚠️normalizeElasticSrc", { elasticSrc });
    return {
      aggregations: [],
      itemsTotal: 0,
      items: [],
    };
  }

  return {
    aggregations: getElasticSrcAggregations(elasticSrc),
    itemsTotal: elasticSrc.hits.total.value,
    items: elasticSrc.hits.hits.map((o) => ({
      id: o._id,
      data: o._source,
    })),
  };
};

/**
 * aggregazione per la query su ElasticSearch del sorting
 */
export const getAggrElasticSorts = (sorts: ISortType[]) =>
  sorts.map((s) => ({
    [s.keyword ? `${s.id}.keyword` : s.id]: {
      order: s.order,
    },
  }));
