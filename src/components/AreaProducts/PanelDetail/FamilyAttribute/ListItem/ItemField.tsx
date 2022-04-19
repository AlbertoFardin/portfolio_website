import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { IColumnSc, IProduct } from "../../../../../interfaces";
import FieldEditor from "../../FieldEditor";
import { IAssetdataDiffs } from "../../interfaces";

const useStyles = makeStyles({
  listField: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
});

interface IItemField {
  style: React.CSSProperties;
  column: IColumnSc;
  assetdataMerge: IProduct;
  assetdataDirty?;
  assetdataDiffs?: IAssetdataDiffs;
  assetdataCount: number;
  selectedCatalog: string;
  selectedLanguages: string[];
}

const ItemField = ({
  style,
  column,
  assetdataMerge,
  assetdataDirty,
  assetdataDiffs,
  assetdataCount,
  selectedCatalog,
  selectedLanguages,
}: IItemField) => {
  const classes = useStyles({});

  return (
    <div style={style} className={classes.listField}>
      <div style={{ flex: 1 }} />
      <FieldEditor
        column={column}
        assetdataMerge={assetdataMerge}
        assetdataDirty={assetdataDirty}
        assetdataDiffs={assetdataDiffs}
        assetdataCount={assetdataCount}
        selectedCatalog={selectedCatalog}
        selectedLanguages={selectedLanguages}
      />
      <div style={{ flex: 1 }} />
    </div>
  );
};

export default ItemField;
