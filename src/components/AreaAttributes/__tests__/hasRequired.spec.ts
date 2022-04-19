import hasRequired from "../hasRequired";
import {
  AttributeType,
  ATypeColumn,
  DictionaryType,
} from "../../../interfaces";

const itemDefault = {
  editable: true,
  groupId: "_groupId",
  carryOver: false,
  label: "_label",
  mandatory: false,
  attributeStructureId: "_attributeStructureId",
  entityPath: ["entityPath"],
  exportable: true,
  entityStructureId: "entityStructureId",
  attributeType: AttributeType.MASTER,
  atype: ATypeColumn.text,
  attributeName: "_attributeName",
  id: "_id",
  level: "_level",
  isDraft: true,
  isEdited: true,
};

describe("hasRequired", () => {
  test("true", () => {
    expect(true).toEqual(hasRequired(itemDefault));
  });

  test("check attributeType", () => {
    expect(false).toEqual(
      hasRequired({
        ...itemDefault,
        attributeType: null,
      })
    );
  });

  test("check multiCatalog", () => {
    expect(true).toEqual(
      hasRequired({
        ...itemDefault,
        multiCatalog: false,
        multiLanguage: null,
      })
    );
    expect(true).toEqual(
      hasRequired({
        ...itemDefault,
        multiCatalog: true,
        multiLanguage: false,
      })
    );
    expect(true).toEqual(
      hasRequired({
        ...itemDefault,
        multiCatalog: true,
        multiLanguage: true,
      })
    );
  });

  test("check attributeType", () => {
    expect(false).toEqual(
      hasRequired({
        ...itemDefault,
        atype: ATypeColumn.dictionaryEntry,
        dictionary: null,
      })
    );
    expect(false).toEqual(
      hasRequired({
        ...itemDefault,
        atype: ATypeColumn.dictionaryEntry,
        dictionary: null,
      })
    );
    expect(true).toEqual(
      hasRequired({
        ...itemDefault,
        atype: ATypeColumn.dictionaryEntry,
        dictionary: DictionaryType.PLAIN,
      })
    );
  });
});
