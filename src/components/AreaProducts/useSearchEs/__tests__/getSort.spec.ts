import { ISortOrder, TypeCell } from "../../../../componentsBase/StickyGrid";
import getSort from "../getSort";

const columns = ["1", "2", "3", "4"].map((id) => ({
  id,
  label: id,
  type: TypeCell.String,
  groupId: "default",
  width: 100,
  scope: [],
}));
const catalogId = "";
const languageId = "";

describe("getSort", () => {
  test("empty", () => {
    const sortsContent = [];
    const expected = [];
    expect(expected).toEqual(
      getSort({ sortsContent, columns, catalogId, languageId })
    );
  });

  test("only sortsContent", () => {
    const sortsContent = [
      {
        id: "2",
        label: "2",
        order: ISortOrder.ASC,
      },
      {
        id: "3",
        label: "3",
        order: ISortOrder.DESC,
      },
      {
        id: "1",
        label: "1",
        order: ISortOrder.ASC,
      },
    ];
    const expected = [
      { "2": { order: ISortOrder.ASC } },
      { "3": { order: ISortOrder.DESC } },
      { "1": { order: ISortOrder.ASC } },
    ];
    expect(expected).toEqual(
      getSort({ sortsContent, columns, catalogId, languageId })
    );
  });

  test("only sortsContent", () => {
    const sortsContent = [
      {
        id: "2",
        label: "2",
        order: ISortOrder.ASC,
      },
      {
        id: "4",
        label: "4",
        order: ISortOrder.DESC,
      },
      {
        id: "1",
        label: "1",
        order: ISortOrder.ASC,
      },
    ];
    const expected = [
      { "2": { order: ISortOrder.ASC } },
      { "4": { order: ISortOrder.DESC } },
      { "1": { order: ISortOrder.ASC } },
    ];
    expect(expected).toEqual(
      getSort({ sortsContent, columns, catalogId, languageId })
    );
  });
});
