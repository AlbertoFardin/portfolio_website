import { TypeCell, ISortOrder } from "../../../../componentsBase/StickyGrid";
import { AttributeType, ATypeColumn } from "../../../../interfaces";
import getSortDefault from "../../getSortDefault";

describe("getSortDefault", () => {
  test("columns without defaultSorting", () => {
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
        scope: [],
      },
    ].map((col) => ({ ...col, width: 150, groupId: "default" }));
    const expected = [];
    const res = getSortDefault(columns);
    expect(res).toEqual(expected);
  });

  test("columns with 1 defaultSorting", () => {
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
        defaultSorting: {
          priority: 1,
          sorting: ISortOrder.ASC,
        },
        scope: [],
      },
    ].map((col) => ({ ...col, width: 150, groupId: "default" }));

    const expected = [
      {
        id: "a",
        order: ISortOrder.ASC,
        label: "",
      },
    ];
    const res = getSortDefault(columns);
    expect(res).toEqual(expected);
  });

  test("columns with 2 defaultSorting", () => {
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
        defaultSorting: {
          priority: 1,
          sorting: ISortOrder.ASC,
        },
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
        defaultSorting: {
          priority: 1,
          sorting: ISortOrder.DESC,
        },
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
        scope: [],
      },
    ].map((col) => ({ ...col, width: 150, groupId: "default" }));

    const expected = [
      {
        id: "a",
        order: ISortOrder.ASC,
        label: "",
      },
      {
        id: "b",
        order: ISortOrder.DESC,
        label: "",
      },
    ];
    const res = getSortDefault(columns);
    expect(res).toEqual(expected);
  });

  test("columns with 2 defaultSorting (one priority is -1)", () => {
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
        defaultSorting: {
          priority: 1,
          sorting: ISortOrder.ASC,
        },
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
        defaultSorting: {
          priority: -1,
          sorting: ISortOrder.DESC,
        },
        scope: [],
      },
    ].map((col) => ({ ...col, width: 150, groupId: "default" }));

    const expected = [
      {
        id: "b",
        order: ISortOrder.DESC,
        label: "",
      },
      {
        id: "a",
        order: ISortOrder.ASC,
        label: "",
      },
    ];
    const res = getSortDefault(columns);
    expect(res).toEqual(expected);
  });

  test("columns with 2 defaultSorting (one priority is 0)", () => {
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
        defaultSorting: {
          priority: 1,
          sorting: ISortOrder.ASC,
        },
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
        defaultSorting: {
          priority: 0,
          sorting: ISortOrder.DESC,
        },
        scope: [],
      },
    ].map((col) => ({ ...col, width: 150, groupId: "default" }));

    const expected = [
      {
        id: "b",
        order: ISortOrder.DESC,
        label: "",
      },
      {
        id: "a",
        order: ISortOrder.ASC,
        label: "",
      },
    ];
    const res = getSortDefault(columns);
    expect(res).toEqual(expected);
  });

  test("columns with 2 defaultSorting (one priority is float 1.5)", () => {
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
        defaultSorting: {
          priority: 1.5,
          sorting: ISortOrder.ASC,
        },
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
        defaultSorting: {
          priority: 1,
          sorting: ISortOrder.DESC,
        },
        scope: [],
      },
    ].map((col) => ({ ...col, width: 150, groupId: "default" }));

    const expected = [
      {
        id: "b",
        order: ISortOrder.DESC,
        label: "",
      },
      {
        id: "a",
        order: ISortOrder.ASC,
        label: "",
      },
    ];
    const res = getSortDefault(columns);
    expect(res).toEqual(expected);
  });

  test("columns with 2 defaultSorting (one priority is null)", () => {
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
        defaultSorting: {
          priority: 1,
          sorting: ISortOrder.ASC,
        },
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
        defaultSorting: {
          priority: null,
          sorting: ISortOrder.DESC,
        },
        scope: [],
      },
    ].map((col) => ({ ...col, width: 150, groupId: "default" }));

    const expected = [
      {
        id: "a",
        order: ISortOrder.ASC,
        label: "",
      },
    ];
    const res = getSortDefault(columns);
    expect(res).toEqual(expected);
  });

  test("columns with 2 defaultSorting (one priority is undefined)", () => {
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
        defaultSorting: {
          priority: 1,
          sorting: ISortOrder.ASC,
        },
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
        defaultSorting: {
          priority: undefined,
          sorting: ISortOrder.DESC,
        },
        scope: [],
      },
    ].map((col) => ({ ...col, width: 150, groupId: "default" }));

    const expected = [
      {
        id: "a",
        order: ISortOrder.ASC,
        label: "",
      },
    ];
    const res = getSortDefault(columns);
    expect(res).toEqual(expected);
  });

  test("columns with 2 defaultSorting (one sorting is null)", () => {
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
        defaultSorting: {
          priority: 1,
          sorting: ISortOrder.ASC,
        },
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
        defaultSorting: {
          priority: 1,
          sorting: null,
        },
        scope: [],
      },
    ].map((col) => ({ ...col, width: 150, groupId: "default" }));

    const expected = [
      {
        id: "a",
        order: ISortOrder.ASC,
        label: "",
      },
    ];
    const res = getSortDefault(columns);
    expect(res).toEqual(expected);
  });

  test("columns with 2 defaultSorting (one sorting is undefined)", () => {
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
        defaultSorting: {
          priority: 1,
          sorting: ISortOrder.ASC,
        },
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
        defaultSorting: {
          priority: 1,
          sorting: undefined,
        },
        scope: [],
      },
    ].map((col) => ({ ...col, width: 150, groupId: "default" }));

    const expected = [
      {
        id: "a",
        order: ISortOrder.ASC,
        label: "",
      },
    ];
    const res = getSortDefault(columns);
    expect(res).toEqual(expected);
  });

  test("columns with 2 defaultSorting (one sorting is NONE)", () => {
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
        defaultSorting: {
          priority: 1,
          sorting: ISortOrder.ASC,
        },
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
        defaultSorting: {
          priority: 1,
          sorting: ISortOrder.NONE,
        },
        scope: [],
      },
    ].map((col) => ({ ...col, width: 150, groupId: "default" }));

    const expected = [
      {
        id: "a",
        order: ISortOrder.ASC,
        label: "",
      },
    ];
    const res = getSortDefault(columns);
    expect(res).toEqual(expected);
  });

  test("columns with 2 defaultSorting (one sorting is different from ASC upper case)", () => {
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
        defaultSorting: {
          priority: 1,
          sorting: ISortOrder.ASC,
        },
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
        defaultSorting: {
          priority: 1,
          sorting: ISortOrder.ASC,
        },
        scope: [],
      },
    ].map((col) => ({ ...col, width: 150, groupId: "default" }));

    const expected = [
      {
        id: "a",
        order: ISortOrder.ASC,
        label: "",
      },
      {
        id: "b",
        order: ISortOrder.ASC,
        label: "",
      },
    ];
    const res = getSortDefault(columns);
    expect(res).toEqual(expected);
  });
});
