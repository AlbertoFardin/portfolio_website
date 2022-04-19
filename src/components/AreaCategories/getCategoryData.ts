import { IItemEs, ICategory } from "../../interfaces";

interface IGetCategoryData {
  categoryDataId: string;
  categoryDataCatalog: string;
  categories: IItemEs<ICategory>[];
}

const getCategoryData = ({
  categoryDataId,
  categoryDataCatalog,
  categories,
}: IGetCategoryData): IItemEs<ICategory> => {
  return categories.find(
    (c) =>
      c.data.catalog === categoryDataCatalog && c.data.id === categoryDataId
  );
};

export default getCategoryData;
