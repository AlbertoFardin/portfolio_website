import {
  INDEX_NAME,
  KEY_ATTRIBUTE_SETS,
  KEY_ROOT_ID,
} from "../../../constants";
import {
  IProduct,
  EsTabularRoot,
  EsPublications,
  EsMedia,
  EsReady,
  EsTabular,
  ISearchEs,
  IResultEs,
  IItemEs,
  IColumnSc,
  ICategory,
} from "../../../interfaces";
import { search } from "../../../api/fetchesApi";
import { mapAnnotationsByEntityIds } from "../../../api/graphqlAPI";
import mergeProductDatas from "./mergeProductDatas";
import getDataDictionaries from "./getDataDictionaries";

const searchIds = async <T>(index: string, ids: string[]) => {
  try {
    const { items } = await search<T>({
      index,
      query: { terms: { _id: ids } },
    });
    return items;
  } catch (err) {
    return [];
  }
};

const findData = <T>(a: IItemEs<T>[], keyValue) => {
  const res = a.find((i) => i.id === keyValue)?.data;
  return res || ({} as T);
};

const searchES = async (
  p: ISearchEs,
  columns: IColumnSc[],
  categories: IItemEs<ICategory>[]
): Promise<IResultEs> => {
  const res = await search<EsTabular>({ ...p, index: INDEX_NAME.TABULAR });
  const { items: itemsTabular, itemsTotal, aggregations } = res;

  try {
    if (!itemsTabular.length) return res;

    const itemsIds = itemsTabular.map((x) => x.id);
    const itemsRootIds = itemsTabular.map((x) => x.data[KEY_ROOT_ID]);

    const [
      rootsTabular,
      itemsTabularRoot,
      itemsReady,
      itemsMedia,
      itemsPublications,
      mapAnnotations,
      dataDictionaries,
    ] = await Promise.all([
      searchIds<EsTabular>(INDEX_NAME.TABULAR, itemsRootIds),
      searchIds<EsTabularRoot>(INDEX_NAME.TABULARROOT, itemsRootIds),
      searchIds<EsReady>(INDEX_NAME.READY, itemsIds),
      searchIds<EsMedia>(INDEX_NAME.MEDIA, itemsIds),
      searchIds<EsPublications>(INDEX_NAME.PUBLICATIONS, itemsIds),
      mapAnnotationsByEntityIds(itemsIds),
      getDataDictionaries(itemsTabular, columns),
    ]);

    const items: IProduct[] = itemsTabular.map(({ id, data }) => {
      const rootId = data.rootDocumentId;
      const rootItem = findData<EsTabular>(rootsTabular, rootId);
      const dataTabularRoot = findData<EsTabularRoot>(itemsTabularRoot, rootId);
      const dataReady = findData<EsReady>(itemsReady, id);
      const dataMedia = findData<EsMedia>(itemsMedia, id);
      const dataPublications = findData<EsPublications>(itemsPublications, id);

      return mergeProductDatas({
        entityId: id,
        dataTabular: data,
        dataTabularRoot,
        dataReady,
        dataMedia,
        dataPublications,
        annotations: mapAnnotations[id],
        dataDictionaries,
        attributeSets: rootItem[KEY_ATTRIBUTE_SETS] || [],
        columns,
        categories,
      });
    });

    return {
      aggregations,
      itemsTotal,
      items,
    };
  } catch (err) {
    console.log("⚠️ searchES:", err);
    return res;
  }
};

export default searchES;
