import endpoints from "./api/endpoints";
import { fetchCookieJwtWithRefreshToken } from "./api/fetchCookieJwt";
import getUiUsers from "./getUiUsers";
import {
  IAdminUserProfile,
  IPermission,
  IRole,
  IUserProfileResponse,
  IUsersResponse,
} from "./interfaces";
import mapUser from "./mapUser";

const getUserPermissions = (
  currentUser: IUserProfileResponse
): IPermission[] => {
  return currentUser.permissions
    .find(({ applicationId }) => applicationId === process.env.PRODUCT_ID)
    .permissions.map((id) => ({ id, label: id }));
};

export const getAdminUsers = async (): Promise<IAdminUserProfile[]> => {
  const { url, method } = endpoints.getAdminUsers;
  const data = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
  });
  return data.users;
};

export const getTenantConf = async (): Promise<{
  label: string;
  applications: string[];
  roles: IRole[];
}> => {
  const { url, method } = endpoints.getTenantConfig;
  const res = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
  });

  return {
    label: res.label,
    applications: res.applications.sort(),
    roles: res.roles
      .map((r) => ({ roleId: r.roleId, roleLabel: r.label }))
      .sort((a, b) => {
        if (a.label > b.label) return 1;
        if (a.label < b.label) return -1;
        return 0;
      }),
  };
};

export const createUserAdmin = async (user: IAdminUserProfile) => {
  const { url, method } = endpoints.createUserAdmin;
  await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      applications: user.applications,
      email: user.profileData.email,
      firstName: user.profileData.firstName,
      lastName: user.profileData.lastName,
      isWarda: user.profileData.isWarda,
      roles: user.roles.map((r) => r.roleId),
    },
  });
};

export const createUser = async (user: IAdminUserProfile) => {
  const { url, method } = endpoints.createUser;
  await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
    jsonBody: {
      applications: user.applications,
      email: user.profileData.email,
      firstName: user.profileData.firstName,
      lastName: user.profileData.lastName,
      roles: user.roles.map((r) => r.roleId),
    },
  });
};

export const getUsers = async (): Promise<IUsersResponse> => {
  const { url, method } = endpoints.getUsers;
  const data = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
  });

  return data;
};

export const getCurrentUser = async (): Promise<IUserProfileResponse> => {
  const { url, method } = endpoints.getUserProfile;
  const data = await fetchCookieJwtWithRefreshToken({
    url: url(),
    method,
  });

  return data;
};

export const getUsersAndPermissions = async () => {
  return Promise.all([getUsers(), getCurrentUser()]).then((arrayRes) => {
    return {
      usersAndM2ms: getUiUsers(arrayRes[0]),
      userPermissions: getUserPermissions(arrayRes[1]),
      userProfile: mapUser(arrayRes[1]),
    };
  });
};
