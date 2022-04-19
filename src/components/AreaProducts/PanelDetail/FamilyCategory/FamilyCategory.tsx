import * as React from "react";
import { IProduct, AttributeFamily } from "../../../../interfaces";
import { ContextColumns } from "../../contexts";
import { IAssetdataDiffs } from "../interfaces";
import FieldEditor from "../FieldEditor";
import { KEY_CATALOG } from "../../../../constants";
import PlaceholderText from "../PlaceholderText";
import {
  sortColumns,
  inScope,
  inEntityStruct,
  inAttributeSet,
} from "../filterColumns";
import useStyles from "../useStylesFamily";
import {
  HEIGHT_PADDING_FOOTER,
  HEIGHT_PADDING_HEADER,
} from "../FamilyAttribute/getListItemSize";

interface IFamilyCategory {
  assetdataMerge: IProduct;
  assetdataDirty;
  assetdataDiffs: IAssetdataDiffs;
  assetdataCount: number;
}

const FamilyCategory = ({
  assetdataMerge,
  assetdataDirty,
  assetdataDiffs,
  assetdataCount,
}: IFamilyCategory) => {
  const classes = useStyles({});
  const columns = React.useContext(ContextColumns);

  const attributes = React.useMemo(() => {
    const c = columns
      .filter((c) => inEntityStruct(c, assetdataMerge))
      .filter((c) => inAttributeSet(c, assetdataMerge))
      .filter((c) => c.attributeFamily === AttributeFamily.CATEGORIES);
    return sortColumns(c);
  }, [assetdataMerge, columns]);
  const assetdataCatalogs = assetdataMerge[KEY_CATALOG] || [];

  return (
    <div className={classes.family}>
      <div className={classes.list}>
        <div style={{ minHeight: HEIGHT_PADDING_HEADER }} />
        <PlaceholderText
          family={AttributeFamily.CATEGORIES}
          attributesCount={attributes.length}
          assetdataCount={assetdataCount}
        />
        {assetdataCount > 1 || !attributes.length ? null : (
          <FieldEditor
            column={columns.find((c) => c.id === KEY_CATALOG)}
            assetdataMerge={assetdataMerge}
            assetdataDirty={assetdataDirty}
            assetdataDiffs={assetdataDiffs}
            assetdataCount={assetdataCount}
          />
        )}
        {assetdataCatalogs.map((catalogId) => {
          return attributes
            .filter((c) => inScope(c, catalogId))
            .map((c) => (
              <FieldEditor
                key={c.id}
                column={c}
                assetdataMerge={assetdataMerge}
                assetdataDirty={assetdataDirty}
                assetdataDiffs={assetdataDiffs}
                assetdataCount={assetdataCount}
                selectedCatalog={catalogId}
              />
            ));
        })}
        <div style={{ minHeight: HEIGHT_PADDING_FOOTER }} />
      </div>
    </div>
  );
};

export default FamilyCategory;
