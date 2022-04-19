import * as React from "react";
import { IProduct, AttributeFamily } from "../../../../interfaces";
import { ContextColumns } from "../../contexts";
import { IAssetdataDiffs } from "../interfaces";
import SelectCatLang from "../SelectCatLang";
import {
  sortColumns,
  inEntityStruct,
  inAttributeSet,
  inSearchInput,
  inMultiCatalog,
} from "../filterColumns";
import List from "./List";
import useStyles from "../useStylesFamily";
import { IItemsSet } from "../../../../componentsBase/ConfigManagement";

interface IFamilyAttribute {
  assetdataMerge: IProduct;
  assetdataDirty;
  assetdataDiffs: IAssetdataDiffs;
  assetdataCount: number;
  visibleAttributes: string[];
  visibleFamilies: AttributeFamily[];
  selectedCatalog: string;
  selectedLanguages: string[];
  searchAttributeValue: string;
  managerAttributesSets: IItemsSet[];
}

const FamilyAttribute = ({
  assetdataMerge,
  assetdataDirty,
  assetdataDiffs,
  assetdataCount,
  visibleAttributes,
  visibleFamilies,
  selectedCatalog,
  selectedLanguages,
  searchAttributeValue,
  managerAttributesSets,
}: IFamilyAttribute) => {
  const classes = useStyles({});
  const columns = React.useContext(ContextColumns);

  const attributes = React.useMemo(() => {
    const visibleFamiliesSet = new Set(visibleFamilies);
    const visibleAttributSet = new Set(visibleAttributes);
    const c = !!searchAttributeValue
      ? columns
          .filter((c) => inSearchInput(c, searchAttributeValue))
          .filter((c) => inEntityStruct(c, assetdataMerge))
          .filter((c) => visibleFamiliesSet.has(c.attributeFamily))
      : columns
          .filter((c) => inEntityStruct(c, assetdataMerge))
          .filter((c) => inAttributeSet(c, assetdataMerge))
          .filter((c) => inMultiCatalog(c, selectedLanguages))
          .filter((c) => visibleFamiliesSet.has(c.attributeFamily))
          .filter((c) => visibleAttributSet.has(c.id));

    return sortColumns(c);
  }, [
    assetdataMerge,
    columns,
    searchAttributeValue,
    selectedLanguages,
    visibleAttributes,
    visibleFamilies,
  ]);

  return (
    <div className={classes.family}>
      <SelectCatLang
        assetdataMerge={assetdataMerge}
        selectedCatalog={selectedCatalog}
        selectedLanguages={selectedLanguages}
      />
      <div className={classes.list}>
        <List
          attributes={attributes}
          assetdataMerge={assetdataMerge}
          assetdataDirty={assetdataDirty}
          assetdataDiffs={assetdataDiffs}
          assetdataCount={assetdataCount}
          searchAttributeValue={searchAttributeValue}
          selectedCatalog={selectedCatalog}
          selectedLanguages={selectedLanguages}
          visibleFamilies={visibleFamilies}
          managerAttributesSets={managerAttributesSets}
        />
      </div>
    </div>
  );
};

export default FamilyAttribute;
