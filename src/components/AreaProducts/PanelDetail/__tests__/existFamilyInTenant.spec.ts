import { TypeCell } from "../../../../componentsBase/StickyGrid";
import { AttributeFamily, IColumnSc } from "../../../../interfaces";
import existFamilyInTenant from "../existFamilyInTenant";

const c: IColumnSc[] = [
  {
    id: "association_id",
    label: "association_label",
    scope: [],
    groupId: "default",
    type: TypeCell.String,
    width: 100,
    attributeFamily: AttributeFamily.ASSOCIATION,
  },
  {
    id: "editoria_id",
    label: "planning_label",
    scope: [],
    groupId: "default",
    type: TypeCell.String,
    width: 100,
    attributeFamily: AttributeFamily.EDITORIAL,
  },
  {
    id: "media_id",
    label: "media_label",
    scope: [],
    groupId: "default",
    type: TypeCell.MultipleThumbnail,
    width: 100,
    attributeFamily: AttributeFamily.MEDIA,
  },
];

describe("existFamilyInTenant", () => {
  test("family unexisted", () => {
    const f = "CIAO" as AttributeFamily;
    expect(false).toEqual(existFamilyInTenant(f, c));
  });

  test("family exist in array", () => {
    const f = AttributeFamily.EDITORIAL;
    expect(true).toEqual(existFamilyInTenant(f, c));
  });

  test("family not exist in array", () => {
    const f = AttributeFamily.OTHERS;
    expect(false).toEqual(existFamilyInTenant(f, c));
  });

  test("family MEDIA", () => {
    const f = AttributeFamily.MEDIA;
    expect(true).toEqual(existFamilyInTenant(f, c));
  });

  test("family ALL_ATTRIBUTES", () => {
    const f = AttributeFamily.ALL_ATTRIBUTES;
    expect(true).toEqual(existFamilyInTenant(f, c));
  });
});
