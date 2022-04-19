import * as React from "react";
import classnames from "classnames";
import { IColumnSc, IProduct } from "../../../../interfaces";
import FieldEditorForm from "./FieldEditorForm";
import makeStyles from "@material-ui/core/styles/makeStyles";
import hexToRgbA from "../../../../componentsBase/utils/hexToRgbA";
import { colorTheme } from "../../../../constants";
import { IAssetdataDiffs } from "../interfaces";
import reducer, { initState } from "./reducer";
import { ContextCatalogs } from "../../contexts";

const useStyles = makeStyles({
  containerLang: {
    position: "relative",
    display: "inline-flex",
    "flex-direction": "column",
    "vertical-align": "top",
  },
  containerLangMore: {
    "background-color": "#f1f1f1",
    "border-radius": 10,
    margin: "5px 15px 0",
  },
  containerLangMoreDirty: {
    "background-color": hexToRgbA(colorTheme, 0.2),
  },
});

interface IFieldEditor {
  column: IColumnSc;
  assetdataMerge: IProduct;
  assetdataDirty;
  assetdataDiffs: IAssetdataDiffs;
  assetdataCount: number;
  selectedCatalog?: string;
  selectedLanguages?: string[];
}

const FieldEditor = ({
  column,
  assetdataMerge,
  assetdataDirty,
  assetdataDiffs,
  assetdataCount,
  selectedCatalog,
  selectedLanguages,
}: IFieldEditor) => {
  const classes = useStyles({});
  const catalogs = React.useContext(ContextCatalogs);

  const [stateField, dispatchField] = React.useReducer(reducer, initState);
  const { hightlightColor, hightlightLanguages } = stateField;
  const { multiCatalog, multiLanguage } = column;

  if (!multiCatalog || !multiLanguage) {
    return (
      <FieldEditorForm
        key={column.id}
        column={column}
        assetdataMerge={assetdataMerge}
        assetdataDirty={assetdataDirty}
        assetdataDiffs={assetdataDiffs}
        assetdataCount={assetdataCount}
        catalogId={selectedCatalog}
        hightlightColor={hightlightColor}
        hightlightLanguages={hightlightLanguages}
        dispatchField={dispatchField}
      />
    );
  }

  const catalog = catalogs.find((c) => c.id === selectedCatalog);
  const languages = selectedLanguages || catalog.languages || [];

  return (
    <div
      key={column.id}
      className={classnames({
        [classes.containerLang]: true,
        [classes.containerLangMore]: languages.length !== 1,
      })}
    >
      {languages.map((languageId) => (
        <FieldEditorForm
          key={`${column.id}_${selectedCatalog}_${languageId}`}
          column={column}
          assetdataMerge={assetdataMerge}
          assetdataDirty={assetdataDirty}
          assetdataDiffs={assetdataDiffs}
          assetdataCount={assetdataCount}
          catalogId={selectedCatalog}
          languageId={languageId}
          hightlightColor={hightlightColor}
          hightlightLanguages={hightlightLanguages}
          dispatchField={dispatchField}
        />
      ))}
    </div>
  );
};

export default FieldEditor;
