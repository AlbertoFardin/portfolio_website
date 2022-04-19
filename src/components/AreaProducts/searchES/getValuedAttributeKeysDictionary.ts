import { EditFieldType, IColumnSc, EsTabular } from "../../../interfaces";
import { getAttributeId } from "../getAttributeKey";
import isEmpty from "lodash-es/isEmpty";

const getValuedAttributeKeysDictionary = (
  item: EsTabular,
  columns: IColumnSc[]
): string[] => {
  const attributeKeys = Object.keys(item)
    .filter((attributeKey) => {
      const { id } = getAttributeId(attributeKey);
      const column = columns.find((c) => c.id === id);

      return (
        !!column &&
        !!column.editField &&
        column.editField.type === EditFieldType.SelectField
      );
    })
    .filter((attributeKey) => {
      const attributeValue = item[attributeKey];

      return !isEmpty(attributeValue);
    });

  return attributeKeys;
};

export default getValuedAttributeKeysDictionary;
