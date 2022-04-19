import * as mock from "../mock_categories.json";
import getCategoryData from "../getCategoryData";

describe("getCategoryData", () => {
  test("category found", () => {
    expect(
      getCategoryData({
        categoryDataId: "Women/Shoes/Boots",
        categoryDataCatalog: "EMEA",
        categories: mock,
      })
    ).toEqual({
      id: "product://?product_categories-EMEA-Women/Shoes/Boots",
      data: {
        attributeStructureId: "product://?product_categories",
        catalog: "EMEA",
        id: "Women/Shoes/Boots",
        displayOrder: 2,
        parent: "Women/Shoes",
        root: "Women",
        labels: {
          en: "Boots",
          it: "Stivali",
          es: "Botas",
          de: "Stiefel",
          fr: "Bottes",
        },
        searchableValue: "Boots Stivali Botas Stiefel Bottes",
      },
    });
  });

  test("category not found", () => {
    expect(
      getCategoryData({
        categoryDataId: "__unknown",
        categoryDataCatalog: "__unknown",
        categories: mock,
      })
    ).toEqual(undefined);
  });
});
