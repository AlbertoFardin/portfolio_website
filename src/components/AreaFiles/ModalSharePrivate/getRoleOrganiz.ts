import { IFileDetail, IShared, SharedRole } from "../../../interfaces";
import { ORGANIZATION_ID } from "../constants";

const getRoleOrganiz = (assetDatas: IFileDetail[]): SharedRole => {
  const shares: IShared[] = assetDatas.reduce((acc, { sharedWith }) => {
    (sharedWith || []).forEach((s) => {
      if (s.id === ORGANIZATION_ID) acc.push(s);
    });
    return acc;
  }, []);
  const sharesSize = shares.length;
  const assetsSize = assetDatas.length;

  const roles = new Set(shares.map((s) => s.role));
  if (!!sharesSize && assetsSize !== sharesSize) return SharedRole.VARIES;
  if (roles.size === 0) return SharedRole.TO_REMOVE_ORGANIZ;
  if (roles.size === 1) return shares[0].role;
  return SharedRole.VARIES;
};

export default getRoleOrganiz;
