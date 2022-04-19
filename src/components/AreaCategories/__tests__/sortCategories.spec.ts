import * as mock from "../mock_categories.json";
import sortCategories from "../sortCategories";

describe("sortCategories", () => {
  test("sort mock", () => {
    expect(
      sortCategories(mock).map(
        (c) => c.data.displayOrder + "__" + c.id + "__" + (c.data.depth - 1)
      )
    ).toEqual([
      "1__product://?product_categories-China-Women__0",
      "2__product://?product_categories-China-Men__0",
      "3__product://?product_categories-China-Kids__0",
      "1__product://?product_categories-EMEA-Women__0",
      "1__product://?product_categories-EMEA-Women/New arrivals__1",
      "1__product://?product_categories-EMEA-Women/Top__1",
      "1__product://?product_categories-EMEA-Women/Top/Shirts__2",
      "2__product://?product_categories-EMEA-Women/Top/T-Shirts__2",
      "2__product://?product_categories-EMEA-Women/Beauty__1",
      "3__product://?product_categories-EMEA-Women/Pants__1",
      "3__product://?product_categories-EMEA-Women/Shoes__1",
      "1__product://?product_categories-EMEA-Women/Shoes/Sneakers__2",
      "2__product://?product_categories-EMEA-Women/Shoes/Boots__2",
      "4__product://?product_categories-EMEA-Women/Skirts__1",
      "2__product://?product_categories-EMEA-Men__0",
      "1__product://?product_categories-EMEA-Men/New arrivals__1",
      "3__product://?product_categories-EMEA-Kids__0",
      "1__product://?product_categories-EMEA-Kids/New arrivals__1",
      "2__product://?product_categories-Farfetch-Women__0",
      "1__product://?product_categories-Farfetch-Women/Sale__1",
      "3__product://?product_categories-Farfetch-Men__0",
      "1__product://?product_categories-Farfetch-Men/Sale__1",
      "4__product://?product_categories-Farfetch-Kids__0",
      "1__product://?product_categories-Farfetch-Kids/Sale__1",
      "1__product://?product_categories-Russia-Women__0",
      "2__product://?product_categories-Russia-Men__0",
      "3__product://?product_categories-Russia-Kids__0",
      "1__product://?product_categories-US-Women__0",
      "2__product://?product_categories-US-Men__0",
      "3__product://?product_categories-US-Kids__0",
    ]);
  });
});
