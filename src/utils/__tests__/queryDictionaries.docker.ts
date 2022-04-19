import {
  postESBulkUpdateCreate,
  search,
  deleteIndexES,
  fetchIndexES,
} from "@warda/node-utils/service/es";
import { HTTP_METHOD } from "@warda/node-utils/commons";

const tenantId = "tenantid";
const indexId = "indexname";

beforeEach(async () => {
  await deleteIndexES(tenantId, indexId);
  await fetchIndexES(
    tenantId,
    indexId,
    HTTP_METHOD.PUT,
    JSON.stringify({
      mappings: {
        properties: {
          searchableValue: {
            type: "keyword",
          },
        },
      },
    })
  );
});

describe("tests queries index DICTIONARIES", () => {
  test("search wildcard", async () => {
    const docsElastic = [
      {
        id: "id1",
        searchableValue: "b/China/en b/China/ch",
      },
      {
        id: "id2",
        searchableValue: "pluto",
      },
      {
        id: "id3",
        searchableValue: "b/",
      },
    ];

    await postESBulkUpdateCreate(tenantId, indexId, {
      docsToCreate: docsElastic.map((doc) => ({
        id: doc.id,
        fieldsToCreate: doc,
      })),
    });

    const bodyObj = {
      from: 0,
      size: 10,
      query: {
        bool: {
          must: [
            {
              wildcard: {
                searchableValue: "*b\\/*",
              },
            },
          ],
        },
      },
    };

    const result = await search(bodyObj, tenantId, indexId);
    expect(result.hits.hits.map(({ _source }) => _source.id)).toEqual([
      "id1",
      "id3",
    ]);
  });
});
