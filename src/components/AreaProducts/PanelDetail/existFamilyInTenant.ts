import { TypeCell } from "../../../componentsBase/StickyGrid";
import { IColumnSc, AttributeFamily } from "../../../interfaces";
import { FAMILY_CONF } from "./constants";

const existFamilyInTenant = (
  family: AttributeFamily,
  columns: IColumnSc[]
): boolean => {
  const f = FAMILY_CONF.find((f) => f.id === family);

  if (!f) return false;

  if (family === AttributeFamily.MEDIA) {
    return !!columns.find((c) => c.type === TypeCell.MultipleThumbnail);
  }

  return !!columns.find(({ attributeFamily }) => {
    if (!!f.children.length) {
      return new Set(f.children).has(attributeFamily);
    } else {
      return attributeFamily === family;
    }
  });
};

export default existFamilyInTenant;
