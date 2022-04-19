import * as React from "react";
import { useAsyncAbortable } from "react-async-hook";
import useConstant from "use-constant";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import {
  IItemStagingArea,
  IContentSort,
  IColumnSc,
  IFilter,
  IHashItemsSets,
  HASH_ITEMSSSETS,
  IHashColumnsSets,
  HASH_COLUMNSSETS,
  ISearchEs,
  IItemEs,
  FiltersCondition,
} from "../../interfaces";
import manageFetchErrors from "../../utils/manageFetchErrors";
import getQuery from "../AreaProducts/useSearchEs/getQuery";
import getSort from "../AreaProducts/useSearchEs/getSort";
import { IElasticResult } from "../../utils/elasticsearch";

// ottengo quei esDoc che:
// -> o hanno la key "mapping" valorizzata come array vuoto
// -> o non hanno key "mapping"
export const searchEsAdditionalQuery = [
  {
    bool: {
      must_not: {
        exists: {
          field: "mapping",
        },
      },
    },
  },
];

interface IUseSearchEs {
  history;
  searchEs: (k: ISearchEs) => Promise<IElasticResult<IItemStagingArea>>;
  columns: IColumnSc[];
  filters: IFilter[];
  filtersCondition: FiltersCondition;
  paginationValue: number;
  paginationSize: number;
  hashColumnsSets: IHashColumnsSets;
  hashFiltersSets: IHashItemsSets;
  sortsContent: IContentSort[];
  itemsIdSelected?: string[];
  loadOnlySelected?: boolean;
}

export interface IUseResultEs {
  success: boolean;
  items: IItemEs<IItemStagingArea>[];
  itemsTotal: number;
  columns: IColumnSc[];
  filters: IFilter[];
  hashColumnsSets: IHashColumnsSets;
  hashFiltersSets: IHashItemsSets;
  sortsContent: IContentSort[];
}

const SEARCH_ES_EMPTY: IUseResultEs = {
  success: false,
  items: [],
  itemsTotal: 0,
  columns: [],
  filters: [],
  hashColumnsSets: HASH_COLUMNSSETS,
  hashFiltersSets: HASH_ITEMSSSETS,
  sortsContent: [],
};

const searchEs = async ({
  history,
  searchEs,
  columns,
  filters,
  filtersCondition,
  paginationValue,
  paginationSize,
  hashColumnsSets,
  hashFiltersSets,
  sortsContent,
  itemsIdSelected,
  loadOnlySelected = false,
}: IUseSearchEs): Promise<IUseResultEs> => {
  const fn = async (): Promise<IUseResultEs> => {
    const newHashColumnsSets = hashColumnsSets;
    const newHashFiltersSets = hashFiltersSets;

    const sort = getSort({
      sortsContent,
      columns,
      catalogId: "",
      languageId: "",
    });

    const searchOptions = loadOnlySelected
      ? {
          sort,
          query: getQuery({
            indexIds: loadOnlySelected ? itemsIdSelected : [],
          }),
        }
      : {
          sort,
          size: paginationSize,
          from: paginationSize * (paginationValue - 1),
          query: getQuery({
            conditionsAdditional: searchEsAdditionalQuery,
            filters,
            filtersCondition,
            columns,
            indexIds: loadOnlySelected ? itemsIdSelected : [],
          }),
        };

    // get grid items filtered
    const { items, itemsTotal } = await searchEs(searchOptions);

    return {
      success: true,
      items,
      itemsTotal,
      columns,
      filters,
      hashColumnsSets: newHashColumnsSets,
      hashFiltersSets: newHashFiltersSets,
      sortsContent,
    };
  };

  const res = await manageFetchErrors({
    fetch: fn,
    history,
  });

  return res || SEARCH_ES_EMPTY;
};

interface IReturnHook {
  loading: boolean;
  status: string;
  error?: Error;
  result?: IUseResultEs;
}

const useSearchEs = (a: IUseSearchEs) => {
  const [searchTime, setSearchTime] = React.useState(null);
  const debounceSearchDocs = useConstant(() =>
    AwesomeDebouncePromise(searchEs, 300)
  );
  const searchRes: IReturnHook = useAsyncAbortable(
    async (abortSignal, argDocs) => {
      if (argDocs === null) {
        return SEARCH_ES_EMPTY;
      }
      return debounceSearchDocs(a);
    },
    [searchTime]
  );
  return {
    searchTime,
    setSearchTime,
    searchRes,
  };
};

export default useSearchEs;
