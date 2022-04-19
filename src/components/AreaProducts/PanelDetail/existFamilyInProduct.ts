import { KEY_VIEW_DATA } from "../../../constants";
import {
  AttributeFamily,
  IColumnSc,
  IProduct,
  IViewData,
} from "../../../interfaces";
import { FAMILY_CONF } from "./constants";

const existFamilyInProduct = (
  family: AttributeFamily,
  columns: IColumnSc[],
  assetdataMerge: IProduct
): boolean => {
  const f = FAMILY_CONF.find((f) => f.id === family);
  if (!f) return false;

  if (family === AttributeFamily.MEDIA) {
    const viewsData = (assetdataMerge[KEY_VIEW_DATA] || []) as IViewData[];
    return !!viewsData.length;
  }

  return !!columns.find(({ attributeFamily, entityStructureId }) => {
    const checkFamily = !!f.children.length
      ? new Set(f.children).has(attributeFamily)
      : attributeFamily === family;
    const checkStrcId =
      !entityStructureId ||
      entityStructureId === assetdataMerge.entityStructureId;

    return checkFamily && checkStrcId;
  });
};

export default existFamilyInProduct;
