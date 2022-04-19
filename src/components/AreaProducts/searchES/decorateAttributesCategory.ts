import {
  IColumnSc,
  IItemEs,
  ICategory,
  AttributeFamily,
  EsTabular,
} from "../../../interfaces";
import { getAttributeId } from "../getAttributeKey";
import getCategoryData from "../../AreaCategories/getCategoryData";

const decorateAttributesCategory = (
  item: EsTabular,
  columns: IColumnSc[],
  categories: IItemEs<ICategory>[]
) => {
  const obj = {};
  const attributesKey = Object.keys(item).filter((attributeKey) => {
    const { id } = getAttributeId(attributeKey);
    const column = columns.find((c) => c.id === id);
    return (
      !!item[attributeKey] &&
      !!column &&
      column.attributeFamily === AttributeFamily.CATEGORIES
    );
  });

  attributesKey.forEach((attributeKey) => {
    const { catalogId, languageId } = getAttributeId(attributeKey);

    obj[attributeKey] = item[attributeKey].map((categoryDataId) => {
      const category = getCategoryData({
        categoryDataId,
        categoryDataCatalog: catalogId,
        categories,
      });

      return {
        path: category.data.id,
        label: category.data.labels[languageId],
      };
    });
  });

  return obj;
};

export default decorateAttributesCategory;
