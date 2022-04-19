import { INDEX_NAME } from "../../constants";
import { ISearchEs, IItemStagingArea } from "../../interfaces";
import { search } from "../../api/fetchesApi";
import { IElasticResult } from "../../utils/elasticsearch";

const searchES = async (
  p: ISearchEs
): Promise<IElasticResult<IItemStagingArea>> => {
  const res = await search<IItemStagingArea>({
    ...p,
    index: INDEX_NAME.STAGINGAREA,
  });
  return res;
};

export default searchES;
