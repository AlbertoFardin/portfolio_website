import { ITreeItem } from "./interfaces";

const getChildren = (items: ITreeItem[], parent?: string): ITreeItem[] => {
  return items.filter((c) => {
    if (!parent) return !c.parent;
    return c.parent === parent;
  });
};

export default getChildren;
