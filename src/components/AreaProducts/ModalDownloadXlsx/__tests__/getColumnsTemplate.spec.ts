import getColumnsTemplate from "../getColumnsTemplate";
import { IColumnSc, AttributeType } from "../../../../interfaces";
import { TypeCell } from "../../../../componentsBase/StickyGrid";

const columns: IColumnSc[] = [
  {
    type: TypeCell.String,
    id: "idGlobal1.(string)",
    label: "l1",
    groupId: "_",
    width: 100,
    scope: [],
    attributeStructureId: "a1",
    attributeType: AttributeType.USER,
    multiCatalog: false,
    multiLanguage: false,
  },
  {
    type: TypeCell.String,
    id: "idGlobal2.(string)",
    label: "l2",
    groupId: "_",
    width: 100,
    scope: [],
    attributeStructureId: "a2",
    attributeType: AttributeType.USER,
    multiCatalog: false,
    multiLanguage: false,
  },
  {
    type: TypeCell.String,
    id: "idMultiCat1.(string)",
    label: "l3",
    groupId: "_",
    width: 100,
    scope: [],
    attributeStructureId: "a3",
    attributeType: AttributeType.USER,
    multiCatalog: true,
    multiLanguage: false,
  },
  {
    type: TypeCell.String,
    id: "idMultiCat2.(string)",
    label: "l4",
    groupId: "_",
    width: 100,
    scope: [],
    attributeStructureId: "a4",
    attributeType: AttributeType.USER,
    multiCatalog: true,
    multiLanguage: false,
  },
  {
    type: TypeCell.String,
    id: "idMultiLang1.(string)",
    label: "l5",
    groupId: "_",
    width: 100,
    scope: [],
    attributeStructureId: "a5",
    attributeType: AttributeType.USER,
    multiCatalog: true,
    multiLanguage: true,
  },
  {
    type: TypeCell.String,
    id: "idMultiLang2.(string)",
    label: "l6",
    groupId: "_",
    width: 100,
    scope: [],
    attributeStructureId: "a6",
    attributeType: AttributeType.USER,
    multiCatalog: true,
    multiLanguage: true,
  },
];

describe("ModalDownloadXlsx - getColumnsTemplate", () => {
  test("column global", () => {
    expect([
      {
        attributeType: AttributeType.USER,
        attributeStructureId: "a1",
        label: "l1",
      },
    ]).toEqual(getColumnsTemplate(columns, ["idGlobal1.(string)"]));
  });

  test("column global - more", () => {
    expect([
      {
        attributeType: AttributeType.USER,
        attributeStructureId: "a1",
        label: "l1",
      },
      {
        attributeType: AttributeType.USER,
        attributeStructureId: "a2",
        label: "l2",
      },
    ]).toEqual(
      getColumnsTemplate(columns, ["idGlobal1.(string)", "idGlobal2.(string)"])
    );
  });

  test("column multiCatalog - 1 catalog", () => {
    expect([
      {
        attributeType: AttributeType.USER,
        attributeStructureId: "a3",
        label: "l3",
        catalogsAndLanguages: {
          cat1: [],
        },
      },
    ]).toEqual(getColumnsTemplate(columns, ["idMultiCat1.(string).(cat1)"]));
  });

  test("column multiCatalog - 2 catalogs", () => {
    expect([
      {
        attributeType: AttributeType.USER,
        attributeStructureId: "a3",
        label: "l3",
        catalogsAndLanguages: {
          cat1: [],
          cat2: [],
        },
      },
    ]).toEqual(
      getColumnsTemplate(columns, [
        "idMultiCat1.(string).(cat1)",
        "idMultiCat1.(string).(cat2)",
      ])
    );
  });

  test("column multiCatalog - more", () => {
    expect([
      {
        attributeType: AttributeType.USER,
        attributeStructureId: "a1",
        label: "l1",
      },
      {
        attributeType: AttributeType.USER,
        attributeStructureId: "a2",
        label: "l2",
      },
      {
        attributeType: AttributeType.USER,
        attributeStructureId: "a3",
        label: "l3",
        catalogsAndLanguages: {
          cat1: [],
          cat2: [],
        },
      },
      {
        attributeType: AttributeType.USER,
        attributeStructureId: "a4",
        label: "l4",
        catalogsAndLanguages: {
          cat2: [],
        },
      },
    ]).toEqual(
      getColumnsTemplate(columns, [
        "idGlobal1.(string)",
        "idGlobal2.(string)",
        "idMultiCat1.(string).(cat1)",
        "idMultiCat1.(string).(cat2)",
        "idMultiCat2.(string).(cat2)",
      ])
    );
  });

  test("column multiLanguage - 1 catalog & 1 language", () => {
    expect([
      {
        attributeType: AttributeType.USER,
        attributeStructureId: "a5",
        label: "l5",
        catalogsAndLanguages: {
          cat1: ["lang1"],
        },
      },
    ]).toEqual(
      getColumnsTemplate(columns, ["idMultiLang1.(string).(cat1).(lang1)"])
    );
  });

  test("column multiLanguage - 2 catalog & 3 language", () => {
    expect([
      {
        attributeType: AttributeType.USER,
        attributeStructureId: "a5",
        label: "l5",
        catalogsAndLanguages: {
          cat1: ["lang1", "lang2"],
          cat2: ["lang1"],
        },
      },
    ]).toEqual(
      getColumnsTemplate(columns, [
        "idMultiLang1.(string).(cat1).(lang1)",
        "idMultiLang1.(string).(cat1).(lang2)",
        "idMultiLang1.(string).(cat2).(lang1)",
      ])
    );
  });

  test("column multiLanguage - more", () => {
    expect([
      {
        attributeType: AttributeType.USER,
        attributeStructureId: "a1",
        label: "l1",
      },
      {
        attributeType: AttributeType.USER,
        attributeStructureId: "a2",
        label: "l2",
      },
      {
        attributeType: AttributeType.USER,
        attributeStructureId: "a3",
        label: "l3",
        catalogsAndLanguages: {
          cat1: [],
          cat2: [],
        },
      },
      {
        attributeType: AttributeType.USER,
        attributeStructureId: "a4",
        label: "l4",
        catalogsAndLanguages: {
          cat2: [],
        },
      },
      {
        attributeType: AttributeType.USER,
        attributeStructureId: "a5",
        label: "l5",
        catalogsAndLanguages: {
          cat1: ["lang1"],
        },
      },
      {
        attributeType: AttributeType.USER,
        attributeStructureId: "a6",
        label: "l6",
        catalogsAndLanguages: {
          cat1: ["lang1", "lang2"],
          cat2: ["lang1"],
        },
      },
    ]).toEqual(
      getColumnsTemplate(columns, [
        "idGlobal1.(string)",
        "idGlobal2.(string)",
        "idMultiCat1.(string).(cat1)",
        "idMultiCat1.(string).(cat2)",
        "idMultiCat2.(string).(cat2)",
        "idMultiLang1.(string).(cat1).(lang1)",
        "idMultiLang2.(string).(cat1).(lang1)",
        "idMultiLang2.(string).(cat1).(lang2)",
        "idMultiLang2.(string).(cat2).(lang1)",
      ])
    );
  });
});
