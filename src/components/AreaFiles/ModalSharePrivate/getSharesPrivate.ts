import { IFileDetail, SharedRole, IShared } from "../../../interfaces";
import { ORGANIZATION_ID } from "../constants";

const updateAccumulator = (
  acc: IShared[],
  id: string,
  role: SharedRole
): IShared[] => {
  const share = acc.find((s) => s.id === id);

  if (!!share) {
    const index = acc.findIndex((s) => s.id === id);
    acc.splice(index, 1, {
      id,
      role: share.role === role ? role : SharedRole.VARIES,
    });
  } else {
    acc.push({
      id,
      role,
    });
  }

  return acc;
};

const getSharesPrivate = (assetDatas: IFileDetail[]): IShared[] => {
  return assetDatas.reduce((acc, { owner, sharedWith }) => {
    acc = updateAccumulator(acc, owner, SharedRole.OWNER);

    sharedWith
      .filter(({ id }) => id !== ORGANIZATION_ID)
      .forEach(({ id, role }) => {
        acc = updateAccumulator(acc, id, role);
      });

    return acc;
  }, [] as IShared[]);
};

export default getSharesPrivate;
