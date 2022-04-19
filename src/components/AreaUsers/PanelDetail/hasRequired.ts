import { IAdminUserProfile } from "../../../interfaces";
import { FIRST_NAME_KEY, LAST_NAME_KEY, EMAIL_KEY } from "../constants";

const set = new Set([FIRST_NAME_KEY, LAST_NAME_KEY, EMAIL_KEY]);

export const isRequired = (id: string): boolean => {
  return set.has(id);
};

const hasRequired = ({
  applications,
  profileData,
}: IAdminUserProfile): boolean => {
  if (!!applications && applications.length === 0) return false;

  return !Object.keys(profileData).find((key) => {
    return isRequired(key) && !profileData[key];
  });
};

export default hasRequired;
