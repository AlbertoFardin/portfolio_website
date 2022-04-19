import { IFileDetail } from "../../../interfaces";

interface IShare {
  assetData: IFileDetail;
  onUpdate: (data: IFileDetail) => void;
  onCancel: () => void;
}

export default IShare;
