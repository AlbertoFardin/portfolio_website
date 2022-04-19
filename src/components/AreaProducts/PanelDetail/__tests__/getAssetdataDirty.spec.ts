/* eslint-disable @typescript-eslint/no-explicit-any */
import { KEY_ROOT_ID } from "../../../../constants";
import getAssetdataDirty from "../getAssetdataDirty";

describe("getAssetdataDirty", () => {
  test("write dirty value", () => {
    const attributeKey = "attributeKey";
    const attributeValue = "test_edited";
    const expected = {
      [attributeKey]: attributeValue,
    };

    expect(expected).toEqual(
      getAssetdataDirty({
        attributeKey,
        attributeValue,
        assetDatas: [{ id: "123", version: 5, [KEY_ROOT_ID]: "31" }],
        assetdataDirty: {},
      })
    );
  });

  test("delete dirty value", () => {
    const attributeKey = "attributeKey";
    const attributeValue = "test_orig";
    const expected = {};

    expect(expected).toEqual(
      getAssetdataDirty({
        attributeKey,
        attributeValue,
        assetDatas: [
          {
            id: "id",
            version: 3,
            [KEY_ROOT_ID]: "31",
            [attributeKey as any]: attributeValue,
          },
        ],
        assetdataDirty: {
          [attributeKey]: "pippo",
        },
      })
    );
  });

  test("update dirty value", () => {
    const attributeKey = "attributeKey";
    const attributeValue = "test_edited";
    const expected = {
      [attributeKey]: attributeValue,
    };

    expect(expected).toEqual(
      getAssetdataDirty({
        attributeKey,
        attributeValue,
        assetDatas: [
          {
            id: "12",
            version: 3,
            [KEY_ROOT_ID]: "31",
            [attributeKey as any]: "test_orig",
          },
        ],
        assetdataDirty: {
          [attributeKey]: "pippo",
        },
      })
    );
  });
});
