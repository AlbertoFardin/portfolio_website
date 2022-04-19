import { TypeCell } from "../../../../componentsBase/StickyGrid";
import { IColumnSc } from "../../../../interfaces";
import { inSearchInput } from "../filterColumns";

const c: IColumnSc = {
  id: "_id",
  label: "_label",
  scope: [],
  groupId: "default",
  type: TypeCell.String,
  width: 100,
};

describe("filterColumns - inSearchInput", () => {
  test("attribute without", () => {
    expect(true).toEqual(inSearchInput(c, ""));
  });

  test("attribute within - true", () => {
    expect(true).toEqual(inSearchInput(c, "abe"));
  });

  test("attribute within - false", () => {
    expect(false).toEqual(inSearchInput(c, "ciaone"));
  });
});
