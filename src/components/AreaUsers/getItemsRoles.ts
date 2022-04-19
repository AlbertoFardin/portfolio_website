import { IRole } from "../../interfaces";

interface IItem {
  id: string;
  label: string;
}

const getItemsRoles = (roles: IRole[]): IItem[] => {
  if (!roles) return [];
  return roles.map(({ roleId, roleLabel }) => ({
    id: roleId,
    label: roleLabel,
  }));
};

export default getItemsRoles;
