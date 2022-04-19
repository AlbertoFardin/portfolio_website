import { KEY_VIEW_DATA } from "../../../../constants";
import { IProduct } from "../../../../interfaces";
import { IViewDraft, ViewStatus } from "../reducer";

interface ISelectValue {
  value;
  placeholder: boolean;
}

interface IGetSelectValue {
  key: string;
  items: IProduct[];
  viewDraft: IViewDraft;
}

const getSelectValue = ({
  key,
  items,
  viewDraft,
}: IGetSelectValue): ISelectValue => {
  const { id, status, data } = viewDraft;
  const itemsValue = items.reduce((acc, item) => {
    (item[KEY_VIEW_DATA] || []).forEach((v) => {
      if (v.viewName === id) acc.push(JSON.stringify(v[key]));
    });
    return acc;
  }, []);

  const itemsValueSize = new Set(itemsValue).size;

  if (status === ViewStatus.NONE) {
    return {
      value: "-",
      placeholder: true,
    };
  }

  if (data[key] && data[key].length) {
    return {
      value: data[key],
      placeholder: false,
    };
  }

  if (!data[key] && itemsValueSize === 1) {
    return {
      value: JSON.parse(itemsValue[0]),
      placeholder: false,
    };
  }

  if (!data[key] && itemsValueSize > 1) {
    return {
      value: "MULTI VALUES",
      placeholder: true,
    };
  }

  return {
    value: "SELECT",
    placeholder: true,
  };
};

export default getSelectValue;
