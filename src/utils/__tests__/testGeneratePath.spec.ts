import { generatePath } from "react-router";
import { AREA_PRODUCTS } from "../../constants";

test('test result generatePath for "react-router"', () => {
  const res = `/${AREA_PRODUCTS}/:KEYPAR_ENTITY/:KEYPAR_DETAIL/:KEYPAR_TAB/:KEYPAR_IMAGE`;

  const result = generatePath(res, {
    KEYPAR_ENTITY: "product://6RjdSIa7Bi8IN7Dj/color:111",
    KEYPAR_DETAIL: true,
    KEYPAR_TAB: "tMedia",
    KEYPAR_IMAGE: "862c1e3d-a84c-4b7f-9155-3b5996b16315",
  });

  expect(result).toEqual(
    "/products/product:%2F%2F6RjdSIa7Bi8IN7Dj%2Fcolor:111/true/tMedia/862c1e3d-a84c-4b7f-9155-3b5996b16315"
  );
  const query = new URLSearchParams("");

  query.set("test", "product://6RjdSIa7Bi8IN7Dj/color:111");

  expect(query.toString()).toEqual(
    "test=product%3A%2F%2F6RjdSIa7Bi8IN7Dj%2Fcolor%3A111"
  );
});
