import * as React from "react";
import { useAsyncAbortable } from "react-async-hook";
import useConstant from "use-constant";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { IFileDetail, IFolder, ISort } from "../../interfaces";
import { searchFilesShared } from "../../api/fetchesApi";
import last from "lodash-es/last";
import { ISortOrder } from "../../componentsBase/StickyGrid";
import { getAggrElasticSorts } from "../../utils/elasticsearch";

const SORT_DEFAULT = [
  {
    id: "sortRankingType",
    order: ISortOrder.ASC,
  },
];

interface IUseSearchEs {
  folders: IFolder[];
  sort: ISort;
  paginationValue: number;
  paginationSize: number;
  link: string;
}

export interface IUseResultEs {
  success: boolean;
  items: IFileDetail[];
  itemsTotal: number;
  error?: string;
}

const SEARCH_ES_EMPTY: IUseResultEs = {
  success: false,
  items: [],
  itemsTotal: 0,
};

const searchEs = async ({
  folders,
  sort: sortCurrent,
  paginationValue,
  paginationSize,
  link,
}: IUseSearchEs): Promise<IUseResultEs> => {
  const sort = getAggrElasticSorts([].concat(SORT_DEFAULT, sortCurrent));
  const { items, itemsTotal, error } = await searchFilesShared({
    size: paginationSize,
    from: paginationSize * (paginationValue - 1),
    link,
    sort,
    parentFolder: last(folders).id,
  });
  return {
    success: true,
    items,
    itemsTotal,
    error,
  };
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
