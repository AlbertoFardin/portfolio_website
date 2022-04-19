import { KEY_ATTRIBUTE_SETS } from "../../../constants";
import {
  EsMedia,
  EsPublications,
  EsReady,
  EsTabular,
  EsTabularRoot,
  ICategory,
  IColumnSc,
  IItemEs,
  IProduct,
} from "../../../interfaces";
import decorateMediaAnnotations from "./decorateMediaAnnotations";
import decorateAttributesCategory from "./decorateAttributesCategory";
import { IDataDictionary } from "./getDataDictionaries";
import decorateAttributesDictionary from "./decorateAttributesDictionary";

interface IMergeIndexesToProduct {
  entityId: string;
  dataTabularRoot: EsTabularRoot;
  dataTabular: EsTabular;
  dataReady: EsReady;
  dataMedia: EsMedia;
  dataPublications: EsPublications;
  annotations: {
    resolved: string[];
    unresolved: string[];
  };
  attributeSets: string[];
  dataDictionaries: IDataDictionary[];
  columns: IColumnSc[];
  categories: IItemEs<ICategory>[];
}

const mergeProductDatas = ({
  entityId,
  dataTabularRoot,
  dataTabular,
  dataReady,
  dataMedia,
  dataPublications,
  dataDictionaries,
  annotations,
  attributeSets,
  categories,
  columns,
}: IMergeIndexesToProduct): IProduct => ({
  id: entityId,
  ...dataTabularRoot,
  ...dataTabular,
  ...dataReady,
  ...dataMedia,
  ...dataPublications,
  ...decorateMediaAnnotations(dataMedia, annotations),
  ...decorateAttributesCategory(dataTabular, columns, categories),
  ...decorateAttributesDictionary(dataTabular, columns, dataDictionaries),
  [KEY_ATTRIBUTE_SETS]: attributeSets,
});

export default mergeProductDatas;
