import { ICopyright, IFileDetail, IMediaInfo } from "../../../interfaces";
import getDirtyValues from "../../AreaProducts/PanelDetail/getAssetdataDirty";

export enum ACT_PANEL {
  RESET = "RESET",
  SET_DETAIL_BASE = "SET_DETAIL_BASE",
  SET_DETAIL_FULL = "SET_DETAIL_FULL",
  SET_ASSETDATA = "SET_ASSETDATA",
  UPDATE_COPYRIGHT_DIRTY = "UPDATE_COPYRIGHT_DIRTY",
  DELETE_COPYRIGHT_DIRTY = "DELETE_COPYRIGHT_DIRTY",
  DIALOG_UNSAVED = "DIALOG_UNSAVED",
  SAVE_COPYRIGHT_STARTED = "SAVE_COPYRIGHT_STARTED",
  SAVE_COPYRIGHT_STOPPED = "SAVE_COPYRIGHT_STOPPED",
}

interface IReducerState {
  saveCopyright: boolean;
  loadingDetail: boolean;
  assetData: IFileDetail;
  mediaData: IMediaInfo;
  dirtyCopyright: ICopyright;
  dialogUnsaved: boolean;
}

export const reducerInitState: IReducerState = {
  saveCopyright: false,
  loadingDetail: false,
  assetData: null,
  mediaData: null,
  dirtyCopyright: {},
  dialogUnsaved: false,
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACT_PANEL.SET_DETAIL_BASE:
      if (!newState.assetData || newState.assetData.id !== action.itemData.id) {
        newState.loadingDetail = true;
        newState.mediaData = reducerInitState.mediaData;
      }
      newState.assetData = {
        ...newState.assetData,
        ...action.itemData,
      };
      return newState;
    case ACT_PANEL.SET_DETAIL_FULL:
      newState.loadingDetail = false;
      newState.assetData = action.assetData;
      newState.mediaData = action.mediaData;
      return newState;
    case ACT_PANEL.SET_ASSETDATA:
      newState.assetData = action.assetData;
      return newState;
    case ACT_PANEL.UPDATE_COPYRIGHT_DIRTY:
      newState.dirtyCopyright = getDirtyValues({
        attributeKey: action.id,
        attributeValue: action.value,
        assetDatas: [newState.assetData.copyright],
        assetdataDirty: newState.dirtyCopyright,
      });
      return newState;
    case ACT_PANEL.DELETE_COPYRIGHT_DIRTY:
      newState.dirtyCopyright = reducerInitState.dirtyCopyright;
      newState.dialogUnsaved = reducerInitState.dialogUnsaved;
      return newState;
    case ACT_PANEL.DIALOG_UNSAVED:
      newState.dialogUnsaved = !newState.dialogUnsaved;
      return newState;
    case ACT_PANEL.SAVE_COPYRIGHT_STARTED:
      newState.saveCopyright = true;
      return newState;
    case ACT_PANEL.SAVE_COPYRIGHT_STOPPED:
      newState.assetData = {
        ...newState.assetData,
        copyright: {
          ...newState.assetData.copyright,
          ...newState.dirtyCopyright,
        },
      };
      newState.saveCopyright = false;
      newState.dirtyCopyright = reducerInitState.dirtyCopyright;
      return newState;
    case ACT_PANEL.RESET:
      return reducerInitState;
    default:
      console.error(`no action ${action.type}`);
      return state;
  }
};

export default reducer;
