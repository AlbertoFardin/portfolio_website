import { TypeCell } from "../../../componentsBase/StickyGrid";
import { IColumnSc, IItemEs, IItemStagingArea } from "../../../interfaces";
import decorateCellThumbnails from "./decorateCellThumbnails";

const typeThumbnails = new Set([
  TypeCell.Thumbnail,
  TypeCell.MultipleThumbnail,
]);

const getGridItems = (
  items: IItemEs<IItemStagingArea>[],
  columns: IColumnSc[]
): IItemEs<IItemStagingArea>[] => {
  return items.map((item) => {
    const newData = { ...item.data };

    columns
      .filter((c) => {
        return typeThumbnails.has(c.type);
      })
      .forEach((c) => {
        newData[c.id] = decorateCellThumbnails(newData);
      });

    return {
      id: item.id,
      data: newData,
    };
  });
};

export default getGridItems;
