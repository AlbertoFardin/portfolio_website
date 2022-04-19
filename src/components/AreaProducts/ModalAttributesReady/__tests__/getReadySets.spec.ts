import getReadySets from "../getReadySets";
import { KEY_ROOT_ID, KEY_CATALOG, KEY_READY } from "../../../../constants";
import {
  AttributeType,
  ContentType,
  EditFieldType,
  IColumnSc,
  IReadySet,
} from "../../../../interfaces";
import { TypeCell } from "../../../../componentsBase/StickyGrid";

const items = [
  {
    id: "product1",
    version: 1,
    [KEY_ROOT_ID]: "",
    [KEY_CATALOG]: ["cat1", "cat2"],
    "product://color?attributeSimple.(string).().()": "test",
    "product://color?attributeMultiCat.(string).(cat1).()": "cat1",
    "product://color?attributeMultiCat.(string).(cat2).()": "cat2",
    "product://color?attributeMultiLan.(string).(cat1).(it)": "cat1_it",
    "product://color?attributeMultiLan.(string).(cat1).(en)": "cat1_en",
    "product://color?attributeMultiLan.(string).(cat1).(fr)": "cat1_fr",
    "product://color?attributeMultiLan.(string).(cat2).(it)": "cat2_it",
  },
  {
    id: "product2",
    version: 1,
    [KEY_ROOT_ID]: "",
  },
];

describe("ModalAttributesReady - getReadySets", () => {
  test("no columns", () => {
    expect(
      getReadySets({
        items,
        itemsRoot: [],
        columns: [],
      })
    ).toEqual([]);
  });

  test("column type string", () => {
    const columns: IColumnSc[] = [
      {
        id: "product://color?attributeSimple.(string)",
        type: TypeCell.String,
        groupId: "",
        label: "label",
        width: 100,
        exportable: true,
        attributeName: "attributeSimple",
        attributeType: AttributeType.SYSTEM,
        editField: { type: EditFieldType.TextField },
        scope: [],
      },
    ];
    const expected: IReadySet[] = [
      {
        entityId: "product1",
        version: 1,
        elementsReady: [
          {
            id: "attributeSimple",
            idType: ContentType.ATTRIBUTE,
            catalogs: ["cat1", "cat2"],
          },
        ],
      },
    ];
    expect(
      getReadySets({
        items,
        itemsRoot: [],
        columns,
      })
    ).toEqual(expected);
  });

  test("column type multiCatalog", () => {
    const columns: IColumnSc[] = [
      {
        id: "product://color?attributeMultiCat.(string)",
        type: TypeCell.String,
        groupId: "",
        label: "label",
        width: 100,
        exportable: true,
        attributeName: "attributeMultiCat",
        attributeType: AttributeType.SYSTEM,
        editField: { type: EditFieldType.TextField },
        multiCatalog: true,
        scope: [],
      },
    ];
    const expected: IReadySet[] = [
      {
        entityId: "product1",
        version: 1,
        elementsReady: [
          {
            id: "attributeMultiCat",
            idType: ContentType.ATTRIBUTE,
            catalogs: ["cat1", "cat2"],
          },
        ],
      },
    ];
    expect(
      getReadySets({
        items,
        itemsRoot: [],
        columns,
      })
    ).toEqual(expected);
  });

  test("column type multiLanguage", () => {
    const columns: IColumnSc[] = [
      {
        id: "product://color?attributeMultiLan.(string)",
        type: TypeCell.String,
        groupId: "",
        label: "label",
        width: 100,
        exportable: true,
        attributeName: "attributeMultiLan",
        attributeType: AttributeType.SYSTEM,
        editField: { type: EditFieldType.TextField },
        multiCatalog: true,
        multiLanguage: true,
        scope: [],
      },
    ];
    const expected: IReadySet[] = [
      {
        entityId: "product1",
        version: 1,
        elementsReady: [
          {
            id: "attributeMultiLan",
            idType: ContentType.ATTRIBUTE,
            catalogs: [
              {
                catalogName: "cat1",
                languages: ["it", "en", "fr"],
              },
              {
                catalogName: "cat2",
                languages: ["it"],
              },
            ],
          },
        ],
      },
    ];
    expect(
      getReadySets({
        items,
        itemsRoot: [],
        columns,
      })
    ).toEqual(expected);
  });

  test("skip attribute no exportable", () => {
    const columns: IColumnSc[] = [
      {
        id: "attributeMultiCat",
        type: TypeCell.String,
        groupId: "",
        label: "label",
        width: 100,
        exportable: false,
        attributeName: "attributeMultiCat",
        attributeType: AttributeType.SYSTEM,
        editField: { type: EditFieldType.TextField },
        multiCatalog: true,
        scope: [],
      },
    ];
    expect(
      getReadySets({
        items,
        itemsRoot: [],
        columns,
      })
    ).toEqual([]);
  });

  test("skip attribute no valued", () => {
    const columns: IColumnSc[] = [
      {
        id: "attributeTestNoValued",
        type: TypeCell.String,
        groupId: "",
        label: "label",
        width: 100,
        exportable: true,
        attributeName: "attributeTestNoValued",
        attributeType: AttributeType.SYSTEM,
        editField: { type: EditFieldType.TextField },
        multiCatalog: true,
        scope: [],
      },
    ];
    expect(
      getReadySets({
        items,
        itemsRoot: [],
        columns,
      })
    ).toEqual([]);
  });

  test("skip attribute already ready", () => {
    const items = [
      {
        id: "product1",
        version: 1,
        [KEY_ROOT_ID]: "",
        [KEY_CATALOG]: ["cat1", "cat2"],
        "product://color?attributeSimple.(string).().()": "test",
        "product://color?attributeMultiCat.(string).(cat1).()": "cat1",
        "product://color?attributeMultiLan.(string).(cat1).(it)": "cat1_it",
        "product://color?attributeMultiCat.(string).(cat2).()": "cat2",
        "product://color?attributeMultiLan.(string).(cat2).(it)": "cat2_it",
        [KEY_READY]: [
          {
            catalog: "cat_to_ignore",
            contentId: "attributeMultiCat",
            contentType: ContentType.ATTRIBUTE,
            instant: 123,
            user: "user",
          },
          {
            catalog: "cat_to_ignore",
            contentId: "attributeMultiLan",
            contentType: ContentType.ATTRIBUTE,
            instant: 123,
            user: "user",
            language: "lang_to_ignore",
          },
          {
            catalog: "cat2",
            contentId: "attributeMultiCat",
            contentType: ContentType.ATTRIBUTE,
            instant: 123,
            user: "user",
          },
          {
            catalog: "cat2",
            contentId: "attributeMultiLan",
            contentType: ContentType.ATTRIBUTE,
            instant: 123,
            user: "user",
            language: "it",
          },
        ],
      },
      {
        id: "product2",
        version: 1,
        [KEY_ROOT_ID]: "",
        [KEY_CATALOG]: ["cat3"],
        "product://color?attributeSimple.(string).().()": "test",
      },
      {
        id: "product3",
        version: 1,
        [KEY_ROOT_ID]: "",
        [KEY_CATALOG]: ["cat3"],
        "product://color?attributeSimple.(string).().()": "test",
        [KEY_READY]: [
          {
            catalog: "cat3",
            contentId: "attributeSimple",
            contentType: ContentType.ATTRIBUTE,
            instant: 123,
            user: "user",
          },
        ],
      },
    ];
    const columns: IColumnSc[] = [
      {
        id: "product://color?attributeSimple.(string)",
        type: TypeCell.String,
        groupId: "",
        label: "label",
        width: 100,
        exportable: true,
        attributeName: "attributeSimple",
        attributeType: AttributeType.SYSTEM,
        editField: { type: EditFieldType.TextField },
        scope: [],
      },
      {
        id: "product://color?attributeMultiCat.(string)",
        type: TypeCell.String,
        groupId: "",
        label: "label",
        width: 100,
        exportable: true,
        attributeName: "attributeMultiCat",
        attributeType: AttributeType.SYSTEM,
        editField: { type: EditFieldType.TextField },
        multiCatalog: true,
        scope: [],
      },
      {
        id: "product://color?attributeMultiLan.(string)",
        type: TypeCell.String,
        groupId: "",
        label: "label",
        width: 100,
        exportable: true,
        attributeName: "attributeMultiLan",
        attributeType: AttributeType.SYSTEM,
        editField: { type: EditFieldType.TextField },
        multiCatalog: true,
        multiLanguage: true,
        scope: [],
      },
    ];
    const expected: IReadySet[] = [
      {
        entityId: "product1",
        version: 1,
        elementsReady: [
          {
            id: "attributeSimple",
            idType: ContentType.ATTRIBUTE,
            catalogs: ["cat1", "cat2"],
          },
          {
            id: "attributeMultiCat",
            idType: ContentType.ATTRIBUTE,
            catalogs: ["cat1"],
          },
          {
            id: "attributeMultiLan",
            idType: ContentType.ATTRIBUTE,
            catalogs: [
              {
                catalogName: "cat1",
                languages: ["it"],
              },
            ],
          },
        ],
      },
      {
        entityId: "product2",
        version: 1,
        elementsReady: [
          {
            id: "attributeSimple",
            idType: ContentType.ATTRIBUTE,
            catalogs: ["cat3"],
          },
        ],
      },
    ];
    expect(
      getReadySets({
        items,
        itemsRoot: [],
        columns,
      })
    ).toEqual(expected);
  });
});
