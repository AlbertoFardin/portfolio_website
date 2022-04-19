import { KEY_ROOT_ID, KEY_CATALOG, KEY_READY } from "../../../constants";
import {
  IReady,
  IReadySet,
  IProduct,
  IColumnSc,
  AttributeType,
  ContentType,
} from "../../../interfaces";
import getColumnsByFamily from "../getColumnsByFamily";
import isEmpty from "lodash-es/isEmpty";
import concat from "lodash-es/concat";
import { getAttributeId } from "../getAttributeKey";

const getSetCatalogs = (
  c: IColumnSc,
  catalogs: string[],
  attributeKeys: string[]
): string[] | Array<{ catalogName: string; languages: string[] }> => {
  if (c.multiCatalog) {
    const catalogsMap = attributeKeys.reduce((acc, k) => {
      const { catalogId, languageId } = getAttributeId(k);
      acc[catalogId] = concat(acc[catalogId] || [], languageId || []);
      return acc;
    }, []);

    if (c.multiLanguage) {
      return Object.keys(catalogsMap).map((catalogName) => ({
        catalogName,
        languages: catalogsMap[catalogName],
      }));
    } else {
      return Object.keys(catalogsMap);
    }
  }
  return catalogs;
};

interface IGetReadySets {
  items: IProduct[];
  itemsRoot: IProduct[];
  columns: IColumnSc[];
}

const getReadySets = ({
  items,
  itemsRoot,
  columns,
}: IGetReadySets): IReadySet[] => {
  return items.reduce((a: IReadySet[], item) => {
    const itemRoot = itemsRoot.find(({ id }) => item[KEY_ROOT_ID] === id);
    const itemCatalogs: string[] = item[KEY_CATALOG] || [];
    const itemReadys: IReady[] = item[KEY_READY] || [];
    const itemKeys = Object.keys(item);

    const elementsReady = getColumnsByFamily({
      attributeType: [AttributeType.SYSTEM, AttributeType.USER],
      attributeEditable: true,
      columns,
      datas: [item],
      datasRoot: [itemRoot],
    })
      .filter((c: IColumnSc) => {
        // tengo solo gli attributi exportabili
        return c.exportable;
      })
      .reduce((acc, c: IColumnSc) => {
        // trovo le attributeKey
        const attributeKeys = itemKeys
          .filter((k: string) => {
            // tengo le attributeKey di questa colonna
            return k.includes(c.id);
          })
          .filter((k: string) => {
            // tengo le attributeKey valorizzate
            const value = item[k];
            if (Array.isArray(value)) return !isEmpty(value);
            return value != undefined;
          })
          .filter((k: string) => {
            const { catalogId, languageId } = getAttributeId(k);
            // tengo le attributeKey non ancora messe in ready
            return !itemReadys.find(
              (r) =>
                r.contentType === ContentType.ATTRIBUTE &&
                r.contentId === c.attributeName &&
                (c.multiCatalog ? r.catalog === catalogId : true) &&
                (c.multiLanguage ? r.language === languageId : true)
            );
          });

        // filtro quelle colonne che non rispettano i criteri sopra
        if (isEmpty(attributeKeys)) return acc;

        //preparo il data
        acc.push({
          idType: ContentType.ATTRIBUTE,
          id: c.attributeName,
          catalogs: getSetCatalogs(c, itemCatalogs, attributeKeys),
        });
        return acc;
      }, []);

    // filtro gli items che non hanno attributi da metter in ready
    if (isEmpty(elementsReady)) return a;

    //preparo il data
    a.push({
      entityId: item.id,
      version: item.version,
      elementsReady,
    });
    return a;
  }, []);
};

export default getReadySets;
