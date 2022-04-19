import { IFileDetail, IShared, SharedRole } from "../../../interfaces";

const getRoleUserCur = (
  assetDatas: IFileDetail[],
  userId: string
): SharedRole => {
  const shares: IShared[] = assetDatas.reduce((acc, { owner, sharedWith }) => {
    if (userId === owner) {
      acc.push({ id: owner, role: SharedRole.OWNER });
    }

    (sharedWith || []).forEach((s) => {
      if (userId === s.id) acc.push(s);
    });

    return acc;
  }, []);
  const s = new Set(shares.map(({ role }) => role));

  if (s.size === 0) return undefined;
  if (s.size > 1) return SharedRole.VARIES;
  return shares[0].role;
};

export default getRoleUserCur;
