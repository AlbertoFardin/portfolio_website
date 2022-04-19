import { v4 } from "uuid";

const valueDiff = "___ValueDiff___" + v4();

interface IGetAssetdataDirty {
  attributeKey: string;
  attributeValue;
  assetDatas;
  assetdataDirty;
}

const getAssetdataDirty = ({
  attributeKey,
  attributeValue,
  assetDatas,
  assetdataDirty,
}: IGetAssetdataDirty) => {
  ///////////////////////////////////////////////////////////
  // salvo il valore inputtato in assetdataDirty
  const newDirty = {
    ...assetdataDirty,
    [attributeKey]: attributeValue,
  };

  ///////////////////////////////////////////////////////////
  // ottengo il value da comparare col value inputtato
  // il valore dell'attributo è
  // a) il valore COMUNE assetDatas[0][attributeId], oppure
  // b) VALUE_DIFFERENT se qualcuno dei assetDatas[attributeId] è differente.
  const valueToCompare = assetDatas.reduce((acc, data) => {
    const val = data[attributeKey];
    const valueInFirst = acc == undefined ? undefined : acc;
    const valueInArray = val == undefined ? undefined : val;
    return valueInFirst !== valueInArray ? valueDiff : valueInFirst;
  }, assetDatas[0][attributeKey]);

  ///////////////////////////////////////////////////////////
  // pulisco assetdataDirty se il value da comparare è uguale al value inputato
  // uso JSON.stringify per comparare i valori di oggetti ed array
  if (JSON.stringify(attributeValue) === JSON.stringify(valueToCompare)) {
    delete newDirty[attributeKey];
  }

  ///////////////////////////////////////////////////////////
  return newDirty;
};

export default getAssetdataDirty;
