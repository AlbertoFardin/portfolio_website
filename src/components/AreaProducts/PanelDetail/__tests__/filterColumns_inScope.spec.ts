import { TypeCell } from "../../../../componentsBase/StickyGrid";
import { IColumnSc } from "../../../../interfaces";
import { inScope } from "../filterColumns";

const columnDefault: IColumnSc = {
  id: "_id",
  label: "_label",
  scope: [],
  groupId: "default",
  type: TypeCell.String,
  width: 100,
};

describe("filterColumns - inScope", () => {
  test("attribute without - false", () => {
    const c = {
      ...columnDefault,
    };
    expect(true).toEqual(inScope(c, "cat2"));
  });

  test("attribute within - true", () => {
    const c = {
      ...columnDefault,
      scope: ["cat1", "cat2", "cat3"],
    };
    expect(true).toEqual(inScope(c, "cat2"));
  });

  test("attribute within - false", () => {
    const c = {
      ...columnDefault,
      scope: ["cat1", "cat2", "cat3"],
    };
    expect(false).toEqual(inScope(c, "ciao"));
  });
});
