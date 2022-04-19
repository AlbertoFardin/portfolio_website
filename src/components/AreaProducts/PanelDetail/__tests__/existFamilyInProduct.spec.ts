import { TypeCell } from "../../../../componentsBase/StickyGrid";
import { KEY_ROOT_ID, KEY_VIEW_DATA } from "../../../../constants";
import {
  AttributeFamily,
  Category,
  IColumnSc,
  IProduct,
  MediaType,
  ViewType,
} from "../../../../interfaces";
import existFamilyInProduct from "../existFamilyInProduct";

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
];
const a: IProduct = {
  id: "product_id",
  version: 1,
  [KEY_ROOT_ID]: "root_id",
};

describe("existFamilyInProduct", () => {
  test("family unexisted", () => {
    const f = "CIAO" as AttributeFamily;
    expect(false).toEqual(existFamilyInProduct(f, c, a));
  });

  test("family MEDIA without views", () => {
    const f = AttributeFamily.MEDIA;
    expect(false).toEqual(existFamilyInProduct(f, c, a));
  });

  test("family MEDIA with views", () => {
    const f = AttributeFamily.MEDIA;
    const a: IProduct = {
      id: "product_id",
      version: 1,
      [KEY_ROOT_ID]: "root_id",
      [KEY_VIEW_DATA]: [
        {
          viewId: "a",
          viewName: "a",
          viewType: ViewType.MANDATORY,
          category: Category.DEFAULT,
          catalog: ["c"],
          mediaType: MediaType.IMAGE_P,
        },
      ],
    };
    expect(true).toEqual(existFamilyInProduct(f, c, a));
  });

  test("family EDITORIAL", () => {
    const f = AttributeFamily.EDITORIAL;
    expect(true).toEqual(existFamilyInProduct(f, c, a));
  });

  test("family ALL_ATTRIBUTES", () => {
    const f = AttributeFamily.ALL_ATTRIBUTES;
    expect(true).toEqual(existFamilyInProduct(f, c, a));
  });
});
