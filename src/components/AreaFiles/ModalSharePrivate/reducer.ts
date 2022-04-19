import { IFileDetail, IShared, SharedRole } from "../../../interfaces";
import { ORGANIZATION_ID } from "../constants";
import getRoleOrganiz from "./getRoleOrganiz";
import getRoleUserCur from "./getRoleUserCur";

export enum ACT_MODAL {
  RESET = "RESET",
  DATAS_UPDATED = "DATAS_UPDATED",
  DATAS_LOADING = "DATAS_LOADING",
  SHARES_TO_CREATE = "SHARES_TO_CREATE",
  SHARES_TO_EDITED = "SHARES_TO_EDITED",
  SHARES_SAVING = "SHARES_LOADING",
  CONFIRM_DISCARD = "CONFIRM_DISCARD",
  NOTIFY_TO_CREATE = "NOTIFY_TO_CREATE",
}

interface IReducerState {
  assetDatas: IFileDetail[];
  load: boolean;
  save: boolean;
  sharesToCreate: IShared[];
  sharesToEdited: IShared[];
  confirmDiscard: boolean;
  notifyToCreate: boolean;
}

export const reducerInitState: IReducerState = {
  assetDatas: [],
  load: false,
  save: false,
  sharesToCreate: [],
  sharesToEdited: [],
  confirmDiscard: false,
  notifyToCreate: true,
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACT_MODAL.DATAS_LOADING:
      newState.assetDatas = reducerInitState.assetDatas;
      newState.load = true;
      return newState;
    case ACT_MODAL.DATAS_UPDATED:
      newState.assetDatas = action.assetDatas;
      newState.load = false;
      return newState;
    case ACT_MODAL.SHARES_TO_CREATE:
      newState.sharesToCreate = action.shares;
      return newState;
    case ACT_MODAL.SHARES_TO_EDITED: {
      const { userId, roleId } = action;
      const newShares = Array.from(newState.sharesToEdited);
      const indexToUpdated = newShares.findIndex((s) => s.id === userId);
      const roleOrganiz = getRoleOrganiz(newState.assetDatas);
      const oldRoleId = getRoleUserCur(newState.assetDatas, userId);
      const returnOldRoleOrganiz =
        userId === ORGANIZATION_ID &&
        SharedRole.TO_REMOVE_ORGANIZ === roleOrganiz &&
        SharedRole.TO_REMOVE_ORGANIZ === roleId;
      const returnOldRoleUser = roleId === oldRoleId;

      if (returnOldRoleOrganiz || returnOldRoleUser) {
        newShares.splice(indexToUpdated, 1);
      } else {
        const shareToUpdated = { id: userId, role: roleId };
        const shareIsUpdated = indexToUpdated !== -1;

        shareIsUpdated
          ? newShares.splice(indexToUpdated, 1, shareToUpdated)
          : newShares.push(shareToUpdated);
      }

      newState.sharesToEdited = newShares;
      return newState;
    }
    case ACT_MODAL.SHARES_SAVING:
      newState.save = true;
      return newState;
    case ACT_MODAL.CONFIRM_DISCARD:
      newState.confirmDiscard = !newState.confirmDiscard;
      return newState;
    case ACT_MODAL.NOTIFY_TO_CREATE:
      newState.notifyToCreate = !newState.notifyToCreate;
      return newState;
    case ACT_MODAL.RESET:
      return reducerInitState;
    default:
      return state;
  }
};

export default reducer;
