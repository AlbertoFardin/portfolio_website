import * as Colors from "../../../../componentsBase/style/Colors";

export enum ICON {
  SELECTED = "check_box",
  NONE_SELECTED = "check_box_outline_blank",
  SOME_SELECTED = "indeterminate_check_box",
}

const getListIcon = (ids: string[], idsSelected: string[]): [ICON, string] => {
  const isSelectAll = !ids.find((id) => !new Set(idsSelected).has(id));
  if (isSelectAll) return [ICON.SELECTED, Colors.Purple];

  const isDeselectAll = !ids.find((id) => new Set(idsSelected).has(id));
  if (isDeselectAll) return [ICON.NONE_SELECTED, Colors.Gray2];

  return [ICON.SOME_SELECTED, Colors.Purple];
};

export default getListIcon;
