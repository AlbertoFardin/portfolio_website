import {
  IProduct,
  Category,
  IViewConf,
  MediaType,
  ViewType,
} from "../../../../interfaces";
import composeJsonToSave from "../composeJsonToSave";
import { IViewDraft, ViewStatus } from "../reducer";
import { KEY_ROOT_ID, KEY_VIEW_DATA, KEY_CATALOG } from "../../../../constants";
import isViewsCompleted from "../isViewsCompleted";

const tenantViews: IViewConf[] = [
  {
    viewName: "A",
    category: Category.DEFAULT,
    priority: 1,
  },
  {
    viewName: "B",
    category: Category.STILL_LIFE,
    priority: 2,
  },
  {
    viewName: "C",
    category: Category.WORN,
    priority: 3,
  },
];
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

describe("ModalMassiveEditViews - composeJsonToSave", () => {
  test("create view", () => {
    const views: IViewDraft[] = [
      {
        id: "B",
        status: ViewStatus.CREATE,
        data: {
          viewType: ViewType.OPTIONAL,
          mediaType: MediaType.IMAGE_P,
          catalog: ["cat1"],
        },
      },
    ];
    const expected = [
      {
        entityId: "1",
        version: 1,
        remove: [],
        add: [
          {
            viewName: "B",
            category: Category.STILL_LIFE,
            viewType: ViewType.OPTIONAL,
            mediaType: MediaType.IMAGE_P,
            catalogs: ["cat1"],
          },
        ],
      },
    ];
    expect(true).toEqual(isViewsCompleted(views));
    expect(expected).toEqual(composeJsonToSave(items, views, tenantViews));
  });

  test("remove view", () => {
    const views: IViewDraft[] = [
      {
        id: "A",
        status: ViewStatus.REMOVE,
        data: {},
      },
    ];
    const expected = [
      {
        entityId: "1",
        version: 1,
        remove: ["A"],
        add: [],
      },
    ];
    expect(true).toEqual(isViewsCompleted(views));
    expect(expected).toEqual(composeJsonToSave(items, views, tenantViews));
  });

  test("modify view", () => {
    const views: IViewDraft[] = [
      {
        id: "A",
        status: ViewStatus.MODIFY,
        data: {
          viewType: ViewType.MANDATORY,
          mediaType: MediaType.IMAGE_P,
          catalog: ["cat1"],
        },
      },
    ];
    const expected = [
      {
        entityId: "1",
        version: 1,
        remove: ["A"],
        add: [
          {
            viewName: "A",
            category: Category.DEFAULT,
            viewType: ViewType.MANDATORY,
            mediaType: MediaType.IMAGE_P,
            catalogs: ["cat1"],
          },
        ],
      },
    ];
    expect(true).toEqual(isViewsCompleted(views));
    expect(expected).toEqual(composeJsonToSave(items, views, tenantViews));
  });

  test("create view + 2 items different catalogs", () => {
    const items: IProduct[] = [
      {
        id: "1",
        version: 1,
        [KEY_ROOT_ID]: "1",
        [KEY_CATALOG]: ["US"],
        [KEY_VIEW_DATA]: [],
      },
      {
        id: "2",
        version: 1,
        [KEY_ROOT_ID]: "1",
        [KEY_CATALOG]: ["US", "EMEA"],
        [KEY_VIEW_DATA]: [],
      },
    ];
    const views: IViewDraft[] = [
      {
        id: "A",
        status: ViewStatus.CREATE,
        data: {
          viewType: ViewType.MANDATORY,
          mediaType: MediaType.IMAGE_P,
          catalog: ["US", "EMEA"],
        },
      },
    ];
    const expected = [
      {
        entityId: "1",
        version: 1,
        remove: [],
        add: [
          {
            viewName: "A",
            category: Category.DEFAULT,
            viewType: ViewType.MANDATORY,
            mediaType: MediaType.IMAGE_P,
            catalogs: ["US"],
          },
        ],
      },
      {
        entityId: "2",
        version: 1,
        remove: [],
        add: [
          {
            viewName: "A",
            category: Category.DEFAULT,
            viewType: ViewType.MANDATORY,
            mediaType: MediaType.IMAGE_P,
            catalogs: ["US", "EMEA"],
          },
        ],
      },
    ];
    expect(true).toEqual(isViewsCompleted(views));
    expect(expected).toEqual(composeJsonToSave(items, views, tenantViews));
  });
});
