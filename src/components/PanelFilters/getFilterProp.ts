import { IFilter } from "../../interfaces";

const getFilterProp = ({
  attributeStructureId,
  id,
  keyword,
  multiCatalog,
  multiLanguage,
  nested,
  sortId,
  sticky,
  type,
}: IFilter) => ({
  attributeStructureId,
  id,
  keyword,
  multiCatalog,
  multiLanguage,
  nested,
  sortId,
  sticky,
  type,
});

export default getFilterProp;
