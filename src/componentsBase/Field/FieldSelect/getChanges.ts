import IFieldSelectItem from "./IFieldSelectItem";

interface IGetChanges {
  id: string;
  value: IFieldSelectItem[];
  options: IFieldSelectItem[];
  itemsSelectedMaxLength: number;
  searchable: boolean;
}
const getChanges = ({
  id,
  value,
  options,
  itemsSelectedMaxLength: countSelectedMax,
  searchable,
}: IGetChanges): [IFieldSelectItem, IFieldSelectItem[]] => {
  const countSelected = value.filter((c) => c.selected).length;

  if (searchable) {
    // case field select with search

    const newItems = Array.from(value);
    const itemIndex = newItems.findIndex((v: IFieldSelectItem) => v.id === id);
    const item =
      value.find((o) => o.id === id) || options.find((o) => o.id === id);

    if (countSelected > countSelectedMax) {
      return [item, newItems];
    }

    item.selected = !item.selected;

    if (countSelectedMax === 1) {
      return [item, itemIndex === -1 ? [item] : []];
    }

    if (itemIndex === -1) {
      // no exist => add item to new value
      newItems.push(item);
    } else {
      // exist => remove item to new value
      newItems.splice(itemIndex, 1);
    }

    return [item, newItems];
  } else {
    // case field select with static values
    const newItems = value.map((c) => {
      if (countSelected > countSelectedMax) {
        return c;
      }

      if (countSelectedMax === 1) {
        return { ...c, selected: c.id !== id ? false : !c.selected };
      }

      return c.id !== id ? c : { ...c, selected: !c.selected };
    });
    const newItem = newItems.find((c) => c.id === id);

    return [newItem, newItems];
  }
};

export default getChanges;
