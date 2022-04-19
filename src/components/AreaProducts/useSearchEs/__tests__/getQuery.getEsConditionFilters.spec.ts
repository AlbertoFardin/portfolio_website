import { IFacetType } from "../../../../componentsBase/Facets";
import { getEsConditionFilters } from "../getQuery";
import { missingKey } from "../../../../constants";

describe("getQuery - getEsConditionFilters", () => {
  test("IFacetType.MULTISELECTION - default", () => {
    const expected = {
      bool: {
        should: [
          {
            wildcard: {
              test: {
                case_insensitive: false,
                value: "apple",
              },
            },
          },
          {
            wildcard: {
              test: {
                case_insensitive: false,
                value: "banana",
              },
            },
          },
        ],
      },
    };
    expect(expected).toEqual(
      getEsConditionFilters({
        id: "test",
        type: IFacetType.MULTISELECTION,
        value: [{ id: "apple" }, { id: "banana" }],
      })
    );
  });

  test("IFacetType.MULTISELECTION - default N/A", () => {
    const expected = {
      bool: {
        should: [
          {
            bool: { must_not: { exists: { field: "test" } } },
          },
        ],
      },
    };
    expect(expected).toEqual(
      getEsConditionFilters({
        id: "test",
        type: IFacetType.MULTISELECTION,
        value: [{ id: missingKey }],
      })
    );
  });

  test("IFacetType.MULTISELECTION - nested", () => {
    const expected = {
      bool: {
        should: [
          {
            nested: {
              path: "viewStatus",
              query: {
                term: {
                  "viewStatus.category": "apple",
                },
              },
            },
          },
          {
            nested: {
              path: "viewStatus",
              query: {
                term: {
                  "viewStatus.category": "banana",
                },
              },
            },
          },
        ],
      },
    };
    expect(expected).toEqual(
      getEsConditionFilters({
        id: "viewStatus.category",
        type: IFacetType.MULTISELECTION,
        nested: true,
        value: [{ id: "apple" }, { id: "banana" }],
      })
    );
  });

  test("IFacetType.MULTISELECTION - nested N/A", () => {
    const expected = {
      bool: {
        should: [
          {
            bool: {
              must_not: {
                nested: {
                  path: "viewStatus",
                  query: {
                    wildcard: {
                      "viewStatus.category": {
                        value: "*",
                        case_insensitive: true,
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    };
    expect(expected).toEqual(
      getEsConditionFilters({
        id: "viewStatus.category",
        type: IFacetType.MULTISELECTION,
        nested: true,
        value: [{ id: missingKey }],
      })
    );
  });

  test("IFacetType.BOOLEAN - true", () => {
    const expected = {
      bool: { must: [{ query_string: { query: `(test:true)` } }] },
    };
    expect(expected).toEqual(
      getEsConditionFilters({
        id: "test",
        type: IFacetType.BOOLEAN,
        value: true,
      })
    );
  });

  test("IFacetType.BOOLEAN - false", () => {
    const expected = {
      bool: { must: [{ query_string: { query: `(test:false)` } }] },
    };
    expect(expected).toEqual(
      getEsConditionFilters({
        id: "test",
        type: IFacetType.BOOLEAN,
        value: false,
      })
    );
  });

  test("IFacetType.TEXTAREA - string", () => {
    const expected = {
      bool: {
        should: [
          { wildcard: { test: { value: "*prova*", case_insensitive: true } } },
        ],
      },
    };
    expect(expected).toEqual(
      getEsConditionFilters({
        id: "test",
        type: IFacetType.TEXTAREA,
        value: "prova",
      })
    );
  });

  test("IFacetType.TEXTAREA - array", () => {
    const expected = {
      bool: {
        should: [
          {
            wildcard: { test: { value: "*1prova*", case_insensitive: true } },
          },
          {
            wildcard: { test: { value: "*2prova*", case_insensitive: true } },
          },
        ],
      },
    };
    expect(expected).toEqual(
      getEsConditionFilters({
        id: "test",
        type: IFacetType.TEXTAREA,
        value: ["1prova", "", "2prova"],
      })
    );
  });

  test("IFacetType.DATEPICKER", () => {
    const expected = {
      range: {
        test: {
          gte: 456,
          lte: 123,
        },
      },
    };
    expect(expected).toEqual(
      getEsConditionFilters({
        id: "test",
        type: IFacetType.DATEPICKER,
        value: {
          endDate: 123,
          startDate: 456,
        },
      })
    );
  });

  test("IFacetType.PERCENTAGE", () => {
    const expected = { range: { test: { gte: 25, lte: 75 } } };
    expect(expected).toEqual(
      getEsConditionFilters({
        id: "test",
        type: IFacetType.PERCENTAGE,
        value: [25, 75],
      })
    );
  });

  test("IFacetType.PERCENTAGE with 0", () => {
    const expected = {
      bool: {
        should: [
          { range: { test: { gte: 0, lte: 75 } } },
          { bool: { must_not: { exists: { field: "test" } } } },
        ],
      },
    };
    expect(expected).toEqual(
      getEsConditionFilters({
        id: "test",
        type: IFacetType.PERCENTAGE,
        value: [0, 75],
      })
    );
  });
});
