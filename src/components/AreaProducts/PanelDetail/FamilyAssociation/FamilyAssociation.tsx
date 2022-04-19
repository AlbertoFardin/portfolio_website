import * as React from "react";
import { IProduct, AttributeFamily } from "../../../../interfaces";
import { ContextColumns } from "../../contexts";
import { IAssetdataDiffs } from "../interfaces";
import FieldEditor from "../FieldEditor";
import SelectCatLang from "../SelectCatLang";
import PlaceholderText from "../PlaceholderText";
import {
  sortColumns,
  inScope,
  inEntityStruct,
  inAttributeSet,
  inMultiCatalog,
} from "../filterColumns";
import useStyles from "../useStylesFamily";
import {
  HEIGHT_PADDING_FOOTER,
  HEIGHT_PADDING_HEADER,
} from "../FamilyAttribute/getListItemSize";

interface IFamilyAssociation {
  assetdataCount: number;
  assetdataMerge: IProduct;
  assetdataDirty;
  assetdataDiffs: IAssetdataDiffs;
  selectedCatalog: string;
  selectedLanguages: string[];
}

const FamilyAssociation = ({
  assetdataCount,
  assetdataMerge,
  assetdataDirty,
  assetdataDiffs,
  selectedCatalog,
  selectedLanguages,
}: IFamilyAssociation) => {
  const classes = useStyles({});
  const columns = React.useContext(ContextColumns);

  const attributes = React.useMemo(() => {
    const c = columns
      .filter((c) => inEntityStruct(c, assetdataMerge))
      .filter((c) => inAttributeSet(c, assetdataMerge))
      .filter((c) => inScope(c, selectedCatalog))
      .filter((c) => inMultiCatalog(c, selectedLanguages))
      .filter((c) => c.attributeFamily === AttributeFamily.ASSOCIATION);
    return sortColumns(c);
  }, [assetdataMerge, columns, selectedCatalog, selectedLanguages]);

  return (
    <div className={classes.family}>
      <SelectCatLang
        assetdataMerge={assetdataMerge}
        selectedCatalog={selectedCatalog}
        selectedLanguages={selectedLanguages}
      />
      <div className={classes.list}>
        <div style={{ minHeight: HEIGHT_PADDING_HEADER }} />
        <PlaceholderText
          family={AttributeFamily.ASSOCIATION}
          attributesCount={attributes.length}
          assetdataCount={assetdataCount}
        />
        {attributes.map((c) => (
          <FieldEditor
            key={c.id}
            column={c}
            assetdataMerge={assetdataMerge}
            assetdataDirty={assetdataDirty}
            assetdataDiffs={assetdataDiffs}
            assetdataCount={assetdataCount}
            selectedCatalog={selectedCatalog}
          />
        ))}
        <div style={{ minHeight: HEIGHT_PADDING_FOOTER }} />
      </div>
    </div>
  );
};

export default FamilyAssociation;
