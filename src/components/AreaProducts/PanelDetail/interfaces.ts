import {
  AttributeFamily,
  DictionaryType,
  IColumnSc,
  IProduct,
} from "../../../interfaces";

export interface IAssetdataDiffs {
  [id: string]: {
    different: boolean;
    withValue: number;
  };
}

export interface IAttributeSelector {
  color?: string;
  attributeId: string;
  catalogId: string;
  languages?: string[];
}

export interface IDialogDictionary {
  open: boolean;
  attributeKey: string;
  attributeId: string;
  label: string;
  catalogId: string;
  multiSelectable: boolean;
  dictionaryId: string;
  dictionaryType: DictionaryType;
}

export interface IDialogCategory {
  open: boolean;
  attributeKey: string;
  attributeId: string;
  label: string;
  catalogId: string;
}

export enum ItemRender {
  FIELD = "FIELD",
  TITLE = "TITLE",
  EMPTY_SELECTED = "EMPTY_SELECTED",
  EMPTY_SEARCHED = "EMPTY_SEARCHED",
  PADDING_HEADER = "PADDING_HEADER",
  PADDING_FOOTER = "PADDING_FOOTER",
}

export interface IListItemData {
  render: ItemRender;
  column?: IColumnSc;
  family?: AttributeFamily;
  assetdataCount: number;
  assetdataMerge: IProduct;
  assetdataDirty?;
  assetdataDiffs?: IAssetdataDiffs;
  selectedCatalog: string;
  selectedLanguages: string[];
}
