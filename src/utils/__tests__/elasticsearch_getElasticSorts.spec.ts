import { ISortOrder } from "../../componentsBase/StickyGrid";
import { getAggrElasticSorts } from "../elasticsearch";

describe("sorts - getElasticSorts", () => {
  test("keyword true", () => {
    const sort = [
      {
        id: "a",
        order: ISortOrder.ASC,
        keyword: false,
      },
      {
        id: "b",
        order: ISortOrder.DESC,
        keyword: false,
      },
      {
        id: "c",
        order: ISortOrder.ASC,
        keyword: false,
      },
    ];
    const expectedResult = [
      {
        a: { order: ISortOrder.ASC },
      },
      {
        b: { order: ISortOrder.DESC },
      },
      {
        c: { order: ISortOrder.ASC },
      },
    ];
    expect(expectedResult).toEqual(getAggrElasticSorts(sort));
  });

  test("keyword false", () => {
    const sort = [
      {
        id: "a",
        order: ISortOrder.ASC,
        keyword: true,
      },
      {
        id: "b",
        order: ISortOrder.DESC,
        keyword: true,
      },
      {
        id: "c",
        order: ISortOrder.ASC,
        keyword: true,
      },
    ];
    const expectedResult = [
      {
        "a.keyword": { order: ISortOrder.ASC },
      },
      {
        "b.keyword": { order: ISortOrder.DESC },
      },
      {
        "c.keyword": { order: ISortOrder.ASC },
      },
    ];
    expect(expectedResult).toEqual(getAggrElasticSorts(sort));
  });
});
