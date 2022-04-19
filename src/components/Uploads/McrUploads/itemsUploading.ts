import IUploadFile from "../IUploadFile";
import IFileStatus from "../IFileStatus";

interface IItemsAdd {
  items: IUploadFile[];
  numParallelUpload?: number;
}

const itemsUploading = ({
  items,
  numParallelUpload = 1,
}: IItemsAdd): IUploadFile[] => {
  const newItems = [].concat(items);

  newItems.forEach((itemToAdd: IUploadFile) => {
    const canOtherUpdating =
      newItems.filter(({ status }) => status === IFileStatus.Uploading).length <
      numParallelUpload;

    if (canOtherUpdating && itemToAdd.status === IFileStatus.Waiting) {
      itemToAdd.status = IFileStatus.Uploading;
    }
  });

  return newItems;
};

export default itemsUploading;
