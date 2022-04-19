import { IColumnSc, AttributeFamily, IProduct } from "../../../../interfaces";
import { FAMILY_CONF } from "../constants";
import existFamilyInTenant from "../existFamilyInTenant";
import existFamilyInProduct from "../existFamilyInProduct";

const getVisibleFamilies = (
  family: AttributeFamily,
  columns: IColumnSc[],
  assetdataCount: number,
  assetdataMerge: IProduct
): AttributeFamily[] => {
  const conf = FAMILY_CONF.find((c) => c.id === family);

  if (!conf) return [];
  if (!conf.children.length) return [family];

  return conf.children
    .map((f) => FAMILY_CONF.find((c) => c.id === f))
    .filter((f) => (assetdataCount === 1 ? true : f.bulk))
    .filter((f) => existFamilyInTenant(f.id, columns))
    .filter((f) => existFamilyInProduct(f.id, columns, assetdataMerge))
    .map((f) => f.id);
};

export default getVisibleFamilies;
