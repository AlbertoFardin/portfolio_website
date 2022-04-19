import { AttributeType, IAttribute } from "../../interfaces";
import { typeDict } from "./reducer";
import isEmpty from "lodash-es/isEmpty";

export const requiredMap = {
  [AttributeType.MASTER]: [
    "attributeType",
    "atype",
    "mandatory",
    "attributeName",
    "label",
    "level",
    "groupId",
    "exportable",
  ],
  [AttributeType.SYSTEM]: [
    "attributeType",
    "atype",
    "mandatory",
    "attributeName",
    "label",
    "level",
    "groupId",
    "exportable",
  ],
  [AttributeType.USER]: [
    "attributeType",
    "attributeFamily",
    "atype",
    "mandatory",
    "attributeName",
    "label",
    "level",
    "groupId",
    "exportable",
    "carryOver",
    "multiCatalog",
  ],
};

const hasRequired = (data: IAttribute): boolean => {
  const {
    atype,
    attributeType,
    multiCatalog,
    multiLanguage,
    dictionary,
  } = data;

  // se non possiede attributeType
  if (!attributeType) return false;

  // se manca una delle chiave required
  const oneRequiredUndefined = !!requiredMap[attributeType].find(
    (id) => data[id] === undefined || data[id] === null
  );
  if (oneRequiredUndefined) return false;

  // se è un multiCatalog ma non si è definito multiLanguage
  if (!!multiCatalog && multiLanguage === undefined) return false;

  // se è di tipo dict deve possedere almeno un dizionario
  if (typeDict.has(atype) && isEmpty(dictionary)) return false;

  return true;
};

export default hasRequired;
