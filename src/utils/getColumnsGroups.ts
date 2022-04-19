import { IItemGroup } from "../componentsBase/ConfigManagement";
import { IColumnSc } from "../interfaces";

const getColumnsGroups = (columns: IColumnSc[]): IItemGroup[] => {
  if (!columns) return [];

  const groupIds = columns.reduce((acc, { groupId }) => {
    if (!new Set(acc).has(groupId)) acc.push(groupId);
    return acc;
  }, [] as string[]);

  return groupIds.map((id) => ({
    id,
    label: id,
  }));
};

export default getColumnsGroups;
