import getLinkSummaryItems from "../LinkSummary/getLinkSummaryItems";
import { IColumnSc, ICatalog } from "../../../../interfaces";
import { TypeCell } from "../../../../componentsBase/StickyGrid";

const columns: IColumnSc[] = [
  {
    type: TypeCell.String,
    id: "idGlobal1.(string)",
    label: "column1",
    groupId: "_",
    width: 100,
    scope: [],
    multiCatalog: false,
    multiLanguage: false,
  },
  {
    type: TypeCell.String,
    id: "idGlobal2.(string)",
    label: "column2",
    groupId: "_",
    width: 100,
    scope: [],
    multiCatalog: false,
    multiLanguage: false,
  },
  {
    type: TypeCell.String,
    id: "idMultiCat1.(string)",
    label: "column3",
    groupId: "_",
    width: 100,
    scope: [],
    multiCatalog: true,
    multiLanguage: false,
  },
  {
    type: TypeCell.String,
    id: "idMultiCat2.(string)",
    label: "column4",
    groupId: "_",
    width: 100,
    scope: [],
    multiCatalog: true,
    multiLanguage: false,
  },
  {
    type: TypeCell.String,
    id: "idMultiLang1.(string)",
    label: "column5",
    groupId: "_",
    width: 100,
    scope: [],
    multiCatalog: true,
    multiLanguage: true,
  },
  {
    type: TypeCell.String,
    id: "idMultiLang2.(string)",
    label: "column6",
    groupId: "_",
    width: 100,
    scope: [],
    multiCatalog: true,
    multiLanguage: true,
  },
];

const catalogs: ICatalog[] = [
  {
    id: "c1",
    displayName: "catalog1",
    languages: ["en", "it", "es", "de"],
  },
  {
    id: "c2",
    displayName: "catalog2",
    languages: ["ch"],
  },
  {
    id: "c3",
    displayName: "catalog3",
    languages: ["ch"],
  },
];

describe("ModalDownloadXlsx - getLinkSummaryItems", () => {
  test("column global - onClick undefined", () => {
    const onClick = undefined;
    const attributesSelected = ["idGlobal1.(string)"];
    expect([
      {
        id: "global",
        label: "Global",
        title: true,
      },
      {
        id: "idGlobal1.(string)",
        label: "column1",
        icon: " ",
      },
    ]).toEqual(
      getLinkSummaryItems(columns, catalogs, attributesSelected, onClick)
    );
  });

  test("column global - onClick defined", () => {
    const onClick = () => null;
    const attributesSelected = ["idGlobal1.(string)"];
    expect([
      {
        id: "global",
        label: "Global",
        title: true,
      },
      {
        id: "idGlobal1.(string)",
        label: "column1",
        icon: "close",
        onClick,
      },
    ]).toEqual(
      getLinkSummaryItems(columns, catalogs, attributesSelected, onClick)
    );
  });

  test("column multicatalog", () => {
    const onClick = () => null;
    const attributesSelected = [
      "idMultiCat1.(string).(c1)",
      "idMultiCat1.(string).(c2)",
      "idMultiCat2.(string).(c2)",
      "idMultiCat2.(string).(c3)",
    ];
    expect([
      {
        id: "c1",
        label: "catalog1",
        title: true,
      },
      {
        id: "idMultiCat1.(string).(c1)",
        label: "column3 -> Untranslated",
        icon: "close",
        onClick,
      },
      {
        id: "c2",
        label: "catalog2",
        title: true,
      },
      {
        id: "idMultiCat1.(string).(c2)",
        label: "column3 -> Untranslated",
        icon: "close",
        onClick,
      },
      {
        id: "idMultiCat2.(string).(c2)",
        label: "column4 -> Untranslated",
        icon: "close",
        onClick,
      },
      {
        id: "c3",
        label: "catalog3",
        title: true,
      },
      {
        id: "idMultiCat2.(string).(c3)",
        label: "column4 -> Untranslated",
        icon: "close",
        onClick,
      },
    ]).toEqual(
      getLinkSummaryItems(columns, catalogs, attributesSelected, onClick)
    );
  });

  test("column multilanguage", () => {
    const onClick = () => null;
    const attributesSelected = [
      "idMultiLang1.(string).(c1).(en)",
      "idMultiLang1.(string).(c1).(it)",
      "idMultiLang1.(string).(c1).(de)",
      "idMultiLang2.(string).(c1).(en)",
      "idMultiLang2.(string).(c2).(ch)",
    ];
    expect([
      {
        id: "c1",
        label: "catalog1",
        title: true,
      },
      {
        id: "idMultiLang1.(string).(c1).(de)",
        label: "column5 -> DE",
        icon: "close",
        onClick,
      },
      {
        id: "idMultiLang1.(string).(c1).(en)",
        label: "column5 -> EN",
        icon: "close",
        onClick,
      },
      {
        id: "idMultiLang1.(string).(c1).(it)",
        label: "column5 -> IT",
        icon: "close",
        onClick,
      },
      {
        id: "idMultiLang2.(string).(c1).(en)",
        label: "column6 -> EN",
        icon: "close",
        onClick,
      },
      {
        id: "c2",
        label: "catalog2",
        title: true,
      },
      {
        id: "idMultiLang2.(string).(c2).(ch)",
        label: "column6 -> CH",
        icon: "close",
        onClick,
      },
    ]).toEqual(
      getLinkSummaryItems(columns, catalogs, attributesSelected, onClick)
    );
  });

  test("test - sort languages and language Untranslated is the first", () => {
    const onClick = () => null;
    const attributesSelected = [
      "idMultiLang1.(string).(c1).(it)",
      "idMultiLang1.(string).(c1).(en)",
      "idMultiCat1.(string).(c1)",
      "idMultiLang1.(string).(c1).(de)",
      "idMultiLang1.(string).(c1).(es)",
      "idMultiLang2.(string).(c1).(en)",
    ];
    expect([
      {
        id: "c1",
        label: "catalog1",
        title: true,
      },
      {
        id: "idMultiCat1.(string).(c1)",
        label: "column3 -> Untranslated",
        icon: "close",
        onClick,
      },
      {
        id: "idMultiLang1.(string).(c1).(de)",
        label: "column5 -> DE",
        icon: "close",
        onClick,
      },
      {
        id: "idMultiLang1.(string).(c1).(en)",
        label: "column5 -> EN",
        icon: "close",
        onClick,
      },
      {
        id: "idMultiLang1.(string).(c1).(es)",
        label: "column5 -> ES",
        icon: "close",
        onClick,
      },
      {
        id: "idMultiLang1.(string).(c1).(it)",
        label: "column5 -> IT",
        icon: "close",
        onClick,
      },
      {
        id: "idMultiLang2.(string).(c1).(en)",
        label: "column6 -> EN",
        icon: "close",
        onClick,
      },
    ]).toEqual(
      getLinkSummaryItems(columns, catalogs, attributesSelected, onClick)
    );
  });

  test("test - sort group and group Global is the first", () => {
    const onClick = () => null;
    const attributesSelected = [
      "idMultiCat1.(string).(c1)",
      "idGlobal1.(string)",
      "idMultiLang1.(string).(c1).(en)",
    ];
    expect([
      {
        id: "global",
        label: "Global",
        title: true,
      },
      {
        id: "idGlobal1.(string)",
        label: "column1",
        icon: "close",
        onClick,
      },
      {
        id: "c1",
        label: "catalog1",
        title: true,
      },
      {
        id: "idMultiCat1.(string).(c1)",
        label: "column3 -> Untranslated",
        icon: "close",
        onClick,
      },
      {
        id: "idMultiLang1.(string).(c1).(en)",
        label: "column5 -> EN",
        icon: "close",
        onClick,
      },
    ]).toEqual(
      getLinkSummaryItems(columns, catalogs, attributesSelected, onClick)
    );
  });
});
