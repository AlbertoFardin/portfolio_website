import { USER_AVATAR_PLACEHOLDER } from "./constants";
import { IUserProfile } from "./interfaces";

export default ({
  userId: id,
  profileData: {
    updatedAt,
    createdAt,
    picture,
    firstName,
    lastName,
    email,
    group: groupId,
  },
  tenantId,
  tenants,
  roles,
  sub,
}): IUserProfile => ({
  id,
  sub,
  updatedAt,
  createdAt,
  picture: picture || USER_AVATAR_PLACEHOLDER,
  firstName,
  lastName,
  email,
  groupId,
  tenantId,
  tenants,
  roles: roles.map(({ roleId: id, roleLabel: label }) => ({
    id,
    label,
  })),
});
