import IFileStatus from "../IFileStatus";
import IUploadFile from "../IUploadFile";
import isEmpty from "lodash-es/isEmpty";
import itemsUploading from "./itemsUploading";

interface IItemsUpdate {
  items?: IUploadFile[];
  index?: number;
  ifile: IUploadFile;
  numParallelUpload?: number;
  relativePathsFolderId?: {
    name: string;
    folderId: string;
    sessionUploadId: string;
  }[];
}

const itemsUpdate = ({
  items = [],
  ifile,
  numParallelUpload = 1,
  relativePathsFolderId,
}: IItemsUpdate): IUploadFile[] => {
  if (isEmpty(items)) return [];

  const { id, sessionUploadId, tooltip, status } = ifile;

  items.forEach((item) => {
    if (item.id === id && sessionUploadId === item.sessionUploadId) {
      item.status = status;

      if (!item.tooltip && tooltip && status === IFileStatus.Error) {
        item.tooltip = tooltip;
      }
    }
  });

  return itemsUploading({
    items,
    relativePathsFolderId,
    numParallelUpload,
  });
};

export default itemsUpdate;
