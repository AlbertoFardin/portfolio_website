import getParams from "./getParams";
import { ISearchFilesParams } from "./ISearch";
import { FiltersCondition, ISort, FileSection } from "../../../interfaces";
import { ISortOrder } from "../../../componentsBase/StickyGrid";
import { IFacetType } from "../../../componentsBase/Facets";
import { FIELD_ID } from "../constants";

const from = 2;
const size = 50;
const sort: ISort = {
  id: "sortId",
  label: "sortLabel",
  order: ISortOrder.ASC,
  keyword: false,
};
const sortKey = sort.id;
const sortOrder = sort.order;
const filtersConditions = FiltersCondition.AND;
const filtersThisFolder = false;

describe("useSearchFiles - getParams", () => {
  test("get folder MY_FILES", () => {
    const expected: ISearchFilesParams = {
      from,
      size,
      sortKey,
      sortOrder,
      queryFieldCondition: filtersConditions,
      queryParentFolder: FileSection.MY_FILES,
    };
    expect(expected).toEqual(
      getParams({
        from,
        size,
        sort,
        pathId: FileSection.MY_FILES,
        filtersConditions,
        filtersThisFolder,
        filters: [],
      })
    );
  });

  test("get folder SHARES_PRIVATE", () => {
    const expected: ISearchFilesParams = {
      from,
      size,
      sortKey,
      sortOrder,
      queryFieldCondition: filtersConditions,
      queryParentFolder: FileSection.SHARES_PRIVATE,
    };
    expect(expected).toEqual(
      getParams({
        from,
        size,
        sort,
        pathId: FileSection.SHARES_PRIVATE,
        filtersConditions,
        filtersThisFolder,
        filters: [],
      })
    );
  });

  test("get folder id", () => {
    const expected: ISearchFilesParams = {
      from,
      size,
      sortKey,
      sortOrder,
      queryFieldCondition: filtersConditions,
      queryParentFolder: "folder_id",
    };
    expect(expected).toEqual(
      getParams({
        from,
        size,
        sort,
        pathId: "folder_id",
        filtersConditions,
        filtersThisFolder,
        filters: [],
      })
    );
  });

  test("filter Name + thisFolder", () => {
    const expected: ISearchFilesParams = {
      from,
      size,
      sortKey,
      sortOrder,
      queryFieldCondition: filtersConditions,
      queryParentFolder: "folder_id",
      queryFieldName: "applebanana",
    };
    expect(expected).toEqual(
      getParams({
        from,
        size,
        sort,
        pathId: "folder_id",
        filtersConditions,
        filtersThisFolder: true,
        filters: [
          {
            id: FIELD_ID.NAME,
            type: IFacetType.TEXTAREA,
            value: ["apple", "banana"],
          },
        ],
      })
    );
  });

  test("filter Name", () => {
    const expected: ISearchFilesParams = {
      from,
      size,
      sortKey,
      sortOrder,
      queryFieldCondition: filtersConditions,
      queryFieldName: "applebanana",
    };
    expect(expected).toEqual(
      getParams({
        from,
        size,
        sort,
        pathId: "folder_id",
        filtersConditions,
        filtersThisFolder,
        filters: [
          {
            id: FIELD_ID.NAME,
            type: IFacetType.TEXTAREA,
            value: ["apple", "banana"],
          },
        ],
      })
    );
  });

  test("filter CreatedOn", () => {
    const expected: ISearchFilesParams = {
      from,
      size,
      sortKey,
      sortOrder,
      queryFieldCondition: filtersConditions,
      queryFieldCreatedOnEnd: 1700000000000,
      queryFieldCreatedOnStart: 1600000000000,
    };
    expect(expected).toEqual(
      getParams({
        from,
        size,
        sort,
        pathId: "folder_id",
        filtersConditions,
        filtersThisFolder,
        filters: [
          {
            id: FIELD_ID.CREATE,
            type: IFacetType.DATEPICKER,
            value: {
              startDate: 1600000000000,
              endDate: 1700000000000,
            },
          },
        ],
      })
    );
  });

  test("filter Tags", () => {
    const expected: ISearchFilesParams = {
      from,
      size,
      sortKey,
      sortOrder,
      queryFieldCondition: filtersConditions,
      queryFieldTags: '["tag1","tag2"]',
    };
    expect(expected).toEqual(
      getParams({
        from,
        size,
        sort,
        pathId: "folder_id",
        filtersConditions,
        filtersThisFolder,
        filters: [
          {
            id: FIELD_ID.TAGS,
            type: IFacetType.MULTISELECTION,
            value: [
              {
                id: "tag1",
                label: "tag1_label",
              },
              {
                id: "tag2",
                label: "tag2_label",
              },
            ],
          },
        ],
      })
    );
  });
});
