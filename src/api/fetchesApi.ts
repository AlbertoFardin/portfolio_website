import isEmpty from "lodash-es/isEmpty";
import {
  ContentType,
  ICoordinates,
  ViewStatus,
  IDictionary,
  DictionaryType,
  ICatalog,
  IHashItemsSets,
  IReadySet,
  IAssignmentEntity,
  IAssignment,
  IAssignmentType,
  IAssignmentStatus,
  ITag,
  TagType,
  NotificationType,
  INotification,
  INPayloadMentionImgSc,
  INPayloadAssignment,
  INPayloadMentionImgDa,
  ViewCheck,
  ISearchEs,
  IDataModifiedView,
  IFileDetail,
  SharedRole,
  IMediaInfo,
  INPayloadSharedFile,
  IAggregation,
  ICategory,
  IItemEs,
  MediaType,
  XlsType,
  IColumnExportTmp,
  ICopyright,
  Service,
  IRequest,
  IPermissionData,
} from "../interfaces";
import { TYPE_FOLDER, FOLDER_ROOT_ID } from "../constants";
import escapeKeyEs from "../utils/escapeKeyEs";
import apiUrls from "./endpoints";
import itemsSetsDefault from "./itemsSetsDefault";
import { IDownloadItem } from "../components/AreaFiles/reducer";
import { FIELD_ID } from "../components/AreaFiles/constants";
import { IElasticResult, normalizeElasticSrc } from "../utils/elasticsearch";
import {
  ISearchFilesParams,
  IGetFilesReturn,
} from "../components/AreaFiles/useSearchFiles/ISearch";
import IUploadFile from "../components/Uploads/IUploadFile";
import getMimeType, {
  OCTET_STREAM_MIMETYPE,
} from "../components/Uploads/utils/getMimeType";
import sortCategories from "../components/AreaCategories/sortCategories";
import { fetchCookieJwtWithRefreshToken } from "./fetchCookieJwt";

const map = {
  [MediaType.VIDEO]: "video",
  [MediaType.IMAGE_P]: "post",
  [MediaType.IMAGE_S]: "shooting",
  [XlsType.UPLOAD_XLS_EDITOR]: "xlsx",
  [XlsType.UPLOAD_XLS_PRO]: "xlsxpro",
};

const defaultSearchRes = {
  items: [],
  itemsTotal: 0,
  aggregations: [],
};
interface ISearch extends ISearchEs {
  index: string;
  throwError?: boolean;
}

export const search = async <T>({
  index,
  aggs,
  from = 0,
  size = 500,
  sort = [],
  query,
  throwError = true,
}: ISearch): Promise<IElasticResult<T>> => {
  const { url, method } = apiUrls.search;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(index),
    method,
    jsonBody: {
      track_total_hits: true,
      aggs,
      from,
      size,
      sort,
      query,
    },
  });
  if (res.error === "Index not found for tenant") return defaultSearchRes;
  if (res.error === "Index not found") return defaultSearchRes;
  if (throwError && res.error) throw res;
  return normalizeElasticSrc<T>(res);
};

const getJsonCoordinates = (context: string): ICoordinates => {
  const coord = {
    product: process.env.PRODUCT_ID,
    environment: process.env.ENV,
    context,
  };
  return coord;
};

interface IUpsertJsonStore {
  coord: ICoordinates;
  payload;
  hash?: string;
}
const upsertJsonStore = async ({ coord, payload, hash }: IUpsertJsonStore) =>
  fetchCookieJwtWithRefreshToken({
    url: apiUrls.putJsonstore.url(),
    method: apiUrls.putJsonstore.method,
    jsonBody: {
      ...coord,
      payload,
      hash,
    },
  });

interface ISaveJsonConfigsSet<T> {
  docId: string;
  hash: string;
  saving?: boolean;
  itemsSets: T[];
}
export const saveJsonConfigsSet = async <T>({
  itemsSets,
  hash,
  docId,
}: ISaveJsonConfigsSet<T>): Promise<IHashItemsSets> => {
  const res = await upsertJsonStore({
    coord: getJsonCoordinates(docId),
    payload: itemsSets,
    hash,
  });
  return {
    hash: res.hash,
    itemsSets: res.payload,
    saving: false,
  };
};

interface IGetJsonConfigsSet {
  docId: string;
  itemsSetsDef?;
}
export const getJsonConfigsSet = async ({
  docId,
  itemsSetsDef = itemsSetsDefault(),
}: IGetJsonConfigsSet): Promise<{ hash: string; payload }> => {
  const coord = getJsonCoordinates(docId);
  const { url, method } = apiUrls.getJsonstore;
  try {
    const res = await fetchCookieJwtWithRefreshToken({
      url: url(coord),
      method,
    });
    return res;
  } catch (err) {
    if (err.status === 404) {
      const res = await upsertJsonStore({ coord, payload: itemsSetsDef });
      return res;
    }
    return err;
  }
};

interface IJsonDocument {
  hash: string;
  payload: { version: number; items };
}
interface IGetJsonDocument {
  docId: string;
  document: { version: number; items };
}
export const getJsonDocument = async ({
  docId,
  document,
}: IGetJsonDocument): Promise<IJsonDocument> => {
  const coord = getJsonCoordinates(docId);
  try {
    const res = await fetchCookieJwtWithRefreshToken({
      url: apiUrls.getJsonstore.url(coord),
      method: apiUrls.getJsonstore.method,
    });
    return res;
  } catch (err) {
    const res = await upsertJsonStore({
      coord,
      payload: document,
    });
    return res;
  }
};

interface ISaveJsonDocument {
  docId: string;
  hash: string;
  document: { version: number; items };
}
export const saveJsonDocument = async ({
  docId,
  hash,
  document,
}: ISaveJsonDocument): Promise<IJsonDocument> => {
  const coord = getJsonCoordinates(docId);
  const res = await upsertJsonStore({
    coord,
    payload: document,
    hash,
  });
  return res;
};

interface ISetReady {
  idType: ContentType;
  entityId: string;
  id: string;
  catalogs: string[] | Array<{ catalogName: string; languages: string[] }>;
  version: number;
}
export const setReady = async ({
  idType = ContentType.MEDIA,
  entityId,
  id,
  catalogs,
  version,
}: ISetReady) => {
  const mapIdTypeType = {
    [ContentType.MEDIA]: "media" as const,
    [ContentType.ATTRIBUTE]: "attribute" as const,
  };
  const { url, method } = apiUrls.postReady;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(mapIdTypeType[idType]),
    method,
    jsonBody: {
      idType,
      entityId,
      id,
      catalogs,
      version,
    },
  });
  return res;
};

export const deleteReady = async ({
  idType = ContentType.MEDIA,
  entityId,
  id,
  catalogs,
  version,
}: ISetReady) => {
  const mapIdTypeType = {
    [ContentType.MEDIA]: "media" as const,
    [ContentType.ATTRIBUTE]: "attribute" as const,
  };
  const { url, method } = apiUrls.deleteReady;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(mapIdTypeType[idType]),
    method,
    jsonBody: {
      idType,
      entityId,
      id,
      catalogs,
      version,
    },
  });
  return res;
};

export const getProduct = async (id: string) => {
  const { url, method } = apiUrls.getProduct;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(encodeURIComponent(id)),
    method,
  });
  return res;
};

interface ISetViews {
  entityId: string;
  view: string;
  status: ViewStatus;
  version: number;
}
export const setViews = async ({
  entityId,
  view,
  status,
  version,
}: ISetViews) => {
  const { url, method } = apiUrls.postViews;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      entityId,
      view,
      status,
      version,
    },
  });
  return res;
};

interface ISetViewCheck {
  entityId: string;
  viewName: string;
  check: ViewCheck;
  version: number;
}
export const setViewCheck = async ({
  entityId,
  viewName,
  check,
  version,
}: ISetViewCheck) => {
  const { url, method } = apiUrls.postViewCheck;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      entityId,
      viewName,
      check,
      version,
    },
  });
  return res;
};

interface ISearchExport {
  index: string;
  size: number;
  _source?;
  query?;
}
export const searchExport = async ({
  index,
  size,
  _source,
  query,
}: ISearchExport) => {
  const { url, method } = apiUrls.search;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(index),
    method,
    jsonBody: {
      size,
      _source,
      query,
    },
  });
  return res;
};

interface IExportData {
  headers: string[];
  rows: string[][];
  fileName: string;
}
export const exportData = async ({ headers, rows, fileName }: IExportData) => {
  const { url, method } = apiUrls.postExportData;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      headers,
      rows,
      fileName,
    },
  });
  return res;
};

interface IDownloadMediaContent {
  fileId: string;
  customName: string;
  path: string[];
}

interface IMassiveDownloadRenamed {
  correlationId: string;
  mediaContents: IDownloadMediaContent[];
  connectionId: string;
}
export const massiveDownloadRenamedSeecommerce = async ({
  correlationId,
  mediaContents,
  connectionId,
}: IMassiveDownloadRenamed) => {
  if (isEmpty(connectionId)) {
    throw { message: "Missing webSocket ID" };
  }

  if (isEmpty(correlationId)) {
    throw { message: "CorrelationId is empty" };
  }

  const { url, method } = apiUrls.massiveDownloadRenamed;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(Service.SEECOMMERCE),
    method,
    jsonBody: {
      correlationId,
      mediaContents,
      connectionUUID: connectionId,
    },
  });
  return res;
};

interface IMassiveDownloadFromDA {
  correlationId: string;
  downloadItems: IDownloadItem[];
  connectionId: string;
  currentFolders: Array<{ id: string; name: string }>;
}
interface IResponseDescend {
  id: string;
  name: string;
  mimetype: string;
  documentrepoid: string;
  path: Array<{ id: string; name: string }>;
}

export const massiveDownloadFromDA = async ({
  correlationId,
  downloadItems,
  connectionId,
  currentFolders,
}: IMassiveDownloadFromDA) => {
  if (isEmpty(connectionId)) {
    throw { message: "Missing webSocket ID" };
  }

  if (isEmpty(correlationId)) {
    throw { message: "CorrelationId is empty" };
  }

  let descendents: IResponseDescend[] = [];
  {
    const folders = downloadItems.filter((d) => d.mimeType === TYPE_FOLDER);
    const { url, method } = apiUrls.descendants;
    if (folders.length !== 0) {
      const result = await fetchCookieJwtWithRefreshToken({
        url: url(),
        method,
        jsonBody: {
          folders: folders.map((f) => f.id),
        },
      });
      descendents = (result.descendents as IResponseDescend[]).filter(
        (f) => f.mimetype !== TYPE_FOLDER
      );
    }
  }

  const folderIdsToRemove = new Set(currentFolders.map((c) => c.id));
  const mediaContentsFromDescendants: IDownloadMediaContent[] = descendents.map(
    (d) => ({
      fileId: d.documentrepoid,
      path: d.path
        .filter((o) => !folderIdsToRemove.has(o.id))
        .map((o) => o.name),
      customName: d.name,
    })
  );

  const filesInCurrentFolder = downloadItems.filter(
    (d) => d.mimeType !== TYPE_FOLDER
  );

  const mediaContentsInCurrentFolder: IDownloadMediaContent[] = filesInCurrentFolder.map(
    (f) => ({
      fileId: f.documentRepoId,
      path: [],
      customName: f.name,
    })
  );

  const { url, method } = apiUrls.massiveDownloadRenamed;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(Service.DIGITALASSETS),
    method,
    jsonBody: {
      correlationId,
      mediaContents: mediaContentsFromDescendants.concat(
        mediaContentsInCurrentFolder
      ),
      connectionUUID: connectionId,
    },
  });
  return res;
};

interface ISearchDictionaries {
  dictionaryId?: string;
  dictionaryType: DictionaryType;
  searchableValue?: string;
  catalog?: string;
  code?: string;
}

// LINK https://wardafactory.atlassian.net/wiki/spaces/SEEC/pages/1241939989/Dizionari
export const searchDictionaries = async ({
  dictionaryId = "",
  dictionaryType,
  searchableValue = "",
  catalog = "",
  code = "",
}: ISearchDictionaries): Promise<IDictionary[]> => {
  const { url, method } = apiUrls.searchDictionaries;
  const queryConditions = [];
  const queryConditionsSearch = [];

  if (!isEmpty(dictionaryId)) {
    queryConditions.push({
      term: { dictionaryId },
    });
  }
  if (!isEmpty(searchableValue)) {
    queryConditionsSearch.push({
      wildcard: {
        searchableValue: {
          value: `*${escapeKeyEs(searchableValue)}*`,
          case_insensitive: true,
        },
      },
    });
  }
  if (!isEmpty(code)) {
    queryConditionsSearch.push({
      wildcard: {
        code: {
          value: `*${escapeKeyEs(code)}*`,
          case_insensitive: true,
        },
      },
    });
  }
  if (!isEmpty(queryConditionsSearch)) {
    queryConditions.push({
      bool: { should: queryConditionsSearch },
    });
  }
  if (!isEmpty(dictionaryType)) {
    queryConditions.push({
      term: { dictionaryType },
    });
  }
  if (!isEmpty(catalog) && dictionaryType !== DictionaryType.PLAIN) {
    queryConditions.push({
      term: { catalog },
    });
  }

  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      from: 0,
      size: 1000,
      sort: [],
      query: {
        bool: {
          must: queryConditions,
        },
      },
    },
  });
  const { items } = normalizeElasticSrc<IDictionary>(res);
  return items.map(({ id, data }) => ({ id, ...data }));
};

interface IGetDictionaries {
  dictionaryId: string;
  dictionaryType: DictionaryType;
  value: {
    [catalogId: string]: string[];
  };
}
export const getDictionaries = async ({
  dictionaryId,
  dictionaryType,
  value,
}: IGetDictionaries): Promise<IDictionary[]> => {
  const { url, method } = apiUrls.searchDictionaries;

  const valueConditions = Object.keys(value).map((catalogId) => {
    const conditions = [];

    if (!!catalogId && dictionaryType !== DictionaryType.PLAIN) {
      conditions.push({ term: { catalog: catalogId } });
    }

    conditions.push({
      bool: {
        should: value[catalogId].map((code) => ({
          wildcard: {
            code: {
              value: code,
              case_insensitive: true,
            },
          },
        })),
      },
    });

    return { bool: { must: conditions } };
  });

  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      from: 0,
      size: 1000,
      sort: [],
      query: {
        bool: {
          must: [
            { term: { dictionaryId } },
            { term: { dictionaryType } },
            { bool: { should: valueConditions } },
          ],
        },
      },
    },
  });
  const { items } = normalizeElasticSrc<IDictionary>(res);
  return items.map(({ id, data }) => ({ id, ...data }));
};

export const searchCatalogs = async (): Promise<ICatalog[]> => {
  const { url, method } = apiUrls.searchCatalogs;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      from: 0,
      size: 1000,
      sort: [{ displayName: "asc" }],
    },
  });
  const { items } = normalizeElasticSrc<ICatalog>(res);
  return items.map(({ id, data }) => ({ id, ...data }));
};

interface ISearchCategories {
  root?: string;
  catalog?: string;
  searchableValue?: string;
}
export const searchCategories = async ({
  root,
  catalog,
  searchableValue,
}: ISearchCategories): Promise<{
  items: IItemEs<ICategory>[];
  itemsTotal: number;
}> => {
  try {
    const queryConditions = [];

    if (!!searchableValue) {
      queryConditions.push({
        wildcard: {
          searchableValue: {
            value: `*${escapeKeyEs(searchableValue)}*`,
            case_insensitive: true,
          },
        },
      });
    }

    if (!!catalog) {
      queryConditions.push({
        term: { catalog },
      });
    }

    if (!!root) {
      queryConditions.push({
        term: { root },
      });
    }

    const { url, method } = apiUrls.searchCategories;
    const res = await fetchCookieJwtWithRefreshToken({
      url: url(),
      method,
      jsonBody: {
        from: 0,
        size: 1000,
        sort: [],
        query: {
          bool: {
            must: queryConditions,
          },
        },
      },
    });

    const { items, itemsTotal } = normalizeElasticSrc<ICategory>(res);
    return {
      items: sortCategories(items),
      itemsTotal,
    };
  } catch (err) {
    console.warn("searchCategories", err);
    return {
      items: [],
      itemsTotal: 0,
    };
  }
};

export const multiReady = async (
  readySet: IReadySet[],
  contentType: ContentType
) => {
  const mapIdTypeType = {
    [ContentType.MEDIA]: "media" as const,
    [ContentType.ATTRIBUTE]: "attribute" as const,
  };
  const { url, method } = apiUrls.postMultiReady;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(mapIdTypeType[contentType]),
    method,
    jsonBody: {
      readySet,
    },
  });
  return res;
};

export const deleteMedias = async (
  idWithMediaTypeFiles: { id: string; mediatype: string }[]
) => {
  const { url, method } = apiUrls.deleteSeecommerceMedia;
  const res = await Promise.all(
    idWithMediaTypeFiles.map(({ id, mediatype }) =>
      fetchCookieJwtWithRefreshToken({
        url: url(id, map[mediatype]),
        method,
      })
    )
  );
  return res;
};

const checkAssignmentsDefault = (assignments: IAssignment[]): IAssignment[] => {
  return assignments.map((a) => ({
    ...a,
    catalogs: [],
    assignmentType: IAssignmentType.DEFAULT,
    status: IAssignmentStatus.DEFAULT,
  }));
};

export const assignEntity = async ({
  entityId,
  assignmentsToAdd = [],
  assignmentsToRemove = [],
  version,
}: IAssignmentEntity) => {
  const { url, method } = apiUrls.assignment;
  return await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      entityId,
      add: checkAssignmentsDefault(assignmentsToAdd),
      remove: checkAssignmentsDefault(assignmentsToRemove),
      version,
    },
  });
};

export const multiassignEntity = async (
  modifiedAssignments: IAssignmentEntity[]
) => {
  const { url, method } = apiUrls.multiAssignment;
  await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      modifiedAssignments: modifiedAssignments.map((m: IAssignmentEntity) => ({
        entityId: m.entityId,
        add: checkAssignmentsDefault(m.assignmentsToAdd),
        remove: checkAssignmentsDefault(m.assignmentsToRemove),
        version: m.version,
      })),
    },
  });
};

export const getMediaInfo = async (
  fileId: string,
  service: Service
): Promise<IMediaInfo> => {
  try {
    if (!fileId) return null;
    const { url, method } = apiUrls.getRendition;
    const firmedUrl = await fetchCookieJwtWithRefreshToken({
      url: url(fileId, service, "identify?redirect=false"),
      method,
    });
    const res = await fetch(firmedUrl, { method });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json = (await res.json()) as any;
    return json.image;
  } catch {
    return null;
  }
};

interface IPutCopyright extends ICopyright {
  fileIds?: string[];
  fileId?: string;
  correlationId: string;
}
export const putCopyright = async (jsonBody: IPutCopyright) => {
  const { url, method } = apiUrls.putCopyright;
  await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody,
  });
};

interface ISetDistribution {
  fileId: string;
  viewName: string;
  entityId: string;
  version: number;
  disable: boolean;
}
export const setDistribution = async ({
  fileId,
  viewName,
  entityId,
  version,
  disable,
}: ISetDistribution) => {
  const { url, method } = apiUrls.distributions;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      fileId,
      viewName,
      entityId,
      version,
      disable,
    },
  });
  return res;
};

export const setMultiViewData = async (modifyViews: IDataModifiedView[]) => {
  const { url, method } = apiUrls.multiViewData;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      modifyViews,
    },
  });
  return res;
};

export const resetViews = async (
  array: Array<{ entityId: string; version: number }>
) => {
  const { url, method } = apiUrls.multiResetViews;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      resetViews: array,
    },
  });
  return res;
};

interface IResetAttribute {
  entityId: string;
  attributeName: string;
  version: number;
  catalogId?: string;
  languageId?: string;
}
export const resetAttribute = async ({
  entityId,
  attributeName,
  version,
  catalogId,
  languageId,
}: IResetAttribute) => {
  const { url, method } = apiUrls.resetAttribute;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      entityId,
      attributeName,
      version,
      catalog: catalogId || undefined,
      language: languageId || undefined,
    },
  });
  return res;
};

interface ISearchFilesShared {
  size: number;
  from: number;
  link: string;
  parentFolder?: string;
  sort?;
}
export const searchFilesShared = async ({
  size,
  from,
  link,
  sort,
  parentFolder,
}: ISearchFilesShared) => {
  const { url, method } = apiUrls.searchFilesShared;
  const elasticSrc = await await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: { link, parentFolder, sort, size, from },
    additionalHeader: {
      Accept: "application/vnd.it.warda.brandgo.v2+json",
    },
  });
  try {
    const { items } = normalizeElasticSrc<unknown>(elasticSrc.responses[0]);
    const itemsFix = items.map(({ data }: { data }) => ({
      ...data,
      id: data.idFile,
    }));
    return {
      items: itemsFix,
      itemsTotal: elasticSrc.responses[0].hits.total.value,
    };
  } catch (err) {
    console.warn("-> searchFilesShared: ", err);
    return {
      items: [],
      itemsTotal: 0,
      error: elasticSrc.errorCode,
    };
  }
};

interface ICreateFolder {
  name: string;
  parentId: string;
}
export const createFolder = async ({ name, parentId }: ICreateFolder) => {
  const { url, method } = apiUrls.postFolder;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      name,
      parentId: parentId !== FOLDER_ROOT_ID ? parentId : null,
    },
  });
  return res;
};

interface ICreateFile {
  file: File;
  fileId: string;
  fileMimeType: string;
  folderId: string;
}
export const createFile = async ({
  file,
  fileId,
  fileMimeType,
  folderId,
}: ICreateFile) => {
  const { url, method } = apiUrls.postFile;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      docId: fileId,
      name: file.name,
      size: String(file.size),
      mimeType: fileMimeType,
      parentFolder: folderId !== FOLDER_ROOT_ID ? folderId : null,
    },
  });
  return res;
};

interface IMoveItems {
  oldParentFolder: string;
  newParentFolder: string;
  idsFileAndFolder: Array<{ isFolder: boolean; id: string }>;
}
export const moveItems = async ({
  oldParentFolder = null,
  newParentFolder = null,
  idsFileAndFolder,
}: IMoveItems) => {
  const { url, method } = apiUrls.moveFiles;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      idsFileAndFolder,
      newParentFolder,
      oldParentFolder,
    },
  });
  return res;
};

export const deleteItems = async (
  items: Array<{ isFolder: boolean; id: string }>
) => {
  const { url, method } = apiUrls.deleteFile;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: { files: items, forceDelete: false },
  });
  return res;
};

interface IRenameItem {
  id: string;
  name: string;
  isFolder: boolean;
  createdOn: string;
}
export const renameItem = async ({
  id,
  name,
  isFolder,
  createdOn,
}: IRenameItem) => {
  const { url, method } = isFolder ? apiUrls.putFolder : apiUrls.putFile;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      name,
      id,
      createdOn,
    },
  });
  return res;
};

interface IPublicCdn {
  id: string;
  publicFile: boolean;
}
export const publicCdn = async ({ id, publicFile }: IPublicCdn) => {
  const { url, method } = apiUrls.publiccdn;
  return await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      id,
      publicFile,
    },
  });
};

interface IShareFile {
  fileId: string;
  isFolder: boolean;
  action: string;
  publicPageToken?: string;
}
export const shareFile = async ({
  fileId,
  isFolder,
  action,
  publicPageToken,
}: IShareFile) => {
  const { url, method } = apiUrls.share;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      fileId,
      isFolder,
      action,
      publicPageToken,
    },
  });
  return res;
};

interface ISearchDiz {
  from?: number;
  size?: number;
  searchName: string;
}

export const searchDiz = async ({
  from = 0,
  size = 100,
  searchName = "",
}: ISearchDiz) => {
  const { url, method } = apiUrls.searchDiz;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      from,
      searchName,
      size,
    },
  });
  return res;
};

interface IAddTag extends ITag {
  ownerId: string;
  ownerIsFolder?: boolean;
}
export const addTag = async ({
  name,
  position = { imgX: -1, imgY: -1 },
  type,
  ownerId,
  ownerIsFolder = false,
}: IAddTag) => {
  const { url, method } = apiUrls.createItemTag;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      name,
      position,
      type,
      ownerfolders: ownerIsFolder ? ownerId : undefined,
      ownerfiles: ownerIsFolder ? undefined : ownerId,
    },
  });
  return res;
};

interface IAddTagToFilesFolders extends ITag {
  fileIds?: string[];
  folderIds?: string[];
}
export const addTagToFilesFolders = async ({
  name,
  position = { imgX: -1, imgY: -1 },
  type,
  fileIds = [],
  folderIds = [],
}: IAddTagToFilesFolders) => {
  const { url, method } = apiUrls.createItemTag;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      name,
      position,
      type,
      ownerfolders: fileIds,
      ownerfiles: folderIds,
    },
  });
  return res;
};

interface IRemoveTag {
  id: string;
  type: TagType;
}
export const removeTag = async ({ id, type }: IRemoveTag) => {
  const { url, method } = apiUrls.deleteItemTag;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      id,
      type,
    },
  });
  return res;
};

export const removeTagFromFileFolder = async (ids: string[]) => {
  const { url, method } = apiUrls.deleteItemTag;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      ids,
    },
  });
  return res;
};

interface IDeleteTag {
  id: string;
  type: TagType;
}
export const deleteTag = async ({ id, type }: IDeleteTag) => {
  const { url, method } = apiUrls.deleteTag;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      id,
      type,
    },
  });
  return res;
};

interface IPostProduction {
  productId: string;
  productVersion: number;
  mediaId: string;
  mediaPostProduce: boolean;
}
export const postProduction = async ({
  productId,
  productVersion,
  mediaId,
  mediaPostProduce,
}: IPostProduction) => {
  const { url, method } = apiUrls.postProduction;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      entityId: productId,
      fileId: mediaId,
      postProduce: mediaPostProduce,
      version: productVersion,
    },
  });
  return res;
};

interface ICreateNotification {
  toUsers: string[];
  type: NotificationType;
  payload:
    | INPayloadMentionImgSc
    | INPayloadMentionImgDa
    | INPayloadAssignment
    | INPayloadSharedFile;
}
export const createNotification = async ({
  toUsers,
  type,
  payload,
}: ICreateNotification) => {
  const { url, method } = apiUrls.createNotification;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      toUsers,
      notificationType: type,
      payload,
    },
  });
  return res;
};

export const deleteNotification = async (id: string) => {
  const { url, method } = apiUrls.removeNotification;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(id),
    method,
  });
  return res;
};

export const deleteAllNotifications = async () => {
  const { url, method } = apiUrls.deleteNotifications;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
  });
  return res;
};

const mapNotification = (n): INotification => ({
  id: n.uuid,
  creation: n.creation,
  type: n.notificationType,
  from: n.from,
  markedAsRead: !!n.markedAsRead,
  markedAsViewed: !!n.markedAsViewed,
  payload: n.payload,
});

interface IGetNotifications {
  size: number;
  from: number;
  filter?: string;
}
export const getNotifications = async ({
  size,
  from,
  filter,
}: IGetNotifications): Promise<INotification[]> => {
  const { url, method } = apiUrls.getNotifications;
  try {
    const res = await fetchCookieJwtWithRefreshToken({
      url: url(size, from, filter),
      method,
    });
    return res.map(mapNotification);
  } catch (err) {
    console.warn("getNotifications: ", err);
    return [];
  }
};

export const getNotificationsCount = async (
  filter?: string
): Promise<number> => {
  const { url, method } = apiUrls.getNotificationsCount;
  try {
    const res = await fetchCookieJwtWithRefreshToken({
      url: url(filter),
      method,
    });
    return res;
  } catch (err) {
    console.warn("getNotificationsCount: ", err);
    return 0;
  }
};

interface IMarkNotificationRead {
  id: string;
  mark: boolean;
}
export const markNotificationRead = async ({
  id,
  mark,
}: IMarkNotificationRead) => {
  const { url, method } = apiUrls.notificationMarkRead;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(id, mark),
    method,
  });
  return res;
};

export const markAllNotificationRead = async (mark = true) => {
  const { url, method } = apiUrls.notificationMarkAllRead;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(mark),
    method,
  });
  return res;
};

export const markAllNotificationView = async (mark = true) => {
  const { url, method } = apiUrls.notificationMarkAllView;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(mark),
    method,
  });
  return res;
};

interface IExportXlsx {
  columns: IColumnExportTmp[];
  entities: string[];
  correlationId: string;
  connectionId: string;
}
export const exportXlsx = async ({
  columns,
  entities,
  correlationId,
  connectionId,
}: IExportXlsx) => {
  const { url, method } = apiUrls.exportXlsx;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      entities,
      columns,
      correlationId,
      connectionUUID: connectionId,
    },
  });
  return res;
};

export const getFiles = async (
  p: ISearchFilesParams
): Promise<IGetFilesReturn> => {
  const { url, method } = apiUrls.getFiles;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(p),
    method,
  });
  return res;
};

export const getFilesDetail = async (ids: string[]): Promise<IFileDetail[]> => {
  const { url, method } = apiUrls.getFileDetail;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(ids),
    method,
  });
  return res;
};

export const setPrivateshares = async (
  jsonBody: Array<{
    fileId: string;
    isFolder: boolean;
    sharedWith: string;
    role: SharedRole;
  }>
): Promise<IFileDetail[]> => {
  const { url, method } = apiUrls.privateshares;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody,
  });
  return res;
};

export const getTags = async (name = "", size = 10): Promise<IAggregation> => {
  const { url, method } = apiUrls.getTags;
  const { items, sum_other_doc_count } = await fetchCookieJwtWithRefreshToken({
    url: url(name, size),
    method,
  });
  return {
    id: FIELD_ID.TAGS,
    items,
    sum_other_doc_count,
  };
};

const buildConfirmUrl = (
  url: (id: string, service: Service, type?: string) => string,
  fileId: string,
  service: Service,
  mediaType?,
  importXls?
) => {
  if (mediaType) {
    return url(fileId, service, map[mediaType]);
  }
  if (importXls) {
    return url(fileId, service, map[importXls]) + "?renditions=false";
  }
  return url(fileId, service);
};

export const mcrConfirm = async (
  fileId: string,
  service: Service,
  file?: IUploadFile
) => {
  const { url, method } = apiUrls.newUploadConfirm;
  const mediaType = file?.metadata?.mediaType;
  const importXls = file?.metadata?.importXls;
  await fetchCookieJwtWithRefreshToken({
    url: buildConfirmUrl(url, fileId, service, mediaType, importXls),
    method,
  });
};

const buildSignedUrl = (
  url: (type?: string) => string,
  mediaType?,
  importXls?
) => {
  if (mediaType) {
    return url(map[mediaType]);
  }
  if (importXls) {
    return url(map[importXls]);
  }
  return url();
};

export const getSignedUrl = (urlMethod: {
  url: (type?: string) => string;
  method: string;
}) => async (ifile: IUploadFile) => {
  const {
    file: { type, name },
    metadata: { mediaType, importXls } = {},
  } = ifile;
  const { url: fnUrl, method } = urlMethod;

  const url = buildSignedUrl(fnUrl, mediaType, importXls);

  return await signUrl({
    url,
    method,
    name,
    type,
    metadata: { mediaType, import: importXls },
  });
};

export const signUrl = async ({
  url,
  method,
  name,
  type,
  metadata = {},
}: {
  url: string;
  method: string;
  name: string;
  type: string;
  metadata?;
}) => {
  try {
    const res = await fetchCookieJwtWithRefreshToken({
      url,
      method,
      jsonBody: {
        mimeType:
          type && type !== OCTET_STREAM_MIMETYPE ? type : getMimeType(name),
        filename: name,
        metadata,
      },
    });
    return {
      ...res,
      signedUrl: res.signedURL,
    };
  } catch (err) {
    console.log(err);
  }
};

export const getJobs = async (): Promise<IRequest[]> => {
  const { url, method } = apiUrls.getJobs;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
  });
  return res;
};

export const getJobId = async (id: string): Promise<IRequest> => {
  const { url, method } = apiUrls.getJobId;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(id),
    method,
  });
  return res;
};

export const deleteJobs = async () => {
  const { url, method } = apiUrls.deleteJobs;
  await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
  });
};

export const deleteJobId = async (id: string) => {
  const { url, method } = apiUrls.deleteJobId;
  await fetchCookieJwtWithRefreshToken({
    url: url(id),
    method,
  });
};

export const getAdminPermissions = async (): Promise<IPermissionData[]> => {
  const { url, method } = apiUrls.getAdminPermissions;
  const items = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
  });
  return items;
};
