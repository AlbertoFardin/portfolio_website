import { IColumnSc, ATypeColumn } from "../../../interfaces";
import isEmpty from "lodash-es/isEmpty";
import { getAttributeId } from "../getAttributeKey";

const getValue = (atype: ATypeColumn, value) => {
  // "null" is needed to BE to reset value
  switch (atype) {
    case ATypeColumn.dictionaryEntry:
      return isEmpty(value) ? null : value[0];
    case ATypeColumn.boolean:
      return typeof value !== "boolean" ? null : value;
    default:
      return isEmpty(value) ? null : value;
  }
};

interface IComposeValue {
  fullValue?;
  thisValue?;
  catalogId: string;
  languageId: string;
}
const composeValue = ({
  fullValue = {},
  thisValue = null,
  catalogId,
  languageId,
}: IComposeValue) => {
  // if attribute global (no multiCatalog + no multiLanguage)
  if (!catalogId && !languageId) {
    return thisValue;
  }

  // if attribute multiCatalog
  if (!languageId) {
    return {
      ...fullValue,
      [catalogId]: thisValue,
    };
  }

  // if attribute multiCatalog
  return {
    ...fullValue,
    [catalogId]: {
      ...fullValue[catalogId],
      [languageId]: thisValue,
    },
  };
};

export const getAttributeToValue = (columns: IColumnSc[], assetdataDirty) => {
  return Object.keys(assetdataDirty).reduce((acc, key) => {
    const { id, catalogId, languageId } = getAttributeId(key);
    const column = columns.find((c) => c.id === id);

    // se non trovo la colonna non posso sapere come formattare il dato
    // non dovrebbe accadere ma è melgio intercettare l'errore
    if (!column) {
      console.error(`⚠️ no column found for key ${key}`);
      return acc;
    }

    const { atype, attributeName, multiCatalog, multiLanguage } = column;
    const keyValue = multiCatalog ? "values" : "value";
    const fullValue =
      (acc[attributeName] && acc[attributeName][keyValue]) || undefined;

    acc[attributeName] = {
      atype,
      multiLanguage,
      multiCatalog,
      [keyValue]: composeValue({
        fullValue,
        thisValue: getValue(atype, assetdataDirty[key]),
        catalogId,
        languageId,
      }),
    };

    return acc;
  }, {});
};

interface IComposeJsonToSave {
  versions: { id: string; version: number }[];
  columns: IColumnSc[];
  assetdataDirty;
}
const composeJsonToSave = ({
  versions,
  columns,
  assetdataDirty,
}: IComposeJsonToSave) => {
  const attributeToValue = getAttributeToValue(columns, assetdataDirty);

  if (versions.length === 1) {
    return {
      attributeToValue,
      entityId: versions[0].id,
      version: versions[0].version,
    };
  } else {
    return {
      attributeToValue,
      entities: versions.reduce((acc, { id, version }) => {
        acc[id] = version;
        return acc;
      }, {}),
    };
  }
};

export default composeJsonToSave;
