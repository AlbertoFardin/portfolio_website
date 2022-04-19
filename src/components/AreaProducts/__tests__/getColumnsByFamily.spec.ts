import { TypeCell } from "../../../componentsBase/StickyGrid";
import getColumnsByFamily from "../getColumnsByFamily";
import {
  KEY_ROOT_ID,
  KEY_ENTITY_STRUCTURE_ID,
  KEY_ATTRIBUTE_SETS,
} from "../../../constants";
import { ATypeColumn, AttributeType, EditFieldType } from "../../../interfaces";

describe("AttributeEditor - getColumns", () => {
  test("checkId", () => {
    const col1 = {
      id: "id",
      label: "colLabel",
      type: TypeCell.String,
      atype: ATypeColumn.string,
      attributeType: AttributeType.SYSTEM,
      editField: { type: EditFieldType.TextField },
      width: 150,
      groupId: "default",
      scope: [],
    };
    const col2 = {
      id: "colId2",
      label: "colLabel",
      type: TypeCell.String,
      atype: ATypeColumn.string,
      attributeType: AttributeType.SYSTEM,
      editField: { type: EditFieldType.TextField },
      width: 150,
      groupId: "default",
      scope: [],
    };
    const columns = [col1, col2];
    const data = {
      id: "id",
      version: 1,
      [KEY_ROOT_ID]: "rootId",
    };
    const dataRoot = {
      id: "rootId",
      version: 1,
      [KEY_ROOT_ID]: "rootId",
    };
    const expected = [col2];
    expect(expected).toEqual(
      getColumnsByFamily({ columns, datas: [data], datasRoot: [dataRoot] })
    );
  });

  test("checkAttType", () => {
    const colMaster = {
      id: "colMaster",
      label: "colLabel",
      type: TypeCell.String,
      atype: ATypeColumn.string,
      attributeType: AttributeType.MASTER,
      editField: { type: EditFieldType.TextField },
      width: 150,
      groupId: "default",
      scope: [],
    };
    const colUser = {
      id: "colUser",
      label: "colLabel",
      type: TypeCell.String,
      atype: ATypeColumn.string,
      attributeType: AttributeType.USER,
      editField: { type: EditFieldType.TextField },
      width: 150,
      groupId: "default",
      scope: [],
    };
    const colSystem = {
      id: "colSystem",
      label: "colLabel",
      type: TypeCell.String,
      atype: ATypeColumn.string,
      attributeType: AttributeType.SYSTEM,
      editField: { type: EditFieldType.TextField },
      width: 150,
      groupId: "default",
      scope: [],
    };
    const columns = [colMaster, colUser, colSystem];
    const data = {
      id: "id",
      version: 1,
      [KEY_ROOT_ID]: "rootId",
    };
    const dataRoot = {
      id: "rootId",
      version: 1,
      [KEY_ROOT_ID]: "rootId",
    };
    const expected = [colMaster, colUser, colSystem];
    expect(
      getColumnsByFamily({ columns, datas: [data], datasRoot: [dataRoot] })
    ).toEqual(expected);
  });

  test("checkEnStrId", () => {
    const col1 = {
      id: "colId1",
      label: "colLabel",
      type: TypeCell.String,
      atype: ATypeColumn.string,
      attributeType: AttributeType.SYSTEM,
      editField: { type: EditFieldType.TextField },
      entityStructureId: "test",
      width: 150,
      groupId: "default",
      scope: [],
    };
    const col2 = {
      id: "colId2",
      label: "colLabel",
      type: TypeCell.String,
      atype: ATypeColumn.string,
      attributeType: AttributeType.SYSTEM,
      editField: { type: EditFieldType.TextField },
      entityStructureId: "prova",
      width: 150,
      groupId: "default",
      scope: [],
    };
    const columns = [col1, col2];
    const data = {
      id: "id",
      version: 1,
      [KEY_ROOT_ID]: "rootId",
      [KEY_ENTITY_STRUCTURE_ID]: "test",
    };
    const dataRoot = {
      id: "rootId",
      version: 1,
      [KEY_ROOT_ID]: "rootId",
    };
    const expected = [col1];
    expect(expected).toEqual(
      getColumnsByFamily({ columns, datas: [data], datasRoot: [dataRoot] })
    );
  });

  test("checkColTypeManaged", () => {
    const colEditYes = {
      id: "colString",
      label: "colLabel",
      type: TypeCell.String,
      atype: ATypeColumn.string,
      attributeType: AttributeType.SYSTEM,
      editField: { type: EditFieldType.TextField },
      width: 150,
      groupId: "default",
      scope: [],
    };

    const columns = [colEditYes];
    const data = {
      id: "id",
      version: 1,
      [KEY_ROOT_ID]: "rootId",
    };
    const dataRoot = {
      id: "rootId",
      version: 1,
      [KEY_ROOT_ID]: "rootId",
    };
    const expected = [colEditYes];
    expect(expected).toEqual(
      getColumnsByFamily({ columns, datas: [data], datasRoot: [dataRoot] })
    );
  });

  test("checkAttSets - dataRoot attributeSets empty", () => {
    const col1 = {
      id: "col1",
      label: "colLabel",
      type: TypeCell.String,
      atype: ATypeColumn.string,
      attributeType: AttributeType.SYSTEM,
      editField: { type: EditFieldType.TextField },
      attributeSets: ["acc"],
      width: 150,
      groupId: "default",
      scope: [],
    };
    const col2 = {
      id: "col2",
      label: "colLabel",
      type: TypeCell.String,
      atype: ATypeColumn.string,
      attributeType: AttributeType.SYSTEM,
      editField: { type: EditFieldType.TextField },
      attributeSets: ["test"],
      width: 150,
      groupId: "default",
      scope: [],
    };
    const col3 = {
      id: "col3",
      label: "colLabel",
      type: TypeCell.String,
      atype: ATypeColumn.string,
      attributeType: AttributeType.SYSTEM,
      editField: { type: EditFieldType.TextField },
      attributeSets: [],
      width: 150,
      groupId: "default",
      scope: [],
    };
    const columns = [col1, col2, col3];
    const data = {
      id: "id",
      version: 1,
      [KEY_ROOT_ID]: "rootId",
    };
    const dataRoot = {
      id: "rootId",
      version: 1,
      [KEY_ROOT_ID]: "rootId",
      [KEY_ATTRIBUTE_SETS]: [],
    };
    const expected = [col3];
    expect(expected).toEqual(
      getColumnsByFamily({ columns, datas: [data], datasRoot: [dataRoot] })
    );
  });

  test("checkAttSets - dataRoot attributeSets value", () => {
    const col1 = {
      id: "col1",
      label: "colLabel",
      type: TypeCell.String,
      atype: ATypeColumn.string,
      attributeType: AttributeType.SYSTEM,
      editField: { type: EditFieldType.TextField },
      attributeSets: ["acc"],
      width: 150,
      groupId: "default",
      scope: [],
    };
    const col2 = {
      id: "col2",
      label: "colLabel",
      type: TypeCell.String,
      atype: ATypeColumn.string,
      attributeType: AttributeType.SYSTEM,
      editField: { type: EditFieldType.TextField },
      attributeSets: ["test"],
      width: 150,
      groupId: "default",
      scope: [],
    };
    const col3 = {
      id: "col3",
      label: "colLabel",
      type: TypeCell.String,
      atype: ATypeColumn.string,
      attributeType: AttributeType.SYSTEM,
      editField: { type: EditFieldType.TextField },
      attributeSets: [],
      width: 150,
      groupId: "default",
      scope: [],
    };
    const columns = [col1, col2, col3];
    const data = {
      id: "id",
      version: 1,
      [KEY_ROOT_ID]: "rootId",
    };
    const dataRoot = {
      id: "rootId",
      version: 1,
      [KEY_ROOT_ID]: "rootId",
      [KEY_ATTRIBUTE_SETS]: ["test"],
    };
    const expected = [col2, col3];
    expect(expected).toEqual(
      getColumnsByFamily({ columns, datas: [data], datasRoot: [dataRoot] })
    );
  });
});
