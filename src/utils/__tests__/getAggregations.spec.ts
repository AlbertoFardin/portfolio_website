import { getAggsItems } from "../getAggregations";

describe("getAggregations", () => {
  test("getAggsItems - default", () => {
    const items = [
      { key: "a", doc_count: 10 },
      { key: "b", doc_count: 10 },
      { key: "c", doc_count: 20 },
      { key: "d", doc_count: 30 },
    ];
    const id = "test";
    expect(items).toEqual(getAggsItems(id, items));
  });

  test("getAggsItems - trunc other key", () => {
    const items = [
      { key: "a", doc_count: 10, test: 2 },
      { key: "b", doc_count: 10, label: "label" },
      { key: "c", doc_count: 20, other: "other" },
      { key: "d", doc_count: 30, array: [1, 23, 4] },
      { key: "e", doc_count: 40 },
    ];
    const id = "test";
    const expected = [
      { key: "a", doc_count: 10 },
      { key: "b", doc_count: 10 },
      { key: "c", doc_count: 20 },
      { key: "d", doc_count: 30 },
      { key: "e", doc_count: 40 },
    ];
    expect(expected).toEqual(getAggsItems(id, items));
  });

  test("getAggsItems - sort by weight", () => {
    const items = [
      { key: "a", doc_count: 10, testweight: { buckets: [{ key: 2 }] } },
      { key: "b", doc_count: 10, testweight: { buckets: [{ key: 0 }] } },
      { key: "c", doc_count: 20, testweight: { buckets: [{ key: 1 }] } },
      { key: "d", doc_count: 30, testweight: { buckets: [{ key: 4 }] } },
    ];
    const id = "test";
    const expected = [
      { key: "b", doc_count: 10 },
      { key: "c", doc_count: 20 },
      { key: "a", doc_count: 10 },
      { key: "d", doc_count: 30 },
    ];
    expect(expected).toEqual(getAggsItems(id, items));
  });
});
