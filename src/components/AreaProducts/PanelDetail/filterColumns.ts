import { IColumnSc, IProduct } from "../../../interfaces";
import {
  KEY_ATTRIBUTE_SETS,
  KEY_ENTITY_STRUCTURE_ID,
} from "../../../constants";

export const sortColumns = (array: IColumnSc[]): IColumnSc[] => {
  return array.sort((a, b) => {
    if (a.label > b.label) return 1;
    if (a.label < b.label) return -1;
    return 0;
  });
};

export const inScope = (column: IColumnSc, catalogId: string): boolean => {
  const scope = column.scope || [];

  if (!scope.length) return true;

  return new Set(scope).has(catalogId);
};

export const inEntityStruct = (
  column: IColumnSc,
  assetdata: IProduct
): boolean => {
  const strIdCol = column.entityStructureId;
  const strIdAss = assetdata[KEY_ENTITY_STRUCTURE_ID];
  return !strIdCol || strIdAss === strIdCol;
};

export const inAttributeSet = (
  column: IColumnSc,
  assetdata: IProduct
): boolean => {
  const setsCol = column.attributeSets || [];
  const setsAss = assetdata[KEY_ATTRIBUTE_SETS] || [];

  if (!setsCol.length) return true;

  return !!setsAss.find((s) => new Set(setsCol).has(s));
};

export const inSearchInput = (
  column: IColumnSc,
  searchInput: string
): boolean => {
  const label = column.label.toLocaleUpperCase();
  const input = searchInput.toLocaleUpperCase();

  return label.includes(input);
};

export const inMultiCatalog = (
  column: IColumnSc,
  languages: string[]
): boolean => {
  const { multiCatalog, multiLanguage } = column;

  if (multiCatalog && multiLanguage) {
    return !!languages.length;
  }

  return true;
};
