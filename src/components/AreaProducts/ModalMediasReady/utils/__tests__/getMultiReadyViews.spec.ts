import getMultiReadyViews from "../getMultiReadyViews";
import {
  KEY_ROOT_ID,
  KEY_VIEW_DATA,
  KEY_VIEW_STATUS,
} from "../../../../../constants";
import {
  Category,
  MediaType,
  ViewStatus,
  ViewType,
} from "../../../../../interfaces";

describe("getMultiReadyViews", () => {
  test("0 items", () => {
    expect([]).toEqual(getMultiReadyViews([]));
  });

  test("1 items + 0 viewstatus", () => {
    expect([]).toEqual(
      getMultiReadyViews([
        {
          id: "_id1",
          version: 1,
          [KEY_ROOT_ID]: "_rootid1",
          [KEY_VIEW_DATA]: [],
        },
      ])
    );
  });

  test("1 items + 1 viewstatus", () => {
    const expected = [
      {
        id: "y500_A",
        catalog: "y500",
        view: "A",
        category: Category.STILL_LIFE,
        selected: true,
      },
      {
        id: "y501_A",
        catalog: "y501",
        view: "A",
        category: Category.STILL_LIFE,
        selected: true,
      },
    ];
    expect(expected).toEqual(
      getMultiReadyViews([
        {
          id: "_id1",
          version: 1,
          [KEY_ROOT_ID]: "_rootid1",
          [KEY_VIEW_DATA]: [
            {
              catalog: ["y500", "y501"],
              category: Category.STILL_LIFE,
              mediaType: MediaType.IMAGE_P,
              viewName: "A",
              viewId: "idA",
              viewType: ViewType.OPTIONAL,
            },
          ],
          [KEY_VIEW_STATUS]: [
            {
              viewName: "A",
              viewId: "idA",
              status: ViewStatus.DEFAULT,
            },
          ],
        },
      ])
    );
  });

  test("2 items + 3 viewstatus", () => {
    const expected = [
      {
        id: "y500_A",
        catalog: "y500",
        view: "A",
        category: Category.STILL_LIFE,
        selected: true,
      },
      {
        id: "y500_B",
        catalog: "y500",
        view: "B",
        category: Category.STILL_LIFE,
        selected: true,
      },
      {
        id: "y501_A",
        catalog: "y501",
        view: "A",
        category: Category.STILL_LIFE,
        selected: true,
      },
    ];
    expect(expected).toEqual(
      getMultiReadyViews([
        {
          id: "_id1",
          version: 1,
          [KEY_ROOT_ID]: "_rootid1",
          [KEY_VIEW_DATA]: [
            {
              catalog: ["y500"],
              category: Category.STILL_LIFE,
              mediaType: MediaType.IMAGE_P,
              viewName: "B",
              viewId: "idB",
              viewType: ViewType.OPTIONAL,
            },
            {
              catalog: ["y500", "y501"],
              category: Category.STILL_LIFE,
              mediaType: MediaType.IMAGE_P,
              viewName: "A",
              viewId: "idA",
              viewType: ViewType.OPTIONAL,
            },
          ],
        },
        {
          id: "_id2",
          version: 1,
          [KEY_ROOT_ID]: "_rootid2",
          [KEY_VIEW_DATA]: [
            {
              catalog: ["y500", "y501"],
              category: Category.STILL_LIFE,
              mediaType: MediaType.IMAGE_P,
              viewName: "A",
              viewId: "idA",
              viewType: ViewType.OPTIONAL,
            },
          ],
        },
      ])
    );
  });
});
