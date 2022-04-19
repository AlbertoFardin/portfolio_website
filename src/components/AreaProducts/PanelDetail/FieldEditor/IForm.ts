import { IProduct } from "../../../../interfaces";

interface IForm {
  attributeId: string;
  attributeKey: string;
  assetdataMerge: IProduct;
  readOnly?: boolean;
  value;
  label: string;
  dirty: boolean;
  className?: string;
  dispatchField: React.Dispatch<unknown>;
  multiCatalog: boolean;
  multiLanguage: boolean;
  languageId: string;
  catalogId: string;
  isReady: boolean;
  btnReadyVisibled: boolean;
  btnReadyDisabled: boolean;
  btnResetVisibled: boolean;
  btnResetDisabled: boolean;
  mandatory: boolean;
  placeholderDifferentValues: string;
  onReadyClick: () => void;
  onReadyMouseHover: () => void;
  onResetClick: () => void;
  onResetMouseHover: () => void;
  onMenuClose: () => void;
}

export default IForm;
