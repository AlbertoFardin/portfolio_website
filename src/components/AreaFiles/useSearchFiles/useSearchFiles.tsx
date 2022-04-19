import * as React from "react";
import { useAsyncAbortable } from "react-async-hook";
import useConstant from "use-constant";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { getFiles, getTags } from "../../../api/fetchesApi";
import {
  ISearchFiles,
  ISearchFilesResult,
  SEARCH_EMPTY,
  SEARCH_ERROR,
} from "./ISearch";
import getParams from "./getParams";

const search = async ({
  userId,
  pathId,
  filters,
  filtersConditions,
  filtersThisFolder,
  paginationValue,
  paginationSize,
  sort,
}: ISearchFiles): Promise<ISearchFilesResult> => {
  try {
    const size = paginationSize;
    const from = paginationSize * (paginationValue - 1);
    const aggregationsTag = await getTags();
    const aggregations = [aggregationsTag];
    const res = await getFiles(
      getParams({
        size,
        from,
        sort,
        pathId,
        filters,
        filtersConditions,
        filtersThisFolder,
      })
    );

    return {
      success: true,
      ...res,
      aggregations,
      queryPathId: pathId,
      queryUserId: userId,
    };
  } catch (err) {
    return SEARCH_ERROR;
  }
};

interface IResultHook {
  loading: boolean;
  status: string;
  error?: Error;
  result?: ISearchFilesResult;
}
const useSearchFiles = (a: ISearchFiles) => {
  const [searchTime, setSearchTime] = React.useState(null);
  const debounceSearchDocs = useConstant(() =>
    AwesomeDebouncePromise(search, 300)
  );
  const searchRes: IResultHook = useAsyncAbortable(
    async (abortSignal, argDocs) => {
      if (argDocs === null) return SEARCH_EMPTY;
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

export default useSearchFiles;
