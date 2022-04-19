import { IColumnSc } from "../../../../interfaces";
import { getConfs } from "../getDataDictionaries";
import * as mock_columns from "./mock_columns.json";
import * as mock_items from "./mock_items.json";

const columns = mock_columns as IColumnSc[];
const itemsData = mock_items.map((data) => ({
  id: data.id,
  data,
}));

describe("getDataDictionaries - getConfs", () => {
  test("test mock0", () => {
    const items = [itemsData[0]];
    expect([
      {
        attributeId: "product://color?typeA_global_single.(dictionary)",
        dictionaryId: "product://color?typeA_global_single",
        dictionaryType: "plain",
        value: {
          "": ["d"],
        },
      },
      {
        attributeId: "product://color?model.(dictionary)",
        dictionaryId: "product://color?model",
        dictionaryType: "entriesByCatalog",
        value: {
          Farfetch: ["model25"],
        },
      },
      {
        attributeId: "product://color?typeA_global.(dictionary)",
        dictionaryId: "product://color?typeA_global",
        dictionaryType: "plain",
        value: {
          "": ["c", "b"],
        },
      },
      {
        attributeId: "product://color?typeB_entries.(dictionary)",
        dictionaryId: "product://color?typeB_entries",
        dictionaryType: "entriesByCatalog",
        value: {
          EMEA: ["model5", "model4", "model3"],
        },
      },
      {
        attributeId: "product://color?typeE.(dictionary)",
        dictionaryId: "product://color?typeE",
        dictionaryType: "multiLanguage",
        value: {
          EMEA: ["b"],
        },
      },
      {
        attributeId: "product://color?typeE_set.(dictionary)",
        dictionaryId: "product://color?typeE_set",
        dictionaryType: "multiLanguage",
        value: {
          EMEA: ["b", "a"],
        },
      },
    ]).toEqual(getConfs(items, columns));
  });

  test("test mock1", () => {
    const items = [itemsData[1]];
    expect([
      {
        attributeId: "product://color?typeA_global.(dictionary)",
        dictionaryId: "product://color?typeA_global",
        dictionaryType: "plain",
        value: {
          "": ["a"],
        },
      },
      {
        attributeId: "product://color?typeA_multiCatalog.(dictionary)",
        dictionaryId: "product://color?typeA_multiCatalog",
        dictionaryType: "plain",
        value: {
          EMEA: ["b"],
        },
      },
      {
        attributeId: "product://color?typeB_entries.(dictionary)",
        dictionaryId: "product://color?typeB_entries",
        dictionaryType: "entriesByCatalog",
        value: {
          EMEA: ["model2", "model3"],
        },
      },
      {
        attributeId: "product://color?typeC.(dictionary)",
        dictionaryId: "product://color?typeC",
        dictionaryType: "byCatalog",
        value: {
          EMEA: ["a"],
        },
      },
      {
        attributeId: "product://color?typeC_set.(dictionary)",
        dictionaryId: "product://color?typeC_set",
        dictionaryType: "byCatalog",
        value: {
          EMEA: ["a", "b"],
        },
      },
      {
        attributeId: "product://color?typeD.(dictionary)",
        dictionaryId: "product://color?typeD",
        dictionaryType: "byCatalogMultiLanguage",
        value: {
          EMEA: ["a", "b"],
        },
      },
      {
        attributeId: "product://color?typeD_set.(dictionary)",
        dictionaryId: "product://color?typeD_set",
        dictionaryType: "byCatalogMultiLanguage",
        value: {
          EMEA: ["a", "b"],
        },
      },
      {
        attributeId: "product://color?typeE.(dictionary)",
        dictionaryId: "product://color?typeE",
        dictionaryType: "multiLanguage",
        value: {
          EMEA: ["a"],
        },
      },
      {
        attributeId: "product://color?typeE_set.(dictionary)",
        dictionaryId: "product://color?typeE_set",
        dictionaryType: "multiLanguage",
        value: {
          EMEA: ["b"],
        },
      },
      {
        attributeId: "product://color?model.(dictionary)",
        dictionaryId: "product://color?model",
        dictionaryType: "entriesByCatalog",
        value: {
          EMEA: ["model3"],
        },
      },
      {
        attributeId: "product://color?typeA_global_single.(dictionary)",
        dictionaryId: "product://color?typeA_global_single",
        dictionaryType: "plain",
        value: {
          "": ["i"],
        },
      },
    ]).toEqual(getConfs(items, columns));
  });

  test("test", () => {
    const items = itemsData;
    expect([
      {
        attributeId: "product://color?typeA_global_single.(dictionary)",
        dictionaryId: "product://color?typeA_global_single",
        dictionaryType: "plain",
        value: {
          "": ["d", "i"],
        },
      },
      {
        attributeId: "product://color?model.(dictionary)",
        dictionaryId: "product://color?model",
        dictionaryType: "entriesByCatalog",
        value: {
          Farfetch: ["model25"],
          EMEA: ["model3"],
        },
      },
      {
        attributeId: "product://color?typeA_global.(dictionary)",
        dictionaryId: "product://color?typeA_global",
        dictionaryType: "plain",
        value: {
          "": ["c", "b", "a"],
        },
      },
      {
        attributeId: "product://color?typeB_entries.(dictionary)",
        dictionaryId: "product://color?typeB_entries",
        dictionaryType: "entriesByCatalog",
        value: {
          EMEA: ["model5", "model4", "model3", "model2"],
        },
      },
      {
        attributeId: "product://color?typeE.(dictionary)",
        dictionaryId: "product://color?typeE",
        dictionaryType: "multiLanguage",
        value: {
          EMEA: ["b", "a"],
        },
      },
      {
        attributeId: "product://color?typeE_set.(dictionary)",
        dictionaryId: "product://color?typeE_set",
        dictionaryType: "multiLanguage",
        value: {
          EMEA: ["b", "a"],
        },
      },
      {
        attributeId: "product://color?typeA_multiCatalog.(dictionary)",
        dictionaryId: "product://color?typeA_multiCatalog",
        dictionaryType: "plain",
        value: {
          EMEA: ["b"],
        },
      },
      {
        attributeId: "product://color?typeC.(dictionary)",
        dictionaryId: "product://color?typeC",
        dictionaryType: "byCatalog",
        value: {
          EMEA: ["a"],
        },
      },

      {
        attributeId: "product://color?typeC_set.(dictionary)",
        dictionaryId: "product://color?typeC_set",
        dictionaryType: "byCatalog",
        value: {
          EMEA: ["a", "b"],
        },
      },
      {
        attributeId: "product://color?typeD.(dictionary)",
        dictionaryId: "product://color?typeD",
        dictionaryType: "byCatalogMultiLanguage",
        value: {
          EMEA: ["a", "b"],
        },
      },
      {
        attributeId: "product://color?typeD_set.(dictionary)",
        dictionaryId: "product://color?typeD_set",
        dictionaryType: "byCatalogMultiLanguage",
        value: {
          EMEA: ["a", "b"],
        },
      },
    ]).toEqual(getConfs(items, columns));
  });
});
