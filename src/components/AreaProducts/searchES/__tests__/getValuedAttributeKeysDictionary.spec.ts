import { IColumnSc } from "../../../../interfaces";
import getValuedAttributeKeysDictionary from "../getValuedAttributeKeysDictionary";
import * as mock_columns from "./mock_columns.json";
import * as mock_items from "./mock_items.json";

const columns = mock_columns as IColumnSc[];

describe("getValuedAttributeKeysDictionary", () => {
  test("mock0", () => {
    const item = mock_items[0];
    expect([
      "product://color?typeA_global_single.(dictionary).().()",
      "product://color?model.(dictionary).(Farfetch).()",
      "product://color?typeA_global.(dictionary).().()",
      "product://color?typeB_entries.(dictionary).(EMEA).()",
      "product://color?typeE.(dictionary).(EMEA).(es)",
      "product://color?typeE.(dictionary).(EMEA).(fr)",
      "product://color?typeE.(dictionary).(EMEA).(it)",
      "product://color?typeE.(dictionary).(EMEA).(en)",
      "product://color?typeE.(dictionary).(EMEA).(de)",
      "product://color?typeE_set.(dictionary).(EMEA).(de)",
      "product://color?typeE_set.(dictionary).(EMEA).(en)",
      "product://color?typeE_set.(dictionary).(EMEA).(fr)",
      "product://color?typeE_set.(dictionary).(EMEA).(it)",
      "product://color?typeE_set.(dictionary).(EMEA).(es)",
    ]).toEqual(getValuedAttributeKeysDictionary(item, columns));
  });

  test("mock1", () => {
    const item = mock_items[1];
    expect([
      "product://color?typeA_global.(dictionary).().()",
      "product://color?typeA_multiCatalog.(dictionary).(EMEA).()",
      "product://color?typeB_entries.(dictionary).(EMEA).()",
      "product://color?typeC.(dictionary).(EMEA).()",
      "product://color?typeC_set.(dictionary).(EMEA).()",
      "product://color?typeD.(dictionary).(EMEA).(en)",
      "product://color?typeD.(dictionary).(EMEA).(it)",
      "product://color?typeD.(dictionary).(EMEA).(es)",
      "product://color?typeD.(dictionary).(EMEA).(fr)",
      "product://color?typeD.(dictionary).(EMEA).(de)",
      "product://color?typeD_set.(dictionary).(EMEA).(en)",
      "product://color?typeD_set.(dictionary).(EMEA).(es)",
      "product://color?typeD_set.(dictionary).(EMEA).(it)",
      "product://color?typeE.(dictionary).(EMEA).(en)",
      "product://color?typeE.(dictionary).(EMEA).(de)",
      "product://color?typeE.(dictionary).(EMEA).(es)",
      "product://color?typeE.(dictionary).(EMEA).(fr)",
      "product://color?typeE.(dictionary).(EMEA).(it)",
      "product://color?typeE_set.(dictionary).(EMEA).(de)",
      "product://color?typeE_set.(dictionary).(EMEA).(en)",
      "product://color?typeE_set.(dictionary).(EMEA).(fr)",
      "product://color?typeE_set.(dictionary).(EMEA).(it)",
      "product://color?typeE_set.(dictionary).(EMEA).(es)",
      "product://color?model.(dictionary).(EMEA).()",
      "product://color?typeA_global_single.(dictionary).().()",
    ]).toEqual(getValuedAttributeKeysDictionary(item, columns));
  });
});
