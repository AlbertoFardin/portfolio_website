import { AREA_PRODUCTS } from "../constants";

const overrideMap = {
  [AREA_PRODUCTS]: "catalog",
};

const getJsonDocId = (viewId: string, layout: string, id: string): string => {
  const viewIdfix = overrideMap[viewId] || viewId;
  return [viewIdfix, layout, id].join("_");
};

export default getJsonDocId;
