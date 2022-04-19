import getAttributeKey, { getAttributeId } from "../getAttributeKey";

const catalogId = "EMEA";
const languageId = "en";

describe("getAttributeKey", () => {
  test("attributo di sistema", () => {
    expect("catalogs").toEqual(
      getAttributeKey(
        {
          id: "catalogs",
          multiCatalog: false,
          multiLanguage: false,
          attributeStructureId: undefined,
        },
        catalogId,
        languageId
      )
    );
  });

  test("attributo globale", () => {
    expect("product://color?attributeid.(string).().()").toEqual(
      getAttributeKey(
        {
          id: "product://color?attributeid.(string)",
          multiCatalog: false,
          multiLanguage: false,
          attributeStructureId: "_attributeStructureId",
        },
        catalogId,
        languageId
      )
    );
  });

  test("attributo bycatalog - multiCatalog", () => {
    expect("product://color?attributeid.(string).(EMEA).()").toEqual(
      getAttributeKey(
        {
          id: "product://color?attributeid.(string)",
          multiCatalog: true,
          multiLanguage: false,
          attributeStructureId: "_attributeStructureId",
        },
        catalogId,
        languageId
      )
    );
  });

  test("attributo bycatalog - multiLanguage", () => {
    expect("product://color?attributeid.(string).(EMEA).(en)").toEqual(
      getAttributeKey(
        {
          id: "product://color?attributeid.(string)",
          multiCatalog: true,
          multiLanguage: true,
          attributeStructureId: "_attributeStructureId",
        },
        catalogId,
        languageId
      )
    );
  });
});

describe("getAttributeId", () => {
  test("attributo di sistema", () => {
    expect({
      id: "catalogs",
      catalogId: "",
      languageId: "",
    }).toEqual(getAttributeId("catalogs"));
  });

  test("attributo globale", () => {
    expect({
      id: "product://color?attributeid.(string)",
      catalogId: "",
      languageId: "",
    }).toEqual(getAttributeId("product://color?attributeid.(string).().()"));
  });

  test("attributo bycatalog - multiCatalog", () => {
    expect({
      id: "product://color?attributeid.(string)",
      catalogId: "EMEA",
      languageId: "",
    }).toEqual(
      getAttributeId("product://color?attributeid.(string).(EMEA).()")
    );
  });

  test("attributo bycatalog - multiLanguage", () => {
    expect({
      id: "product://color?attributeid.(string)",
      catalogId: "EMEA",
      languageId: "en",
    }).toEqual(
      getAttributeId("product://color?attributeid.(string).(EMEA).(en)")
    );
  });
});
