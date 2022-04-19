import { IProduct, IItemEs, ICategory } from "../../../interfaces";
import { ICategory as ICategoryCmp } from "../../../componentsBase/ChipCategory";
import getCategoryData from "../../AreaCategories/getCategoryData";
import getCategoryPath from "../../AreaCategories/getCategoryPath";

interface IDecorateCellCategories {
  item: IProduct;
  attributeKey: string;
  catalogId: string;
  languageId: string;
  categories: IItemEs<ICategory>[];
}

const decorateCellCategories = ({
  item,
  attributeKey,
  catalogId,
  languageId,
  categories,
}: IDecorateCellCategories): ICategoryCmp[] => {
  return (item[attributeKey] || [])
    .map(({ path }) => {
      return path;
    })
    .filter((categoryDataId) => {
      return !!getCategoryData({
        categoryDataId,
        categoryDataCatalog: catalogId,
        categories,
      });
    })
    .map((categoryDataId) => {
      const category = getCategoryData({
        categoryDataId,
        categoryDataCatalog: catalogId,
        categories,
      });

      return {
        id: category.id,
        label: category.data.labels[languageId],
        tooltip: getCategoryPath({
          categoryId: category.id,
          languageId,
          categories,
        }),
      };
    });
};

export default decorateCellCategories;
