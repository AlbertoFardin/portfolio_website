import { ICategory } from "../../../componentsBase/ChipCategory";
import { IThumbnail, TypeCell } from "../../../componentsBase/StickyGrid";
import { IColumnSc, IProduct } from "../../../interfaces";
import getAttributeKey from "../getAttributeKey";

const typeThumbnails = new Set([
  TypeCell.Thumbnail,
  TypeCell.MultipleThumbnail,
]);
const typeCategories = new Set([TypeCell.Category]);

interface IGetGridItems {
  items: IProduct[];
  columns: IColumnSc[];
  catalogId: string;
  languageId: string;
  decorateCellThumbnails: (item: IProduct, columnKey: string) => IThumbnail[];
  decorateCellCategories: (item: IProduct, columnKey: string) => ICategory[];
}

const getGridItems = ({
  items,
  columns,
  catalogId,
  languageId,
  decorateCellThumbnails,
  decorateCellCategories,
}: IGetGridItems): IProduct[] => {
  return items.map((item) => {
    const newItem = { ...item };

    columns
      .filter((c) => {
        return typeThumbnails.has(c.type);
      })
      .forEach((c) => {
        const key = getAttributeKey(c, catalogId, languageId);
        newItem[key] = decorateCellThumbnails(item, key);
      });

    columns
      .filter((c) => {
        return typeCategories.has(c.type);
      })
      .forEach((c) => {
        const key = getAttributeKey(c, catalogId, languageId);
        newItem[key] = decorateCellCategories(item, key);
      });

    return newItem;
  });
};

export default getGridItems;
