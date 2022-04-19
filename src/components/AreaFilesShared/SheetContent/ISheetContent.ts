import { IFileDetail } from "../../../interfaces";

interface ISheetContent {
  dispatchViewport: React.Dispatch<unknown>;
  fullscreen: boolean;
  assetData: IFileDetail;
}

export default ISheetContent;
