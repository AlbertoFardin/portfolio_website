import IUploadFile from "../IUploadFile";
import IFileStatus from "../IFileStatus";
import { CURRENT_FOLDER_TO_UPLOAD } from "./reducer";
import { getPathArray, SEPARATOR } from "./utils";

interface IItemsAdd {
  items: IUploadFile[];
  relativePathsFolderId: {
    name: string;
    folderId: string;
    sessionUploadId: string;
  }[];
  numParallelUpload?: number;
}

const itemsUploading = ({
  items,
  relativePathsFolderId,
  numParallelUpload = 1,
}: IItemsAdd): IUploadFile[] => {
  const newItems = [].concat(items);

  newItems.forEach((itemToAdd: IUploadFile) => {
    const canOtherUpdating =
      newItems.filter(({ status }) => status === IFileStatus.Uploading).length <
      numParallelUpload;

    const isAvailableFolderId =
      relativePathsFolderId.find(
        ({ name: nameFolder }) =>
          (itemToAdd.file.webkitRelativePath === "" &&
            nameFolder === CURRENT_FOLDER_TO_UPLOAD) ||
          nameFolder ===
            getPathArray(itemToAdd.file.webkitRelativePath).join(SEPARATOR)
      ).folderId !== undefined;

    if (
      isAvailableFolderId &&
      canOtherUpdating &&
      itemToAdd.status === IFileStatus.Waiting
    ) {
      itemToAdd.status = IFileStatus.Uploading;
    }
  });

  return newItems;
};

export default itemsUploading;
