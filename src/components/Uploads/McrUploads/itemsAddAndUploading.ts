import IUploadFile from "../IUploadFile";
import itemsAdd from "../utils/itemsAdd";
import itemsUploading from "./itemsUploading";

interface IItemsAdd {
  items: IUploadFile[];
  filesToAdd: IUploadFile[];
  maxSize: (f: File) => number;
  numParallelUpload?: number;
}

const itemsAddAndUploading = ({
  items,
  filesToAdd,
  maxSize,
  numParallelUpload = 1,
}: IItemsAdd): IUploadFile[] => {
  const itemsAdded = itemsAdd({
    items,
    filesToAdd,
    maxSize,
  });

  const result = itemsUploading({ items: itemsAdded, numParallelUpload });
  return result;
};

export default itemsAddAndUploading;
