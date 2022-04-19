import { IFileDetail, IShared, SharedRole } from "../../../interfaces";
import getRoleUpdated from "./getRoleUpdated";
import getRoleOrganiz from "./getRoleOrganiz";
import { ORGANIZATION_ID } from "../constants";

interface IGetRoleOrganizEdited {
  assetDatas: IFileDetail[];
  sharesToEdited: IShared[];
}

interface IReturnRoleOrganizEdited {
  isEdited: boolean;
  roleOrganizInitial: SharedRole;
  roleOrganizUpdated: SharedRole;
}

const getRoleOrganizEdited = ({
  assetDatas,
  sharesToEdited,
}: IGetRoleOrganizEdited): IReturnRoleOrganizEdited => {
  const roleOrganizInitial = getRoleOrganiz(assetDatas);
  const roleOrganizUpdated = getRoleUpdated(
    ORGANIZATION_ID,
    roleOrganizInitial,
    sharesToEdited
  );
  const isEdited = roleOrganizInitial !== roleOrganizUpdated;

  return {
    isEdited,
    roleOrganizInitial,
    roleOrganizUpdated,
  };
};

export default getRoleOrganizEdited;
