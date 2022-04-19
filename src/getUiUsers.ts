import { BASE_URL } from "./api/endpoints";
import { IM2m, IUserProfile, IUsersResponse } from "./interfaces";
import mapUser from "./mapUser";

export const getPictureFileId = (picture: string) => {
  const regex = new RegExp(`${BASE_URL}/mcr/media-content/([A-Za-z0-9-]+)/s`);
  if (regex.test(picture)) {
    const [, group] = picture.match(regex);
    return group;
  }
  return null;
};

export default (
  userProfile: IUsersResponse
): { users: IUserProfile[]; m2ms: IM2m[] } => {
  return {
    users: (userProfile.users || []).map(mapUser),
    m2ms: userProfile.m2m || [],
  };
};
