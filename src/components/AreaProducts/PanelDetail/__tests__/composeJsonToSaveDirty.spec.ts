import { TypeCell } from "../../../../componentsBase/StickyGrid";
import { EditFieldType, ATypeColumn, IColumnSc } from "../../../../interfaces";
import getDirtyJsonToSave, { getAttributeToValue } from "../getDirtyJsonToSave";

describe("getDirtyJsonToSave", () => {
  test("edit single product", () => {
    const expected = {
      entityId: "product://abcde/",
      version: 1,
      attributeToValue: {
        editAString: {
          atype: ATypeColumn.string,
          value: "valore editato",
          multiCatalog: false,
          multiLanguage: false,
        },
      },
    };
    const columns = [
      {
        id: "editAString_string",
        label: "Editable string",
        attributeName: "editAString",
        atype: ATypeColumn.string,
        type: TypeCell.String,
        attributeStructureId: "product://?editAString",
        editField: { type: EditFieldType.TextField },
        width: 0,
        groupId: "groupId",
        multiCatalog: false,
        multiLanguage: false,
        scope: [],
      },
    ];
    const assetdataDirty = {
      editAString_string: "valore editato",
    };

    expect(
      getDirtyJsonToSave({
        versions: [
          {
            id: "product://abcde/",
            version: 1,
          },
        ],
        columns,
        assetdataDirty,
      })
    ).toEqual(expected);
  });

  test("edit bulk products", () => {
    const expected = {
      entities: {
        "product://abcde/": 1,
        "product://fghil/": 5,
      },
      attributeToValue: {
        editAString: {
          atype: ATypeColumn.string,
          value: "valore editato",
          multiCatalog: false,
          multiLanguage: false,
        },
      },
    };
    const columns = [
      {
        id: "editAString_string",
        label: "Editable string",
        attributeName: "editAString",
        atype: ATypeColumn.string,
        type: TypeCell.String,
        attributeStructureId: "product://?editAString",
        editField: { type: EditFieldType.TextField },
        width: 0,
        groupId: "groupId",
        multiCatalog: false,
        multiLanguage: false,
        scope: [],
      },
    ];
    const assetdataDirty = {
      editAString_string: "valore editato",
    };

    expect(
      getDirtyJsonToSave({
        versions: [
          {
            id: "product://abcde/",
            version: 1,
          },
          {
            id: "product://fghil/",
            version: 5,
          },
        ],
        columns,
        assetdataDirty,
      })
    ).toEqual(expected);
  });
});

const colOther: IColumnSc = {
  id: "product://color?xxx.(string)",
  label: "XXX",
  attributeName: "otherName",
  atype: ATypeColumn.string,
  type: TypeCell.String,
  width: 0,
  groupId: "groupId",
  multiCatalog: false,
  multiLanguage: false,
  scope: [],
};
const colString: IColumnSc = {
  id: "product://color?attributeId.(string)",
  label: "Editable string",
  attributeName: "attributeName",
  atype: ATypeColumn.string,
  type: TypeCell.String,
  width: 0,
  groupId: "groupId",
  multiCatalog: false,
  multiLanguage: false,
  scope: [],
};

describe("SheetAttributesEditor - getAttributeToValue", () => {
  test("attribute global", () => {
    const columns: IColumnSc[] = [colOther, colString];
    const assetdataDirty = {
      "product://color?xxx.(string).().()": "xxx",
      "product://color?attributeId.(string).().()": "value",
    };

    expect({
      otherName: {
        atype: ATypeColumn.string,
        multiCatalog: false,
        multiLanguage: false,
        value: "xxx",
      },
      attributeName: {
        atype: ATypeColumn.string,
        multiCatalog: false,
        multiLanguage: false,
        value: "value",
      },
    }).toEqual(getAttributeToValue(columns, assetdataDirty));
  });

  test("attribute multiCatalog", () => {
    const columns: IColumnSc[] = [
      colOther,
      { ...colString, multiCatalog: true },
    ];
    const assetdataDirty = {
      "product://color?xxx.(string).().()": "xxx",
      "product://color?attributeId.(string).(cat1).()": "value_cat1",
      "product://color?attributeId.(string).(cat2).()": "value_cat2",
    };

    expect({
      otherName: {
        atype: ATypeColumn.string,
        multiCatalog: false,
        multiLanguage: false,
        value: "xxx",
      },
      attributeName: {
        atype: ATypeColumn.string,
        multiCatalog: true,
        multiLanguage: false,
        values: {
          cat1: "value_cat1",
          cat2: "value_cat2",
        },
      },
    }).toEqual(getAttributeToValue(columns, assetdataDirty));
  });

  test("attribute multiLanguage", () => {
    const columns: IColumnSc[] = [
      colOther,
      { ...colString, multiCatalog: true, multiLanguage: true },
    ];
    const assetdataDirty = {
      "product://color?xxx.(string).().()": "xxx",
      "product://color?attributeId.(string).(cat1).(en)": "value_cat1_en",
      "product://color?attributeId.(string).(cat1).(it)": "value_cat1_it",
      "product://color?attributeId.(string).(cat2).(en)": "value_cat2_en",
      "product://color?attributeId.(string).(cat2).(it)": "value_cat2_it",
      "product://color?attributeId.(string).(cat2).(ch)": "value_cat2_ch",
      "product://color?attributeId.(string).(cat2).(test_reset)": undefined,
    };

    expect({
      otherName: {
        atype: ATypeColumn.string,
        multiCatalog: false,
        multiLanguage: false,
        value: "xxx",
      },
      attributeName: {
        atype: ATypeColumn.string,
        multiCatalog: true,
        multiLanguage: true,
        values: {
          cat1: {
            en: "value_cat1_en",
            it: "value_cat1_it",
          },
          cat2: {
            en: "value_cat2_en",
            it: "value_cat2_it",
            ch: "value_cat2_ch",
            test_reset: null,
          },
        },
      },
    }).toEqual(getAttributeToValue(columns, assetdataDirty));
  });
});
