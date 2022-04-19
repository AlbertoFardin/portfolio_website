import { TYPE_FOLDER } from "../../../constants";
import { SharedRole, IShared, IFileDetail } from "../../../interfaces";

const toRemove = new Set([
  SharedRole.TO_REMOVE_ORGANIZ,
  SharedRole.TO_REMOVE_PRIVATE,
]);

interface IComposed {
  fileId: string;
  isFolder: boolean;
  sharedWith: string;
  role: SharedRole;
}
interface IComposeJsonToSave {
  assetDatas: IFileDetail[];
  shares: IShared[];
}

const composeJsonToSave = ({
  assetDatas,
  shares,
}: IComposeJsonToSave): IComposed[] => {
  const composed: IComposed[] = [];

  shares.forEach(({ id, role }) => {
    assetDatas.forEach((d) => {
      composed.push({
        fileId: d.id,
        isFolder: d.mimeType === TYPE_FOLDER,
        sharedWith: id,
        role: toRemove.has(role) ? null : role,
      });
    });
  });

  return composed;
};

export default composeJsonToSave;
