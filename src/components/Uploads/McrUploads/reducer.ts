import IUploadFile from "../IUploadFile";
import itemsUpdate from "./itemsUpdate";
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
  SET_FILES_DUPLICATED = "SET_FILES_DUPLICATED",
}

interface IReducer {
  expanded: boolean;
  items: IUploadFile[];
  msgStopUpload: boolean;
}

export const reducerInitState = {
  expanded: true,
  items: [],
  msgStopUpload: false,
};

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
      });
      return newState;
    case ACTIONS.ADD_ITEMS:
      newState.items = itemsAddAndUploading({
        items: newState.items,
        filesToAdd: action.uploads,
        maxSize,
        numParallelUpload: MAX_UPLOAD,
      });

      return newState;
    case ACTIONS.RESET:
      return reducerInitState;
    default:
      return newState;
  }
};
