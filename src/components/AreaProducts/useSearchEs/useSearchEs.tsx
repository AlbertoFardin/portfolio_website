import * as React from "react";
import { useAsyncAbortable } from "react-async-hook";
import useConstant from "use-constant";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import manageFetchErrors from "../../../utils/manageFetchErrors";
import getQuery from "./getQuery";
import getSort from "./getSort";
import {
  IReturnHook,
  IUseResultEs,
  IUseSearchEs,
  SEARCH_ES_EMPTY,
} from "./ISearch";

const searchEs = async ({
  history,
  searchEs,
  catalogs,
  columns,
  filters,
  filtersCondition,
  paginationValue,
  paginationSize,
  sortsContent,
  itemsIdSelected,
  loadOnlySelected = false,
  itemIdFromUrl,
  detailFullscreen,
  catalogId,
  languageId,
}: IUseSearchEs): Promise<IUseResultEs> => {
  const fn = async (): Promise<IUseResultEs> => {
    const sort = getSort({
      sortsContent,
      columns,
      catalogId,
      languageId,
    });

    const searchOptions =
      itemIdFromUrl && detailFullscreen
        ? {
            query: getQuery({
              indexIds: [itemIdFromUrl],
            }),
          }
        : loadOnlySelected
        ? {
            sort,
            query: getQuery({
              indexIds: itemsIdSelected,
            }),
          }
        : {
            sort,
            size: paginationSize,
            from: paginationSize * (paginationValue - 1),
            query: getQuery({
              filtersCondition,
              filters,
              columns,
              catalogs,
              indexIds: [],
              catalogId,
              languageId,
            }),
          };

    // get grid items filtered
    const { items, itemsTotal } = await searchEs(searchOptions);

    return {
      success: true,
      items,
      itemsTotal,
      catalogs,
      columns,
      filters,
      sortsContent,
    };
  };

  const res = await manageFetchErrors({
    fetch: fn,
    history,
  });

  return res || SEARCH_ES_EMPTY;
};

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
