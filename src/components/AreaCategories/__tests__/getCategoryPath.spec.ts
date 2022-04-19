import * as mock from "../mock_categories.json";
import getCategoryPath from "../getCategoryPath";

describe("getCategoryPath", () => {
  test("category not found", () => {
    expect(
      getCategoryPath({
        categoryId: "category_id_not_found",
        languageId: "en",
        categories: mock,
      })
    ).toEqual("");
  });

  test("category parent", () => {
    expect(
      getCategoryPath({
        categoryId: "product://?product_categories-EMEA-Women",
        languageId: "es",
        categories: mock,
      })
    ).toEqual("Mujer");
  });

  test("category parent - with language unknown", () => {
    expect(
      getCategoryPath({
        categoryId: "product://?product_categories-EMEA-Women",
        languageId: "language_unknown",
        categories: mock,
      })
    ).toEqual(undefined);
  });

  test("category indented", () => {
    expect(
      getCategoryPath({
        categoryId: "product://?product_categories-EMEA-Women/Shoes/Boots",
        languageId: "it",
        categories: mock,
      })
    ).toEqual("Donna > Scarpe > Stivali");
  });

  test("category indented - with language unknown", () => {
    expect(
      getCategoryPath({
        categoryId: "product://?product_categories-EMEA-Women/Shoes/Boots",
        languageId: "language_unknown",
        categories: mock,
      })
    ).toEqual(undefined);
  });
});
