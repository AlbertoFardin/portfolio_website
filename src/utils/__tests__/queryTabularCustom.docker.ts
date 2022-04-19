import { postESBulkUpdateCreate, search } from "@warda/node-utils/service/es";
import { WARDA_TENANT, deleteAndCreateIndexForTenant } from "../elasticUtils";
import { searchEsAdditionalQuery } from "../../components/AreaStaging/useSearchEs";
import { INDEX_NAME } from "../../constants";

const PREFIX_TEST_SUITE = "queryEsCustomConditions";

beforeEach(
  async () =>
    await deleteAndCreateIndexForTenant(WARDA_TENANT, PREFIX_TEST_SUITE)
);

describe("tests queries queryEsCustomConditions.spec", () => {
  test("docs with string array - search value in array", async () => {
    const docsElastic = [
      { id: "01" },
      { id: "02", mapping: ["1", "2"] },
      { id: "03", mapping: [] },
      { id: "04", mapping: [null] },
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
      query: { bool: { must: [].concat(searchEsAdditionalQuery) } },
    };

    const result = await search(
      bodyObj,
      WARDA_TENANT,
      PREFIX_TEST_SUITE + INDEX_NAME.TABULAR
    );
    expect(new Set(result.hits.hits.map((a) => a._source.id))).toEqual(
      new Set(["01", "03", "04"])
    );
  });
});
