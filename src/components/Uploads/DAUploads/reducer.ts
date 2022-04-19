import IUploadFile from "../IUploadFile";
import itemsUpdate from "./itemsUpdate";

import IUploadToAdd from "./IUploadsDA";
import { getRelativePathsFolderId } from "./utils";
import itemsAddAndUploading from "./itemsAddAndUploading";
import { maxSize } from "../../../mimeTypes";
import MAX_UPLOAD from "../maxUpload";

export enum ACTIONS {
  RESET = "RESET",
  SET_ITEMS = "SET_ITEMS",
  ADD_ITEMS = "ADD_ITEMS",
  MSG_CLOSE = "MSG_CLOSE",
  MSG_OPEN = "MSG_OPEN",
  EXPANDED = "EXPANDED",
  UPDATE_FOLDER_ID_AND_FILE_UPLOADING = "UPDATE_FOLDER_ID",
  SAVED_IN_DA = "SAVED_IN_DA",
}

interface IReducer {
  expanded: boolean;
  items: IUploadFile[];
  msgStopUpload: boolean;
  mapFileIdSaved: { [id: string]: boolean };
  relativePathsFolderId: {
    name: string;
    folderId: string;
    sessionUploadId: string;
  }[];
}

export const reducerInitState = {
  expanded: true,
  items: [],
  mapFileIdSaved: {},
  msgStopUpload: false,
  relativePathsFolderId: [],
};

export const CURRENT_FOLDER_TO_UPLOAD = "current_folder_to_upload";

export const reducer = (state: IReducer, action): IReducer => {
  const newState = { ...state };
  switch (action.type) {
    case ACTIONS.EXPANDED:
      newState.expanded = !newState.expanded;
      return newState;
    case ACTIONS.MSG_OPEN:
      newState.msgStopUpload = true;
      return newState;
    case ACTIONS.MSG_CLOSE:
      newState.msgStopUpload = false;
      return newState;
    case ACTIONS.SET_ITEMS:
      newState.items = itemsUpdate({
        items: newState.items,
        ifile: action.ifile,
        numParallelUpload: MAX_UPLOAD,
        relativePathsFolderId: newState.relativePathsFolderId,
      });
      return newState;
    case ACTIONS.ADD_ITEMS:
      const { folderId, ifiles }: IUploadToAdd = action.uploadsDA;

      const relativePathsFolderId = getRelativePathsFolderId(ifiles, folderId);
      newState.items = itemsAddAndUploading({
        items: newState.items,
        filesToAdd: ifiles,
        maxSize,
        relativePathsFolderId,
        numParallelUpload: MAX_UPLOAD,
      });

      newState.relativePathsFolderId = relativePathsFolderId;
      return newState;
    case ACTIONS.RESET:
      return reducerInitState;
    case ACTIONS.UPDATE_FOLDER_ID_AND_FILE_UPLOADING: {
      const { folderId, nameFolderToCreate } = action;
      newState.relativePathsFolderId = newState.relativePathsFolderId.map((c) =>
        c.name === nameFolderToCreate ? { ...c, folderId } : { ...c }
      );
      newState.items = itemsAddAndUploading({
        items: newState.items,
        filesToAdd: [],
        maxSize,
        relativePathsFolderId: newState.relativePathsFolderId,
      });
      return newState;
    }
    case ACTIONS.SAVED_IN_DA: {
      const { id } = action;
      newState.mapFileIdSaved[id] = true;
      return newState;
    }
    default:
      return newState;
  }
};
