import {
  IProduct,
  IColumnSc,
  IReady,
  IEditedAttribute,
  ICatalog,
} from "../../../interfaces";
import {
  KEY_CATALOG,
  KEY_ROOT_ID,
  KEY_READY,
  KEY_EDITED_ATTRIBUTES,
} from "../../../constants";
import isEqual from "lodash-es/isEqual";
import { IAssetdataDiffs } from "./interfaces";
import getAttributeKey, { getAttributeId } from "../getAttributeKey";
import { getValueString, TypeCell } from "../../../componentsBase/StickyGrid";

// trovo i valori diversi
export const getAssetdataDiffs = (
  assetDatas: IProduct[],
  columns: IColumnSc[],
  catalogs: ICatalog[]
): IAssetdataDiffs => {
  if (assetDatas.length < 1) return {};

  const assetdata = assetDatas[0];
  const assetCatalogs = assetdata[KEY_CATALOG] || [];

  const dataKeys = columns.map((c) => c.id);
  Object.keys(assetdata).forEach((key) => {
    const { id } = getAttributeId(key);
    if (!new Set(dataKeys).has(id)) dataKeys.push(id);
  });

  return dataKeys.reduce((assetdataDiffs, key) => {
    const col = columns.find((c) => c.id === key);

    const colType: TypeCell = col?.type || TypeCell.String;
    const colMulCata: boolean = col?.multiCatalog || false;
    const colMulLang: boolean = col?.multiLanguage || false;

    const prepareDiffs = (cId = "", lId = "") => {
      const attributeKey = col ? getAttributeKey(col, cId, lId) : key;
      const different = assetDatas.reduce((acc, aData) => {
        const equal = isEqual(
          getValueString(assetdata[attributeKey], colType),
          getValueString(aData[attributeKey], colType)
        );

        if (!acc && !equal) acc = true;
        return acc;
      }, false);

      // trovo quanti asset hanno l'attributo valorizzato
      // "!= undefined" serve ad identificare quelli valorizzati come "false"
      const assetValued = assetDatas.filter(
        (aData) => aData[attributeKey] != undefined
      );
      const withValue = !different ? 0 : assetValued.length;

      assetdataDiffs[attributeKey] = { different, withValue };
    };

    // se l'attributo è multiCatalog
    // ciclo sui catalogi per trovarne i value
    if (colMulCata) {
      assetCatalogs.forEach((catId) => {
        const catalog = catalogs.find((c) => c.id === catId);
        const { languages } = catalog;

        if (colMulLang) {
          // se l'attributo è multiLanguage
          // ciclo sulle lingue per trovarne i value
          languages.forEach((langId) => {
            prepareDiffs(catId, langId);
          });
        } else {
          prepareDiffs(catId);
        }
      });
    } else {
      prepareDiffs();
    }

    return assetdataDiffs;
  }, {});
};

// valorizzo la mappa assetData solo con i valori comuni tra i diversi
export const getAssetdataMerge = (
  assetDatas: IProduct[],
  columns: IColumnSc[],
  catalogs: ICatalog[]
): IProduct => {
  if (assetDatas.length === 1) return assetDatas[0];

  const assetdataDiffs = getAssetdataDiffs(assetDatas, columns, catalogs);

  const assetdataMerge: IProduct = {
    id: "",
    version: 0,
    [KEY_ROOT_ID]: "",
    [KEY_READY]: [] as IReady[],
    [KEY_EDITED_ATTRIBUTES]: [] as IEditedAttribute[],
    [KEY_CATALOG]: [] as string[],
  };

  for (const key of Object.keys(assetdataDiffs)) {
    if (!assetdataDiffs[key].different) {
      assetdataMerge[key] = assetDatas[0][key];
    }
  }

  assetdataMerge[KEY_CATALOG] = Array.from(
    new Set(
      assetDatas.reduce((acc, data) => {
        const catalogs = data[KEY_CATALOG] || [];
        catalogs.forEach((c) => acc.push(c));
        return acc;
      }, [])
    )
  );

  return assetdataMerge;
};
