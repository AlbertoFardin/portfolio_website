import { IColumnSc, EsTabular } from "../../../interfaces";
import { IDataDictionary } from "./getDataDictionaries";
import getValuedAttributeKeysDictionary from "./getValuedAttributeKeysDictionary";
import { getAttributeId } from "../getAttributeKey";
import { ATT_NO_LANG_ID } from "../PanelDetail/constants";

const decorateAttributesDictionary = (
  item: EsTabular,
  columns: IColumnSc[],
  datasDictionary: IDataDictionary[]
) => {
  const obj = {};
  const attributeKeys = getValuedAttributeKeysDictionary(item, columns);

  attributeKeys.forEach((attributeKey) => {
    const attributeValue = item[attributeKey];
    const { id, catalogId, languageId } = getAttributeId(attributeKey);

    const dictsData = datasDictionary.find((d) => d.attributeId === id);
    const dictsValue =
      typeof attributeValue === "string" ? [attributeValue] : attributeValue;

    obj[attributeKey] = dictsValue.map((code) => {
      const dict = dictsData.dictionaries.find((d) => {
        if (d.code !== code) return false;
        return !!d.catalog ? d.catalog === catalogId : true;
      });

      if (!dict) {
        console.warn("Dictionary not found", {
          attributeId: id,
          attributeKey,
          dictsData,
          attributeValue: code,
        });
      }

      return {
        code,
        value: !!dict ? dict.value[languageId || ATT_NO_LANG_ID] : "⚠️",
      };
    });
  });

  return obj;
};

export default decorateAttributesDictionary;
