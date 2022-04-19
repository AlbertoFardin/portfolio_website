import { TypeCell } from "../../../../componentsBase/StickyGrid";
import { IColumnSc } from "../../../../interfaces";
import { inMultiCatalog } from "../filterColumns";

const columnDefault: IColumnSc = {
  id: "_id",
  label: "_label",
  scope: [],
  groupId: "default",
  type: TypeCell.String,
  width: 100,
  multiCatalog: false,
  multiLanguage: false,
};

describe("filterColumns - inMultiCatalog", () => {
  test("attribute NO multi", () => {
    const c = {
      ...columnDefault,
    };
    expect(true).toEqual(inMultiCatalog(c, []));
  });

  test("attribute multiCatalog", () => {
    const c = {
      ...columnDefault,
      multiCatalog: true,
    };
    expect(true).toEqual(inMultiCatalog(c, []));
  });

  test("attribute multiLanguage witout languages", () => {
    const c = {
      ...columnDefault,
      multiCatalog: true,
      multiLanguage: true,
    };
    expect(false).toEqual(inMultiCatalog(c, []));
  });

  test("attribute multiLanguage witout languages", () => {
    const c = {
      ...columnDefault,
      multiCatalog: false,
      multiLanguage: false,
    };
    expect(true).toEqual(inMultiCatalog(c, ["lang1", "lang2"]));
  });
});
