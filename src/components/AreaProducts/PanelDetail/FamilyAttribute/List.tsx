import * as React from "react";
import { AttributeFamily, IColumnSc, IProduct } from "../../../../interfaces";
import { VariableSizeList } from "react-window";
import AutoSizer from "../../../../componentsBase/Autosizer";
import ListItem from "./ListItem";
import getListItemSize from "./getListItemSize";
import { IAssetdataDiffs, IListItemData, ItemRender } from "../interfaces";
import { IItemsSet } from "../../../../componentsBase/ConfigManagement";

interface IList {
  attributes: IColumnSc[];
  assetdataMerge: IProduct;
  assetdataDirty?;
  assetdataDiffs?: IAssetdataDiffs;
  assetdataCount: number;
  searchAttributeValue: string;
  selectedCatalog: string;
  selectedLanguages: string[];
  visibleFamilies: AttributeFamily[];
  managerAttributesSets: IItemsSet[];
}

const List = ({
  attributes,
  assetdataMerge,
  assetdataDirty,
  assetdataDiffs,
  assetdataCount,
  searchAttributeValue,
  selectedCatalog,
  selectedLanguages,
  visibleFamilies,
  managerAttributesSets,
}: IList) => {
  const listRef = React.useRef(null);
  const itemData = React.useMemo((): IListItemData[] => {
    const items: {
      render: ItemRender;
      family?: AttributeFamily;
      column?: IColumnSc;
    }[] = [];

    /////////////////////////////////////////////////
    // aggiungo il padding iniziale della lista
    items.push({
      render: ItemRender.PADDING_HEADER,
    });

    visibleFamilies.forEach((family) => {
      /////////////////////////////////////////////////
      // aggiungo i titoli dei gruppi
      if (visibleFamilies.length > 1) {
        items.push({
          render: ItemRender.TITLE,
          family,
        });
      }

      const group = attributes.filter((c) => c.attributeFamily === family);

      if (group.length) {
        /////////////////////////////////////////////////
        // aggiungo gli attributi raggruppati
        group.forEach((c) => {
          items.push({
            render: ItemRender.FIELD,
            column: c,
            family,
          });
        });
      } else {
        /////////////////////////////////////////////////
        // altrimenti aggiungo il placeholder
        items.push({
          render: !!searchAttributeValue
            ? ItemRender.EMPTY_SEARCHED
            : ItemRender.EMPTY_SELECTED,
          family,
        });

        searchAttributeValue;
      }
    });

    /////////////////////////////////////////////////
    // aggiungo il padding finale della lista
    items.push({
      render: ItemRender.PADDING_FOOTER,
    });

    return items.map((a) => ({
      assetdataCount,
      assetdataMerge,
      assetdataDirty,
      assetdataDiffs,
      selectedCatalog,
      selectedLanguages,
      ...a,
    }));
  }, [
    assetdataCount,
    assetdataDiffs,
    assetdataDirty,
    assetdataMerge,
    attributes,
    searchAttributeValue,
    selectedCatalog,
    selectedLanguages,
    visibleFamilies,
  ]);

  const itemSize = React.useCallback(
    (index: number) => getListItemSize(itemData[index], selectedLanguages),
    [itemData, selectedLanguages]
  );

  const memoAttributesSet = React.useMemo(() => {
    return managerAttributesSets.find((s) => s.active).id;
  }, [managerAttributesSets]);
  const memoVisibleFamily = React.useMemo(() => {
    return visibleFamilies.sort().join();
  }, [visibleFamilies]);
  const memoVisibleAttributes = React.useMemo(() => {
    return attributes
      .map((a) => a.id)
      .sort()
      .join();
  }, [attributes]);
  const listRenderId =
    memoVisibleFamily +
    assetdataCount +
    searchAttributeValue +
    selectedCatalog +
    selectedLanguages.join();

  // reset listitems sizes
  React.useEffect(() => {
    if (listRef.current && listRenderId + memoVisibleAttributes)
      listRef.current.resetAfterIndex(0);
  }, [listRenderId, memoVisibleAttributes]);

  // reset scroll list
  React.useEffect(() => {
    if (listRef.current && listRenderId + memoAttributesSet)
      listRef.current.scrollTo(0);
  }, [listRenderId, memoAttributesSet]);

  return (
    <AutoSizer>
      {({ width, height }) => (
        <VariableSizeList
          ref={listRef}
          width={width}
          height={height}
          itemData={itemData}
          itemCount={itemData.length}
          itemSize={itemSize}
          children={ListItem}
        />
      )}
    </AutoSizer>
  );
};

export default List;
