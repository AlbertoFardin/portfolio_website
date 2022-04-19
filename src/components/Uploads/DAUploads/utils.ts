import IUploadFile from "../IUploadFile";
import { CURRENT_FOLDER_TO_UPLOAD } from "./reducer";

export const SEPARATOR = "/";

export const getPathArray = (webkitRelativePath) => {
  return webkitRelativePath.split(SEPARATOR).reduce((acc, c, index, array) => {
    if (index < array.length - 1) {
      acc.push(c);
    }
    return acc;
  }, []);
};

export const getParentId = (
  aFirstF: string[],
  sessionUploadIdToCreate: string,
  relativePathsFolderId: {
    name: string;
    folderId: string;
    sessionUploadId: string;
  }[]
) =>
  aFirstF.length - 1 === 0
    ? relativePathsFolderId.find(
        ({ name, sessionUploadId }) =>
          name === CURRENT_FOLDER_TO_UPLOAD &&
          sessionUploadIdToCreate === sessionUploadId
      ).folderId
    : relativePathsFolderId.find(({ name, sessionUploadId }) => {
        const c1 =
          name === aFirstF.slice(0, aFirstF.length - 1).join(SEPARATOR);
        const c2 = sessionUploadIdToCreate === sessionUploadId;
        return c1 && c2;
      }).folderId;

export const getRelativePathsFolderId = (
  ifiles: IUploadFile[],
  folderId: string
): {
  name: string;
  folderId: string;
  sessionUploadId: string;
}[] => {
  const result: {
    name: string;
    folderId: string;
    sessionUploadId: string;
  }[] = [];
  result.push({
    sessionUploadId: ifiles[0].sessionUploadId,
    folderId,
    name: CURRENT_FOLDER_TO_UPLOAD,
  });
  // popolo prima le mappe di tutti i path intermedi in cui si trovano il file
  ifiles.forEach((i) => {
    const { file, sessionUploadId } = i;
    const pathRelative = getPathArray(file.webkitRelativePath);
    // riduce da ['a','b','c'] -> ['a','a/b','a/b/c']
    const arrayRPaths = pathRelative.reduce((acc, folder, index) => {
      if (index === 0) {
        acc.push(folder);
      } else {
        acc.push(acc[index - 1] + SEPARATOR + folder);
      }
      return acc;
    }, []);
    arrayRPaths.forEach((rPath) => {
      if (!result.find((o) => rPath === o.name)) {
        result.push({
          name: rPath,
          sessionUploadId,
          folderId: undefined,
        });
      }
    });
  });
  return result;
};
