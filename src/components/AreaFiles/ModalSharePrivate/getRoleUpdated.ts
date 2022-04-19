import { SharedRole, IShared } from "../../../interfaces";

const getRoleUpdated = (
  userId: string,
  roleId: SharedRole,
  shares: IShared[]
): SharedRole => {
  const editedShare = shares.find(({ id }) => id === userId);
  const editedRole = editedShare ? editedShare.role : undefined;
  return editedRole !== undefined ? editedRole : roleId;
};

export default getRoleUpdated;
