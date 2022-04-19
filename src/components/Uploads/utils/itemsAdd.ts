import IUploadFile from "../IUploadFile";
import IFileStatus from "../IFileStatus";
import * as prettyBytes from "pretty-bytes";

interface IItemsAdd {
  items: IUploadFile[];
  filesToAdd: IUploadFile[];
  maxSize: (f: File) => number;
}

const itemsAdd = ({ items, filesToAdd, maxSize }: IItemsAdd): IUploadFile[] => {
  const newItems = [].concat(items);

  filesToAdd.forEach((fileToAdd: IUploadFile) => {
    const { file } = fileToAdd;
    const maxSizeValue = maxSize(file);
    const b1 = prettyBytes(file.size, { locale: true });
    const b2 = prettyBytes(maxSizeValue, { locale: true });
    const exceedSize = file.size > maxSizeValue;

    if (maxSizeValue !== -1 && exceedSize) {
      fileToAdd.status = IFileStatus.Error;
      fileToAdd.tooltip = `The ${b1} size of the file is greater than the maximum allowed (${b2})`;
    }

    newItems.push(fileToAdd);
  });

  return newItems;
};

export default itemsAdd;
