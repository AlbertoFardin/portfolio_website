import getQuery from "../getQuery";
import { IFilter, FiltersCondition } from "../../../../interfaces";
import { IFacetType } from "../../../../componentsBase/Facets";

const filters: IFilter[] = [
  {
    sticky: true,
    id: "f1",
    type: IFacetType.BOOLEAN,
    value: true,
  },
  {
    id: "f2",
    type: IFacetType.BOOLEAN,
    value: true,
  },
  {
    id: "f3",
    type: IFacetType.BOOLEAN,
    value: true,
  },
];

describe("getQuery", () => {
  test("getQuery - AND", () => {
    const expected = {
      bool: {
        must: [
          { bool: { must: [{ query_string: { query: "(f1:true)" } }] } },
          {
            bool: {
              must: [
                {
                  bool: { must: [{ query_string: { query: "(f2:true)" } }] },
                },
                { bool: { must: [{ query_string: { query: "(f3:true)" } }] } },
              ],
            },
          },
        ],
      },
    };
    expect(expected).toEqual(
      getQuery({
        filters,
        filtersCondition: FiltersCondition.AND,
      })
    );
  });

  test("getQuery - OR", () => {
    const expected = {
      bool: {
        must: [
          { bool: { must: [{ query_string: { query: "(f1:true)" } }] } },
          {
            bool: {
              should: [
                {
                  bool: { must: [{ query_string: { query: "(f2:true)" } }] },
                },
                { bool: { must: [{ query_string: { query: "(f3:true)" } }] } },
              ],
            },
          },
        ],
      },
    };
    expect(expected).toEqual(
      getQuery({
        filters,
        filtersCondition: FiltersCondition.OR,
      })
    );
  });
});
