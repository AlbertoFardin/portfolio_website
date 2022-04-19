import { getAttributeId } from "../../getAttributeKey";
import isEmpty from "lodash-es/isEmpty";

const getDialogDictValue = ({
  assetdataDirty,
  assetdataMerge,
  attributeId,
  catalogId,
  open,
}) => {
  if (!open) return {};

  const key = attributeId + `.(${catalogId})`;
  const isDirty = !!Object.keys(assetdataDirty).find((k) => k.includes(key));
  const assetdata = isDirty ? assetdataDirty : assetdataMerge;
  return Object.keys(assetdata).reduce((acc, k) => {
    const v = assetdata[k];
    if (!k.includes(key) || isEmpty(v)) return acc;

    const { languageId } = getAttributeId(k);

    acc[languageId] = v;
    return acc;
  }, {});
};

export default getDialogDictValue;
