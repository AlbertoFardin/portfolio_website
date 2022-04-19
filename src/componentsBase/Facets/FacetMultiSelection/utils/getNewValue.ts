import { IItem } from "../IFacetMultiSelection";

interface IGetNewValue {
  value: IItem[];
  valueMax: number;
  item: IItem;
}

const getNewValue = ({ value, item, valueMax }: IGetNewValue): IItem[] => {
  const newValue = Array.from(value);
  const itemIndex = newValue.findIndex((v) => v.id === item.id);
  const itemExist = itemIndex !== -1;

  if (valueMax === 1) return itemExist ? [] : [item];
  // exist index => remove item to new value
  // no exist index => add item to new value
  if (itemExist) {
    newValue.splice(itemIndex, 1);
  } else {
    if (!valueMax || newValue.length < valueMax) {
      newValue.push(item);
    } else {
      console.warn("FacetMultiSelection: limit of selected items");
    }
  }

  return newValue;
};

export default getNewValue;
