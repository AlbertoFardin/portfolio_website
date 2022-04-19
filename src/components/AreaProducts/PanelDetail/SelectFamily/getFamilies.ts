import { FAMILY_CONF } from "../constants";
import { IColumnSc, IProduct } from "../../../../interfaces";
import existFamilyInTenant from "../existFamilyInTenant";
import existFamilyInProduct from "../existFamilyInProduct";

const getFamilies = (
  columns: IColumnSc[],
  assetdataCount: number,
  assetdataMerge: IProduct
) =>
  FAMILY_CONF.filter(({ bulk }) => (assetdataCount > 1 ? bulk : true))
    .filter(({ id }) => existFamilyInTenant(id, columns))
    .filter(({ id }) => existFamilyInProduct(id, columns, assetdataMerge));

export default getFamilies;
