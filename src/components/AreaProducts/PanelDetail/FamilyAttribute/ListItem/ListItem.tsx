import * as React from "react";
import { IListItemData, ItemRender } from "../../interfaces";
import ItemTitle from "./ItemTitle";
import ItemField from "./ItemField";
import ItemEmptySelected from "./ItemEmptySelected";
import ItemEmptySearched from "./ItemEmptySearched";
interface IListItem {
  data: IListItemData[];
  index: number;
  style: React.CSSProperties;
}

const ListItem = ({ data, index, style }: IListItem) => {
  const {
    render,
    column,
    family,
    assetdataMerge,
    assetdataDirty,
    assetdataDiffs,
    assetdataCount,
    selectedCatalog,
    selectedLanguages,
  } = data[index];

  switch (render) {
    case ItemRender.PADDING_HEADER:
    case ItemRender.PADDING_FOOTER:
      return <div style={style} />;
    case ItemRender.TITLE:
      return <ItemTitle style={style} family={family} />;
    case ItemRender.EMPTY_SEARCHED:
      return <ItemEmptySearched style={style} family={family} />;
    case ItemRender.EMPTY_SELECTED:
      return <ItemEmptySelected style={style} family={family} />;
    case ItemRender.FIELD:
      return (
        <ItemField
          style={style}
          column={column}
          assetdataMerge={assetdataMerge}
          assetdataDirty={assetdataDirty}
          assetdataDiffs={assetdataDiffs}
          assetdataCount={assetdataCount}
          selectedCatalog={selectedCatalog}
          selectedLanguages={selectedLanguages}
        />
      );
    default:
      return null;
  }
};

export default ListItem;
