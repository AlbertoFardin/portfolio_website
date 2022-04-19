import {
  ISortOrder,
  SortColumn,
} from "../../componentsBase/StickyGrid/interfaces";
import { IAdminUserProfile } from "../../interfaces";
import {
  CREATED_AT_KEY,
  EMAIL_KEY,
  FIRST_NAME_KEY,
  LAST_NAME_KEY,
  UPDATED_AT_KEY,
} from "./constants";

const sortUsers = (
  users: IAdminUserProfile[],
  sorts: SortColumn[]
): IAdminUserProfile[] => {
  const newUsers = Array.from(users);

  const { id, order } = sorts[0];

  if (id === FIRST_NAME_KEY || id === LAST_NAME_KEY || id === EMAIL_KEY) {
    if (order !== ISortOrder.NONE) {
      const sortOrder = order === ISortOrder.ASC ? -1 : 1;

      newUsers.sort((a, b) =>
        a.profileData[id] < b.profileData[id]
          ? sortOrder
          : a.profileData[id] === b.profileData[id]
          ? 0
          : -sortOrder
      );
    }
  }
  if (id === CREATED_AT_KEY || id === UPDATED_AT_KEY) {
    if (order !== ISortOrder.NONE) {
      const sortOrder = order === ISortOrder.ASC ? -1 : 1;

      newUsers.sort((a, b) =>
        new Date(a[id]).getTime() < new Date(b[id]).getTime()
          ? sortOrder
          : new Date(a[id]).getTime() === new Date(b[id]).getTime()
          ? 0
          : -sortOrder
      );
    }
  }

  return newUsers;
};

export default sortUsers;
