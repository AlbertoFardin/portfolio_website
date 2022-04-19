import {
  INDEX_NAME,
  KEY_ENTITY_ID,
  MAX_PRODUCTS_SELECTABLE,
} from "../../../constants";
import getQuery from "./getQuery";
import getSort from "./getSort";
import apiUrls from "../../../api/endpoints";
import {
  ICatalog,
  IColumnSc,
  IContentSort,
  IFilter,
} from "../../../interfaces";
import { fetchCookieJwtWithRefreshToken } from "../../../api/fetchCookieJwt";

interface IFetchMaxEntityIds {
  columns: IColumnSc[];
  filters: IFilter[];
  catalogs: ICatalog[];
  catalogId: string;
  languageId: string;
  sortsContent: IContentSort[];
}

const fetchMaxEntityIds = async ({
  columns,
  filters,
  catalogs,
  catalogId,
  languageId,
  sortsContent,
}: IFetchMaxEntityIds): Promise<string[]> => {
  const sort = getSort({
    sortsContent,
    columns,
    catalogId,
    languageId,
  });
  const { url, method } = apiUrls.search;
  const query = getQuery({
    filters,
    columns,
    catalogs,
    indexIds: [],
    catalogId,
    languageId,
  });
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(INDEX_NAME.TABULAR),
    method,
    jsonBody: {
      track_total_hits: true,
      sort,
      from: 0,
      size: MAX_PRODUCTS_SELECTABLE,
      query,
      _source: false,
      fields: [KEY_ENTITY_ID],
    },
  });
  const ids = res.hits.hits.map((h) => h.fields.entityId[0]);
  return ids;
};

export default fetchMaxEntityIds;
