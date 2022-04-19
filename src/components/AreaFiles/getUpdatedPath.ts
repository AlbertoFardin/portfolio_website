import { AREA_FILES } from "../../constants";
import { FileSection } from "../../interfaces";
import { ROOT_MYFILE_ID, ROOT_SHARED_ID } from "./constants";

export const getPathId = (pathname: string): string => {
  const link = pathname.replace(`/${AREA_FILES}/`, "");
  const section = link.split("/")[0];
  return section;
};

export const getUpdatedPath = (folderId: string): string => {
  let id = folderId;

  if (folderId === ROOT_MYFILE_ID) id = FileSection.MY_FILES;
  if (folderId === ROOT_SHARED_ID) id = FileSection.SHARES_PRIVATE;

  return `/${AREA_FILES}/${id}`;
};
