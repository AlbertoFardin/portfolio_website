import { TypeCell } from "../../componentsBase/StickyGrid";
import * as moment from "moment";
import {
  generateFileName,
  getColumnsForExportData,
  generateQuery,
  generateHeadersRows,
} from "../exportExcel";
import { AttributeType, ATypeColumn } from "../../interfaces";
import { INDEX_NAME, MAX_PRODUCTS_SELECTABLE } from "../../constants";

describe("generateFileName", () => {
  test("check not undefined and not null", () => {
    const now = moment();
    expect(generateFileName(now)).toEqual(
      `sc_export_${now.format("DDMMYY")}_${now.valueOf()}.xlsx`
    );
  });
});

describe("getColumnsForExportData", () => {
  test("return empty if columnsSet.items empty", () => {
    const ret = getColumnsForExportData([], { id: "id", items: [] });
    expect(ret.length).toEqual(0);
  });

  test("return the columns found in the columnsSet", () => {
    const commonProps = {
      type: TypeCell.String,
      label: "",
      mandatory: false,
      entityPath: ["product"],
      exportable: false,
      attributeType: AttributeType.SYSTEM,
      entityStructureId: "",
      atype: ATypeColumn.string,
      width: 150,
      groupId: "default",
      scope: [],
    };

    const expected = [
      {
        ...commonProps,
        id: "a",
      },
      {
        ...commonProps,
        id: "c",
      },
    ];
    const columns = [
      ...expected,
      {
        ...commonProps,
        id: "b",
      },
    ];
    const columnsSet = {
      id: "",
      items: expected.map((x) => {
        return { id: x.id };
      }),
    };
    const ret = getColumnsForExportData(columns, columnsSet);
    expect(expected).toEqual(ret);
  });
});

describe("generateQuery", () => {
  test("generate correct elasticSearch query object with source and ids", () => {
    const ids = ["1", "2", "3"];
    const columns = [
      {
        id: "a",
        type: TypeCell.String,
        label: "",
        mandatory: false,
        entityPath: ["product"],
        exportable: false,
        attributeType: AttributeType.SYSTEM,
        entityStructureId: "",
        atype: ATypeColumn.string,
        width: 150,
        groupId: "default",
        scope: [],
      },
      {
        id: "b",
        type: TypeCell.String,
        label: "",
        mandatory: false,
        entityPath: ["product"],
        exportable: false,
        attributeType: AttributeType.SYSTEM,
        entityStructureId: "",
        atype: ATypeColumn.string,
        width: 150,
        groupId: "default",
        scope: [],
      },
      {
        id: "c",
        type: TypeCell.String,
        label: "",
        mandatory: false,
        entityPath: ["product"],
        exportable: false,
        attributeType: AttributeType.SYSTEM,
        entityStructureId: "",
        atype: ATypeColumn.string,
        width: 150,
        groupId: "default",
        scope: [],
      },
    ];

    const expected = {
      index: INDEX_NAME.TABULAR,
      size: MAX_PRODUCTS_SELECTABLE,
      _source: {
        includes: columns.map((x) => x.id),
      },
      query: {
        ids: {
          values: ids,
        },
      },
    };

    expect(expected).toEqual(generateQuery(ids, columns));
  });

  test("generate correct elasticSearch query object without source and ids", () => {
    const expected = {
      index: INDEX_NAME.TABULAR,
      size: MAX_PRODUCTS_SELECTABLE,
    };

    expect(expected).toEqual(generateQuery([], []));
  });

  test("generate correct elasticSearch query object with source", () => {
    const columns = [
      {
        id: "a",
        type: TypeCell.String,
        label: "",
        mandatory: false,
        entityPath: ["product"],
        exportable: false,
        attributeType: AttributeType.SYSTEM,
        entityStructureId: "",
        atype: ATypeColumn.string,
        width: 150,
        groupId: "default",
        scope: [],
      },
      {
        id: "b",
        type: TypeCell.String,
        label: "",
        mandatory: false,
        entityPath: ["product"],
        exportable: false,
        attributeType: AttributeType.SYSTEM,
        entityStructureId: "",
        atype: ATypeColumn.string,
        width: 150,
        groupId: "default",
        scope: [],
      },
      {
        id: "c",
        type: TypeCell.String,
        label: "",
        mandatory: false,
        entityPath: ["product"],
        exportable: false,
        attributeType: AttributeType.SYSTEM,
        entityStructureId: "",
        atype: ATypeColumn.string,
        width: 150,
        groupId: "default",
        scope: [],
      },
    ];

    const expected = {
      index: INDEX_NAME.TABULAR,
      size: MAX_PRODUCTS_SELECTABLE,
      _source: {
        includes: columns.map((x) => x.id),
      },
    };

    expect(expected).toEqual(generateQuery([], columns));
  });

  test("generate correct elasticSearch query object with ids", () => {
    const ids = ["1", "2", "3"];
    const expected = {
      index: INDEX_NAME.TABULAR,
      size: MAX_PRODUCTS_SELECTABLE,
      query: {
        ids: {
          values: ids,
        },
      },
    };

    expect(expected).toEqual(generateQuery(ids, []));
  });
});

describe("generateHeadersRows", () => {
  test("return the list of header and rows to print on excel", () => {
    const columns = [
      {
        id: "a",
        type: TypeCell.String,
        label: "",
        mandatory: false,
        entityPath: ["product"],
        exportable: false,
        attributeType: AttributeType.SYSTEM,
        entityStructureId: "",
        atype: ATypeColumn.string,
        multiCatalog: true,
        multiLanguage: true,
        width: 150,
        groupId: "default",
        scope: [],
      },
      {
        id: "b",
        type: TypeCell.String,
        label: "",
        mandatory: false,
        entityPath: ["product"],
        exportable: false,
        attributeType: AttributeType.SYSTEM,
        entityStructureId: "",
        atype: ATypeColumn.string,
        width: 150,
        groupId: "default",
        scope: [],
      },
      {
        id: "c",
        type: TypeCell.String,
        label: "",
        mandatory: false,
        entityPath: ["product"],
        exportable: false,
        attributeType: AttributeType.SYSTEM,
        entityStructureId: "",
        atype: ATypeColumn.string,
        width: 150,
        groupId: "default",
        scope: [],
      },
    ];

    const hits = [
      {
        _source: {
          a: { cat1: { it: "A1it" }, cat2: { it: "A1itCat2", en: "A1enCat2" } },
          b: "B1",
          c: "C1",
        },
      },
      {
        _source: {
          a: { cat1: { it: "A2it" } },
          b: "B2",
          c: "C2",
        },
      },
      {
        _source: {
          a: { cat1: { it: "A3it" } },
          b: "B3",
          c: "C3",
        },
      },
      {
        _source: {
          a: "",
          b: "",
          c: "",
        },
      },
      {
        _source: {},
      },
      {
        _source: {
          a: null,
          b: null,
          c: null,
        },
      },
    ];
    const lang = "it";
    const catalog = "cat1";

    const expected = {
      headers: columns.map((x) => x.label),
      rows: [
        [
          '{"cat1":{"it":"A1it"},"cat2":{"it":"A1itCat2","en":"A1enCat2"}}',
          "B1",
          "C1",
        ],
        ['{"cat1":{"it":"A2it"}}', "B2", "C2"],
        ['{"cat1":{"it":"A3it"}}', "B3", "C3"],
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ],
    };
    const res = generateHeadersRows(columns, hits, catalog, lang);
    expect(expected).toEqual(res);
  });
});
