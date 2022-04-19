import {
  IColumnSc,
  IDictionary,
  DictionaryType,
  EsTabular,
  IItemEs,
} from "../../../interfaces";
import { getAttributeId } from "../getAttributeKey";
import { getDictionaries } from "../../../api/fetchesApi";
import getValuedAttributeKeysDictionary from "./getValuedAttributeKeysDictionary";

export interface IDataDictionary {
  attributeId: string;
  dictionaries: IDictionary[];
}

interface IConf {
  attributeId: string;
  dictionaryId: string;
  dictionaryType: DictionaryType;
  value: {
    [catalogId: string]: string[];
  };
}

export const getConfs = (
  items: IItemEs<EsTabular>[],
  columns: IColumnSc[]
): IConf[] => {
  const confs: IConf[] = [];

  items.forEach(({ data }) => {
    const attributeKeys = getValuedAttributeKeysDictionary(data, columns);

    attributeKeys.forEach((attributeKey) => {
      const { id } = getAttributeId(attributeKey);
      const column = columns.find((c) => c.id === id);
      const { dictionaryType, dictionaryId } = column.editField;

      const c = confs.find(
        (x) =>
          x.attributeId === id &&
          x.dictionaryType === dictionaryType &&
          x.dictionaryId === dictionaryId
      );

      if (!c) {
        confs.push({
          attributeId: id,
          dictionaryType,
          dictionaryId,
          value: {},
        });
      }
    });

    attributeKeys.forEach((attributeKey) => {
      const { id, catalogId } = getAttributeId(attributeKey);
      const column = columns.find((c) => c.id === id);
      const {
        dictionaryType,
        dictionaryId,
        multiSelectable,
      } = column.editField;

      const c = confs.find(
        (x) =>
          x.attributeId === id &&
          x.dictionaryType === dictionaryType &&
          x.dictionaryId === dictionaryId
      );
      if (!c.value[catalogId]) {
        c.value[catalogId] = [];
      }

      const codesSet = new Set(c.value[catalogId]);

      const codesValue = multiSelectable
        ? data[attributeKey]
        : [data[attributeKey]];

      codesValue.forEach((v) => {
        if (!codesSet.has(v)) {
          c.value[catalogId].push(v);
        }
      });
    });
  });

  return confs;
};

const getDataDictionaries = async (
  items: IItemEs<EsTabular>[],
  columns: IColumnSc[]
): Promise<IDataDictionary[]> => {
  const fn = async (x: IConf) => ({
    attributeId: x.attributeId,
    dictionaries: await getDictionaries(x),
  });

  return Promise.all(getConfs(items, columns).map(fn));
};

export default getDataDictionaries;
