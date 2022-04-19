import { postESBulkUpdateCreate, search } from "@warda/node-utils/service/es";
import { WARDA_TENANT, deleteAndCreateIndexForTenant } from "../elasticUtils";
import { INDEX_NAME } from "../../constants";

const PREFIX_TEST_SUITE = "facets_query_composizion";

beforeEach(
  async () =>
    await deleteAndCreateIndexForTenant(WARDA_TENANT, PREFIX_TEST_SUITE)
);

describe("tests queries index TABULAR", () => {
  test("docs with string array - search value in array", async () => {
    // TO FIND
    // "catalogs":"y500"
    // AND
    // "views":"A"

    const docsElastic = [
      { id: "01", catalogs: ["y500", "y501"], views: ["X", "Z"] },
      { id: "02", catalogs: ["y500", "y501"], views: ["A", "B"] },
      { id: "03", catalogs: ["y501", "y502"], views: ["B", "C"] },
      { id: "04", catalogs: ["y502", "y503"], views: ["B", "C"] },
      { id: "05", catalogs: ["y510", "y502"], views: ["B", "A"] },
    ];

    await postESBulkUpdateCreate(
      WARDA_TENANT,
      PREFIX_TEST_SUITE + INDEX_NAME.TABULAR,
      {
        docsToCreate: docsElastic.map((doc) => ({
          id: doc.id,
          fieldsToCreate: doc,
        })),
      }
    );

    const bodyObj = {
      from: 0,
      size: 10,
      query: {
        bool: {
          must: [
            {
              bool: {
                should: [
                  {
                    bool: {
                      must: [
                        {
                          query_string: {
                            query: '(catalogs:"y501")',
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    bool: {
                      must: [
                        {
                          query_string: {
                            query: '(views:"A")',
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    };

    const result = await search(
      bodyObj,
      WARDA_TENANT,
      PREFIX_TEST_SUITE + INDEX_NAME.TABULAR
    );
    expect(new Set(result.hits.hits.map((a) => a._source.id))).toEqual(
      new Set(["02"])
    );
  });

  test("docs with string array - search key not_exist", async () => {
    // TO FIND
    // "catalogs": "not_exist"
    // AND
    // "views": "not_exist"
    const docsElastic = [
      { id: "01", catalogs: ["y500", "y501"], views: ["X", "Z"] },
      { id: "02", catalogs: ["y500", "y501"] },
      { id: "03", catalogs: ["y501", "y502"], views: ["B", "C"] },
      { id: "04" },
      { id: "05", views: ["B", "C"] },
    ];

    await postESBulkUpdateCreate(
      WARDA_TENANT,
      PREFIX_TEST_SUITE + INDEX_NAME.TABULAR,
      {
        docsToCreate: docsElastic.map((doc) => ({
          id: doc.id,
          fieldsToCreate: doc,
        })),
      }
    );

    const bodyObj = {
      from: 0,
      size: 10,
      query: {
        bool: {
          must: [
            {
              bool: {
                should: [
                  {
                    bool: {
                      must_not: {
                        exists: {
                          field: "catalogs",
                        },
                      },
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    bool: {
                      must_not: {
                        exists: {
                          field: "views",
                        },
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    };

    const result = await search(
      bodyObj,
      WARDA_TENANT,
      PREFIX_TEST_SUITE + INDEX_NAME.TABULAR
    );
    expect(new Set(result.hits.hits.map((a) => a._source.id))).toEqual(
      new Set(["04"])
    );
  });

  test("docs with string array - search mix beetween value in array and key not_exist", async () => {
    // TO FIND
    // "catalogs": "y502" OR "not_exist"
    // AND
    // "views": "C" OR "not_exist"
    const docsElastic = [
      { id: "01", catalogs: ["y500", "y501"] },
      { id: "02", catalogs: ["y501", "y502"] },
      { id: "03", catalogs: ["y502", "y503"] },
      { id: "04", catalogs: ["y503", "y504"] },
      { id: "05", catalogs: ["y504", "y505"] },
      { id: "06", views: ["A", "B"] },
      { id: "07", views: ["B", "C"] },
      { id: "08", views: ["C", "D"] },
      { id: "09", views: ["D", "E"] },
      { id: "10", views: ["E", "F"] },
      { id: "11", catalogs: ["y500", "y501", "y502"], views: ["A", "B", "C"] },
      { id: "12" },
    ];

    await postESBulkUpdateCreate(
      WARDA_TENANT,
      PREFIX_TEST_SUITE + INDEX_NAME.TABULAR,
      {
        docsToCreate: docsElastic.map((doc) => ({
          id: doc.id,
          fieldsToCreate: doc,
        })),
      }
    );

    const bodyObj = {
      from: 0,
      size: 10,
      query: {
        bool: {
          must: [
            {
              bool: {
                should: [
                  {
                    bool: {
                      must: [
                        {
                          query_string: {
                            query: '(catalogs:"y502")',
                          },
                        },
                      ],
                    },
                  },
                  {
                    bool: {
                      must_not: {
                        exists: {
                          field: "catalogs",
                        },
                      },
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    bool: {
                      must: [
                        {
                          query_string: {
                            query: '(views:"C")',
                          },
                        },
                      ],
                    },
                  },
                  {
                    bool: {
                      must_not: {
                        exists: {
                          field: "views",
                        },
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    };

    const result = await search(
      bodyObj,
      WARDA_TENANT,
      PREFIX_TEST_SUITE + INDEX_NAME.TABULAR
    );
    expect(new Set(result.hits.hits.map((a) => a._source.id))).toEqual(
      new Set(["02", "03", "07", "08", "11", "12"])
    );
  });

  test("docs with string array - search mix beetween multi key", async () => {
    // TO FIND
    // "a": "A" OR "y502" OR "not_exist"
    // AND
    // "b": "B" OR "not_exist"
    // AND
    // "c":"C"
    // AND
    // "D":"D"
    const docsElastic = [
      { id: "01", a: ["y500", "y501"], b: ["A"], c: ["B"], d: ["C"] },
      { id: "02", a: ["y501", "y502"], b: ["B"], c: ["C"], d: ["D"] },
      { id: "03", a: ["y502", "y503"], b: ["C"], c: ["D"], d: ["E"] },
      { id: "04", a: ["y503", "y504"], b: ["D"], c: ["E"], d: ["A"] },
      { id: "15", a: ["y504", "y505"], b: ["E"], c: ["A"], d: ["B"] },
      {
        id: "06",
        a: ["y500", "y501"],
        b: ["A", "B"],
        c: ["B", "C"],
        d: ["C", "D"],
      },
      {
        id: "07",
        a: ["y501", "y502"],
        b: ["B", "C"],
        c: ["C", "D"],
        d: ["D", "E"],
      },
      {
        id: "08",
        a: ["y502", "y503"],
        b: ["C", "D"],
        c: ["D", "E"],
        d: ["E", "F"],
      },
      {
        id: "09",
        a: ["y503", "y504"],
        b: ["D", "E"],
        c: ["E", "F"],
        d: ["A", "B"],
      },
      {
        id: "10",
        a: ["y504", "y505"],
        b: ["E", "F"],
        c: ["A", "B"],
        d: ["B", "C"],
      },
      { id: "11", a: ["A"], b: ["B"], c: ["C"], d: ["D"] },
      { id: "12", b: ["B"], c: ["C"], d: ["D"] },
      { id: "13", a: ["A"], c: ["C"], d: ["D"] },
      { id: "14", a: ["A"], b: ["B"], d: ["D"] },
      { id: "15", a: ["A"], b: ["B"], c: ["C"] },
      { id: "x" },
    ];

    await postESBulkUpdateCreate(
      WARDA_TENANT,
      PREFIX_TEST_SUITE + INDEX_NAME.TABULAR,
      {
        docsToCreate: docsElastic.map((doc) => ({
          id: doc.id,
          fieldsToCreate: doc,
        })),
      }
    );

    const bodyObj = {
      from: 0,
      size: 10,
      query: {
        bool: {
          must: [
            {
              bool: {
                should: [
                  {
                    bool: {
                      must: [
                        {
                          query_string: {
                            query: '(a:"y502") OR (a:"A")',
                          },
                        },
                      ],
                    },
                  },
                  {
                    bool: {
                      must_not: {
                        exists: {
                          field: "a",
                        },
                      },
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    bool: {
                      must: [
                        {
                          query_string: {
                            query: '(b:"B")',
                          },
                        },
                      ],
                    },
                  },
                  {
                    bool: {
                      must_not: {
                        exists: {
                          field: "b",
                        },
                      },
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    bool: {
                      must: [
                        {
                          query_string: {
                            query: '(c:"C")',
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    bool: {
                      must: [
                        {
                          query_string: {
                            query: '(d:"D")',
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    };

    const result = await search(
      bodyObj,
      WARDA_TENANT,
      PREFIX_TEST_SUITE + INDEX_NAME.TABULAR
    );
    expect(new Set(result.hits.hits.map((a) => a._source.id))).toEqual(
      new Set(["02", "07", "11", "12", "13"])
    );
  });

  test("docs with date - search range", async () => {
    const docsElastic = [
      { id: "01", uploaded: 1573142096501 },
      { id: "02", uploaded: 1575470641887 },
      { id: "03", uploaded: 1575372070276 },
      { id: "04", uploaded: 1575303254791 },
    ];

    await postESBulkUpdateCreate(
      WARDA_TENANT,
      PREFIX_TEST_SUITE + INDEX_NAME.TABULAR,
      {
        docsToCreate: docsElastic.map((doc) => ({
          id: doc.id,
          fieldsToCreate: doc,
        })),
      }
    );

    const bodyObj = {
      from: 0,
      size: 10,
      query: {
        bool: {
          must: [
            {
              bool: {
                must_not: {
                  exists: {
                    field: "mapping",
                  },
                },
              },
            },
            {
              range: {
                uploaded: {
                  gte: 1575327600000,
                  lte: 1575586740000,
                },
              },
            },
          ],
        },
      },
    };

    const result = await search(
      bodyObj,
      WARDA_TENANT,
      PREFIX_TEST_SUITE + INDEX_NAME.TABULAR
    );
    expect(new Set(result.hits.hits.map((a) => a._source.id))).toEqual(
      new Set(["02", "03"])
    );
  });
});
