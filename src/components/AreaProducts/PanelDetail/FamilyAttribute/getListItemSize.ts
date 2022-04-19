import { IListItemData, ItemRender } from "../interfaces";
import getFieldHeight from "../FieldEditor/getFieldHeight";

export const HEIGHT_TITLE = 40;
export const HEIGHT_PADDING_HEADER = 10;
export const HEIGHT_PADDING_FOOTER = 70;

const getListItemSize = (
  itemData: IListItemData,
  selectedLanguages: string[]
): number => {
  const { render, column } = itemData;
  const fieldHeight = getFieldHeight(column);

  switch (render) {
    case ItemRender.TITLE:
    case ItemRender.EMPTY_SELECTED:
    case ItemRender.EMPTY_SEARCHED:
      return HEIGHT_TITLE;
    case ItemRender.PADDING_HEADER:
      return HEIGHT_PADDING_HEADER;
    case ItemRender.PADDING_FOOTER:
      return HEIGHT_PADDING_FOOTER;
    case ItemRender.FIELD:
      return !column.multiLanguage
        ? fieldHeight + 45
        : (fieldHeight + 55) * selectedLanguages.length;
    default:
      return 0;
  }
};

export default getListItemSize;
