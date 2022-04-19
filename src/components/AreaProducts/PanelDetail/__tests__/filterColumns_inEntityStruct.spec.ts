import { TypeCell } from "../../../../componentsBase/StickyGrid";
import { KEY_ENTITY_STRUCTURE_ID, KEY_ROOT_ID } from "../../../../constants";
import { IColumnSc, IProduct } from "../../../../interfaces";
import { inEntityStruct } from "../filterColumns";

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
  [KEY_ENTITY_STRUCTURE_ID]: "size",
};

describe("filterColumns - inEntityStruct", () => {
  test("attribute without", () => {
    const c = {
      ...columnDefault,
    };
    expect(true).toEqual(inEntityStruct(c, assetdata));
  });

  test("attribute within - true", () => {
    const c = {
      ...columnDefault,
      entityStructureId: "size",
    };
    expect(true).toEqual(inEntityStruct(c, assetdata));
  });

  test("attribute within - false", () => {
    const c = {
      ...columnDefault,
      entityStructureId: "color",
    };
    expect(false).toEqual(inEntityStruct(c, assetdata));
  });
});
