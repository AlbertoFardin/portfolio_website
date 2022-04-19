import { USER_AVATAR_PLACEHOLDER } from "../constants";
import { IUserProfile, IM2m } from "../interfaces";

const DEFAULT_USER = {
  id: "",
  sub: "",
  updatedAt: "",
  createdAt: "",
  picture: USER_AVATAR_PLACEHOLDER,
  firstName: "",
  lastName: "",
  group: "",
  roles: [],
  placeholder: "Unknown User",
};

interface IUserProfileWithName extends IUserProfile {
  name: string;
  placeholder: string;
}

const getUser = (
  id: string,
  usersAndM2ms: { users: IUserProfile[]; m2ms: IM2m[] }
): IUserProfileWithName => {
  const { users, m2ms } = usersAndM2ms;
  const user = users.find((u) => u.id === id);

  if (user)
    return {
      ...user,
      placeholder: "",
      name: `${user.firstName} ${user.lastName}`,
    };

  const m2m = m2ms.find((u) => u.clientId === id);
  if (m2m)
    return {
      ...DEFAULT_USER,
      id: m2m.clientId,
      name: m2m.name,
    };

  return {
    ...DEFAULT_USER,
    id,
    name: id,
  };
};

export default getUser;
