import { IItemsSet, IItem } from "../componentsBase/ConfigManagement";

interface InterfaceWithId {
  id: string;
}

const getActiveItems = <T extends InterfaceWithId>(
  itemsSets: IItemsSet[],
  dizs: T[]
): T[] => {
  const setActive = itemsSets.find((f: IItemsSet) => f.active);
  const setActiveItems = setActive ? setActive.items : [];
  const items: T[] = setActive
    ? setActiveItems.reduce((acc, { id }: IItem) => {
        const facet = dizs.find((f: T) => id === f.id);
        if (facet) acc.push(facet);
        return acc;
      }, [])
    : dizs;

  return items;
};

export default getActiveItems;
