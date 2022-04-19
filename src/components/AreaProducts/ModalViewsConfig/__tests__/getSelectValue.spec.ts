import { IProduct, Category, MediaType, ViewType } from "../../../../interfaces";
import getSelectValue from "../Table/getSelectValue";
import { ViewStatus } from "../reducer";
import { KEY_ROOT_ID, KEY_CATALOG, KEY_VIEW_DATA } from "../../../../constants";

const items: IProduct[] = [
  {
    id: "1",
    version: 1,
    [KEY_ROOT_ID]: "1",
    [KEY_CATALOG]: ["cat1", "cat2", "cat3"],
    [KEY_VIEW_DATA]: [
      {
        viewName: "A",
        category: Category.DEFAULT,
        viewId: "A_id",
        viewType: ViewType.OPTIONAL,
        catalog: ["cat1", "cat2"],
        mediaType: MediaType.IMAGE_S,
      },
    ],
  },
];

describe("ModalMassiveEditViews - getSelectValue", () => {
  test("viewDraft ViewStatus.NONE", () => {
    expect({
      value: "-",
      placeholder: true,
    }).toEqual(
      getSelectValue({
        items,
        key: "viewType",
        viewDraft: {
          id: "XXX",
          status: ViewStatus.NONE,
          data: {},
        },
      })
    );
  });

  test("viewDraft valued", () => {
    expect({
      value: ViewType.MANDATORY,
      placeholder: false,
    }).toEqual(
      getSelectValue({
        items,
        key: "viewType",
        viewDraft: {
          id: "XXX",
          status: ViewStatus.CREATE,
          data: {
            viewType: ViewType.MANDATORY,
            catalog: ["cat1"],
          },
        },
      })
    );
    expect({
      value: ["cat1"],
      placeholder: false,
    }).toEqual(
      getSelectValue({
        items,
        key: "catalog",
        viewDraft: {
          id: "XXX",
          status: ViewStatus.CREATE,
          data: {
            viewType: ViewType.MANDATORY,
            catalog: ["cat1"],
          },
        },
      })
    );
  });

  test("viewDraft not valued", () => {
    expect({
      value: "SELECT",
      placeholder: true,
    }).toEqual(
      getSelectValue({
        items,
        key: "viewType",
        viewDraft: {
          id: "XXX",
          status: ViewStatus.CREATE,
          data: {},
        },
      })
    );
  });

  test("read value from one item", () => {
    expect({
      value: ViewType.OPTIONAL,
      placeholder: false,
    }).toEqual(
      getSelectValue({
        items,
        key: "viewType",
        viewDraft: {
          id: "A",
          status: ViewStatus.MODIFY,
          data: {},
        },
      })
    );
  });

  test("read value from two items", () => {
    const items: IProduct[] = [
      {
        id: "1",
        version: 1,
        [KEY_ROOT_ID]: "1",
        [KEY_CATALOG]: ["cat1", "cat2", "cat3"],
        [KEY_VIEW_DATA]: [
          {
            viewName: "C",
            category: Category.STILL_LIFE,
            viewId: "C_id",
            viewType: ViewType.MANDATORY,
            catalog: ["cat6"],
            mediaType: MediaType.IMAGE_S,
          },
        ],
      },
      {
        id: "2",
        version: 2,
        [KEY_ROOT_ID]: "1",
        [KEY_CATALOG]: ["cat1", "cat2", "cat3"],
        [KEY_VIEW_DATA]: [
          {
            viewName: "C",
            category: Category.DEFAULT,
            viewId: "C_id",
            viewType: ViewType.OPTIONAL,
            catalog: ["cat1", "cat2"],
            mediaType: MediaType.IMAGE_S,
          },
        ],
      },
    ];

    expect({
      value: MediaType.IMAGE_S,
      placeholder: false,
    }).toEqual(
      getSelectValue({
        items,
        key: "mediaType",
        viewDraft: {
          id: "C",
          status: ViewStatus.MODIFY,
          data: {},
        },
      })
    );
  });
});
