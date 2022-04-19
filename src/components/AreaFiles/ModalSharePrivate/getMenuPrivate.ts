import { SharedRole } from "../../../interfaces";

export const getMenuLabel = (roleId: SharedRole): string => {
  switch (roleId) {
    case SharedRole.EDITOR:
      return "Editor";
    case SharedRole.VIEWER:
      return "Viewer";
    case SharedRole.VARIES:
      return "Varies";
    case SharedRole.OWNER:
      return "Owner";
    case SharedRole.TO_REMOVE_PRIVATE:
      return "Remove";
    default:
      return undefined;
  }
};

export const getMenuIcon = (roleId: SharedRole): string => {
  switch (roleId) {
    case SharedRole.EDITOR:
      return "edit";
    case SharedRole.VIEWER:
      return "remove_red_eye";
    case SharedRole.TO_REMOVE_PRIVATE:
      return "delete";
    default:
      return undefined;
  }
};

export const getCreateLabel = (
  roleId: SharedRole,
  itemsCount: number
): string => {
  const i = itemsCount > 1 ? `${itemsCount} items` : "item";
  switch (roleId) {
    case SharedRole.EDITOR:
      return `Can find and edit the selected ${i}`;
    case SharedRole.VIEWER:
      return `Can find and view the selected ${i}`;
    default:
      return undefined;
  }
};
