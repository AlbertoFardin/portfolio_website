import { concantValues } from "../getQuery";

describe("getQuery - concantValues", () => {
  test("wildcard false", () => {
    const expected = [
      { wildcard: { test: { value: "apple", case_insensitive: false } } },
      { wildcard: { test: { value: "banana", case_insensitive: false } } },
    ];
    const id = "test";
    const values = ["apple", "banana"];
    const wildcard = false;
    expect(expected).toEqual(concantValues(id, values, wildcard));
  });

  test("wildcard true", () => {
    const expected = [
      { wildcard: { test: { value: "*apple*", case_insensitive: false } } },
      { wildcard: { test: { value: "*banana*", case_insensitive: false } } },
    ];
    const id = "test";
    const values = ["apple", "banana"];
    const wildcard = true;
    expect(expected).toEqual(concantValues(id, values, wildcard));
  });
});
