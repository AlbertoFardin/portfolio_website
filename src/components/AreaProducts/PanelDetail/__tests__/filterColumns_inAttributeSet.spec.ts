import { TypeCell } from "../../../../componentsBase/StickyGrid";
import { KEY_ATTRIBUTE_SETS, KEY_ROOT_ID } from "../../../../constants";
import { IColumnSc, IProduct } from "../../../../interfaces";
import { inAttributeSet } from "../filterColumns";

const columnDefault: IColumnSc = {
  id: "_id",
  label: "_label",
  scope: [],
  groupId: "default",
  type: TypeCell.String,
  width: 100,
};
const assetdata: IProduct = {
  id: "product_id",
  version: 1,
  [KEY_ROOT_ID]: "root_id",
  [KEY_ATTRIBUTE_SETS]: ["jeans", "scarpe", "maglia"],
};

describe("filterColumns - inAttributeSet", () => {
  test("attribute without", () => {
    const c = {
      ...columnDefault,
      [KEY_ATTRIBUTE_SETS]: [],
    };
    expect(true).toEqual(inAttributeSet(c, assetdata));
  });

  test("attribute within - true", () => {
    const c = {
      ...columnDefault,
      [KEY_ATTRIBUTE_SETS]: ["scarpe"],
    };
    expect(true).toEqual(inAttributeSet(c, assetdata));
  });

  test("attribute within - false", () => {
    const c = {
      ...columnDefault,
      [KEY_ATTRIBUTE_SETS]: ["ciaone"],
    };
    expect(false).toEqual(inAttributeSet(c, assetdata));
  });
});
