import getReadySets from "../getReadySets";
import {
  KEY_ROOT_ID,
  KEY_MEDIA,
  KEY_VIEW_DATA,
  KEY_READY,
  KEY_VIEW_STATUS,
  KEY_VIEW_CHECK,
} from "../../../../../constants";
import {
  MediaType,
  ViewType,
  ContentType,
  ViewStatus,
  Category,
  ViewCheck,
} from "../../../../../interfaces";
import IMultiReadyView from "../../IMultiReadyView";
import IMultiReadyCatalog from "../../IMultiReadyCatalog";

const catalogsId = ["y500", "y501", "y502", "y503", "y504", "y505"];
const views = ["A", "B", "C", "D"].reduce((acc, view) => {
  catalogsId.forEach((catalog) => {
    acc.push({
      id: `${catalog}_${view}`,
      view,
      catalog,
      category: "category",
      selected: true,
    });
  });
  return acc;
}, [] as IMultiReadyView[]);
const catalogs = [
  {
    id: "y500",
    displayName: "y500",
    languages: ["en", "it", "sp"],
    fallback: "en",
    disabled: false,
    selected: false,
  },
  {
    id: "y501",
    displayName: "y501",
    languages: ["en", "it", "sp"],
    fallback: "en",
    disabled: true,
    selected: true,
  },
  {
    id: "y502",
    displayName: "y502",
    languages: ["en", "it", "sp"],
    fallback: "en",
    disabled: false,
    selected: true,
  },
  {
    id: "y503",
    displayName: "y503",
    languages: ["en", "it", "sp"],
    fallback: "en",
    disabled: false,
    selected: false,
  },
  {
    id: "y504",
    displayName: "y504",
    languages: ["en", "it", "sp"],
    fallback: "en",
    disabled: false,
    selected: true,
  },
  {
    id: "y505",
    displayName: "y505",
    languages: ["en", "it", "sp"],
    fallback: "en",
    disabled: false,
    selected: true,
  },
] as IMultiReadyCatalog[];

describe("ModalMediasReady - getReadySet", () => {
  test("0 items + 0 catalogs", () => {
    const expected = {
      countItemsInChecked: 0,
      countItemsInReady: 0,
      countItemsInReview: 0,
      countItemsToApply: 0,
      countItemsTotal: 0,
      readySets: [],
    };
    expect(expected).toEqual(
      getReadySets({
        items: [],
        catalogs: [],
        views: [],
      })
    );
  });

  test("1 items + 0 catalogs", () => {
    const expected = {
      countItemsInChecked: 0,
      countItemsInReady: 0,
      countItemsInReview: 0,
      countItemsToApply: 0,
      countItemsTotal: 0,
      readySets: [],
    };
    expect(expected).toEqual(
      getReadySets({
        items: [
          {
            id: "1",
            version: 1,
            [KEY_ROOT_ID]: "KEY_ROOT_ID",
            [KEY_MEDIA]: [
              {
                fileId: "_fileId",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1,
                uploader: "_uploader",
                view: "A",
              },
            ],
            [KEY_VIEW_DATA]: [
              {
                catalog: [],
                category: Category.DEFAULT,
                mediaType: MediaType.IMAGE_P,
                viewName: "A",
                viewId: "A_id",
                viewType: ViewType.MANDATORY,
              },
            ],
          },
        ],
        catalogs: [],
        views: [],
      })
    );
  });

  test("0 items + 3 catalogs", () => {
    const expected = {
      countItemsInChecked: 0,
      countItemsInReady: 0,
      countItemsInReview: 0,
      countItemsToApply: 0,
      countItemsTotal: 0,
      readySets: [],
    };
    expect(expected).toEqual(
      getReadySets({
        items: [],
        catalogs,
        views,
      })
    );
  });

  test("1 items + 3 catalogs", () => {
    const expected = {
      countItemsInChecked: 0,
      countItemsInReady: 0,
      countItemsInReview: 0,
      countItemsToApply: 1,
      countItemsTotal: 1,
      readySets: [
        {
          entityId: "doc1",
          version: 1,
          elementsReady: [
            {
              id: "media1",
              idType: ContentType.MEDIA,
              catalogs: ["y501", "y502"],
            },
          ],
        },
      ],
    };
    expect(expected).toEqual(
      getReadySets({
        items: [
          {
            id: "doc1",
            version: 1,
            [KEY_ROOT_ID]: "KEY_ROOT_ID",
            [KEY_MEDIA]: [
              {
                fileId: "media1",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "A",
              },
            ],
            [KEY_VIEW_DATA]: [
              {
                category: Category.DEFAULT,
                catalog: ["y500", "y501", "y502", "y503"],
                mediaType: MediaType.IMAGE_P,
                viewName: "A",
                viewId: "A_id",
                viewType: ViewType.MANDATORY,
              },
            ],
          },
        ],
        catalogs,
        views,
      })
    );
  });

  test("1 item + try to get last media image POST_PRODUCED uploaded", () => {
    const expected = {
      countItemsInChecked: 0,
      countItemsInReady: 0,
      countItemsInReview: 0,
      countItemsToApply: 1,
      countItemsTotal: 1,
      readySets: [
        {
          entityId: "doc1",
          version: 1,
          elementsReady: [
            {
              id: "media3",
              idType: ContentType.MEDIA,
              catalogs: ["y501", "y502"],
            },
          ],
        },
      ],
    };
    expect(expected).toEqual(
      getReadySets({
        items: [
          {
            id: "doc1",
            version: 1,
            [KEY_ROOT_ID]: "KEY_ROOT_ID",
            [KEY_MEDIA]: [
              {
                fileId: "media1",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000003,
                uploader: "_uploader",
                view: "A",
              },
              {
                fileId: "media2",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "A",
              },
              {
                fileId: "media3",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000009,
                uploader: "_uploader",
                view: "A",
              },
              {
                fileId: "media4",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000005,
                uploader: "_uploader",
                view: "A",
              },
            ],
            [KEY_VIEW_DATA]: [
              {
                category: Category.DEFAULT,
                catalog: ["y500", "y501", "y502", "y503"],
                mediaType: MediaType.IMAGE_P,
                viewName: "A",
                viewId: "A_id",
                viewType: ViewType.MANDATORY,
              },
            ],
          },
        ],
        catalogs,
        views,
      })
    );
  });

  test("1 item + try to get last media image SHOOTING uploaded", () => {
    const expected = {
      countItemsInChecked: 0,
      countItemsInReady: 0,
      countItemsInReview: 0,
      countItemsToApply: 0,
      countItemsTotal: 0,
      readySets: [],
    };
    expect(expected).toEqual(
      getReadySets({
        items: [
          {
            id: "doc1",
            version: 1,
            [KEY_ROOT_ID]: "KEY_ROOT_ID",
            [KEY_MEDIA]: [
              {
                fileId: "media1",
                filename: "_filename",
                mediaType: MediaType.IMAGE_S,
                mimeType: "_mimeType",
                uploaded: 1500000000003,
                uploader: "_uploader",
                view: "A",
              },
              {
                fileId: "media2",
                filename: "_filename",
                mediaType: MediaType.IMAGE_S,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "A",
              },
            ],
            [KEY_VIEW_DATA]: [
              {
                category: Category.DEFAULT,
                catalog: ["y500", "y501", "y502", "y503"],
                mediaType: MediaType.IMAGE_P,
                viewName: "A",
                viewId: "A_id",
                viewType: ViewType.MANDATORY,
              },
            ],
          },
        ],
        catalogs,
        views,
      })
    );
  });

  test("1 item + try to get last media VIDEO uploaded", () => {
    const expected = {
      countItemsInChecked: 0,
      countItemsInReady: 0,
      countItemsInReview: 0,
      countItemsToApply: 1,
      countItemsTotal: 1,
      readySets: [
        {
          entityId: "doc1",
          version: 1,
          elementsReady: [
            {
              id: "media1",
              idType: ContentType.MEDIA,
              catalogs: ["y501", "y502"],
            },
          ],
        },
      ],
    };
    expect(expected).toEqual(
      getReadySets({
        items: [
          {
            id: "doc1",
            version: 1,
            [KEY_ROOT_ID]: "KEY_ROOT_ID",
            [KEY_MEDIA]: [
              {
                fileId: "media1",
                filename: "_filename",
                mediaType: MediaType.VIDEO,
                mimeType: "_mimeType",
                uploaded: 1500000000003,
                uploader: "_uploader",
                view: "A",
              },
              {
                fileId: "media2",
                filename: "_filename",
                mediaType: MediaType.VIDEO,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "A",
              },
            ],
            [KEY_VIEW_DATA]: [
              {
                category: Category.DEFAULT,
                catalog: ["y500", "y501", "y502", "y503"],
                mediaType: MediaType.IMAGE_P,
                viewName: "A",
                viewId: "A_id",
                viewType: ViewType.MANDATORY,
              },
            ],
          },
        ],
        catalogs,
        views,
      })
    );
  });

  test("1 item + 4 viewstatus with same catalogs", () => {
    const expected = {
      countItemsInChecked: 0,
      countItemsInReady: 0,
      countItemsInReview: 0,
      countItemsToApply: 3,
      countItemsTotal: 3,
      readySets: [
        {
          entityId: "doc1",
          version: 1,
          elementsReady: [
            {
              id: "media2",
              idType: ContentType.MEDIA,
              catalogs: ["y501", "y502"],
            },
            {
              id: "media3",
              idType: ContentType.MEDIA,
              catalogs: ["y501", "y502"],
            },
            {
              id: "media4",
              idType: ContentType.MEDIA,
              catalogs: ["y501", "y502"],
            },
          ],
        },
      ],
    };
    expect(expected).toEqual(
      getReadySets({
        items: [
          {
            id: "doc1",
            version: 1,
            [KEY_ROOT_ID]: "KEY_ROOT_ID",
            [KEY_MEDIA]: [
              {
                fileId: "media1",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "A",
              },
              {
                fileId: "media2",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000005,
                uploader: "_uploader",
                view: "A",
              },
              {
                fileId: "media3",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "B",
              },
              {
                fileId: "media4",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "C",
              },
              {
                fileId: "media5",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "X",
              },
            ],
            [KEY_VIEW_DATA]: [
              {
                category: Category.DEFAULT,
                catalog: ["y500", "y501", "y502", "y503"],
                mediaType: MediaType.IMAGE_P,
                viewName: "A",
                viewId: "A_id",
                viewType: ViewType.MANDATORY,
              },
              {
                category: Category.DEFAULT,
                catalog: ["y500", "y501", "y502", "y503"],
                mediaType: MediaType.IMAGE_P,
                viewName: "B",
                viewId: "B_id",
                viewType: ViewType.MANDATORY,
              },
              {
                category: Category.DEFAULT,
                catalog: ["y500", "y501", "y502", "y503"],
                mediaType: MediaType.IMAGE_P,
                viewName: "C",
                viewId: "C_id",
                viewType: ViewType.MANDATORY,
              },
              {
                category: Category.DEFAULT,
                catalog: ["y500", "y501", "y502", "y503"],
                mediaType: MediaType.IMAGE_P,
                viewName: "D",
                viewId: "D_id",
                viewType: ViewType.MANDATORY,
              },
            ],
          },
        ],
        catalogs,
        views,
      })
    );
  });

  test("1 item + 4 viewstatus with differens catalogs", () => {
    const expected = {
      countItemsInChecked: 0,
      countItemsInReady: 0,
      countItemsInReview: 0,
      countItemsToApply: 3,
      countItemsTotal: 3,
      readySets: [
        {
          entityId: "doc1",
          version: 1,
          elementsReady: [
            {
              id: "media2",
              idType: ContentType.MEDIA,
              catalogs: ["y501"],
            },
            {
              id: "media3",
              idType: ContentType.MEDIA,
              catalogs: ["y502"],
            },
            {
              id: "media4",
              idType: ContentType.MEDIA,
              catalogs: ["y504", "y505"],
            },
          ],
        },
      ],
    };
    expect(expected).toEqual(
      getReadySets({
        items: [
          {
            id: "doc1",
            version: 1,
            [KEY_ROOT_ID]: "KEY_ROOT_ID",
            [KEY_MEDIA]: [
              {
                fileId: "media1",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "A",
              },
              {
                fileId: "media2",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000005,
                uploader: "_uploader",
                view: "A",
              },
              {
                fileId: "media3",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "B",
              },
              {
                fileId: "media4",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "C",
              },
              {
                fileId: "media5",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "X",
              },
            ],
            [KEY_VIEW_DATA]: [
              {
                category: Category.DEFAULT,
                catalog: ["y500", "y501"],
                mediaType: MediaType.IMAGE_P,
                viewName: "A",
                viewId: "A_id",
                viewType: ViewType.MANDATORY,
              },
              {
                category: Category.DEFAULT,
                catalog: ["y502", "y503"],
                mediaType: MediaType.IMAGE_P,
                viewName: "B",
                viewId: "B_id",
                viewType: ViewType.MANDATORY,
              },
              {
                category: Category.DEFAULT,
                catalog: ["y503", "y504", "y505", "yNO"],
                mediaType: MediaType.IMAGE_P,
                viewName: "C",
                viewId: "C_id",
                viewType: ViewType.MANDATORY,
              },
              {
                category: Category.DEFAULT,
                catalog: ["y503", "y504", "y505", "yNO"],
                mediaType: MediaType.IMAGE_P,
                viewName: "D",
                viewId: "D_id",
                viewType: ViewType.MANDATORY,
              },
            ],
          },
        ],
        catalogs,
        views,
      })
    );
  });

  test("1 item + 1 viewstatus without catalogs", () => {
    const expected = {
      countItemsInChecked: 0,
      countItemsInReady: 0,
      countItemsInReview: 0,
      countItemsToApply: 0,
      countItemsTotal: 0,
      readySets: [],
    };
    expect(expected).toEqual(
      getReadySets({
        items: [
          {
            id: "doc1",
            version: 1,
            [KEY_ROOT_ID]: "KEY_ROOT_ID",
            [KEY_MEDIA]: [
              {
                fileId: "media1",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "A",
              },
            ],
            [KEY_VIEW_DATA]: [
              {
                catalog: [],
                category: Category.DEFAULT,
                mediaType: MediaType.IMAGE_P,
                viewName: "A",
                viewId: "A_id",
                viewType: ViewType.MANDATORY,
              },
            ],
          },
        ],
        catalogs,
        views,
      })
    );
  });

  test("2 item + viewstatus with different catalogs", () => {
    const expected = {
      countItemsInChecked: 0,
      countItemsInReady: 0,
      countItemsInReview: 0,
      countItemsToApply: 2,
      countItemsTotal: 2,
      readySets: [
        {
          entityId: "doc1",
          version: 1,
          elementsReady: [
            {
              id: "doc1_media1",
              idType: ContentType.MEDIA,
              catalogs: ["y501"],
            },
          ],
        },
        {
          entityId: "doc2",
          version: 1,
          elementsReady: [
            {
              id: "doc2_media1",
              idType: ContentType.MEDIA,
              catalogs: ["y502", "y505"],
            },
          ],
        },
      ],
    };
    expect(expected).toEqual(
      getReadySets({
        items: [
          {
            id: "doc1",
            version: 1,
            [KEY_ROOT_ID]: "KEY_ROOT_ID",
            [KEY_MEDIA]: [
              {
                fileId: "doc1_media1",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "A",
              },
            ],
            [KEY_VIEW_DATA]: [
              {
                category: Category.DEFAULT,
                catalog: ["y500", "y501"],
                mediaType: MediaType.IMAGE_P,
                viewName: "A",
                viewId: "A_id",
                viewType: ViewType.MANDATORY,
              },
            ],
          },
          {
            id: "doc2",
            version: 1,
            [KEY_ROOT_ID]: "KEY_ROOT_ID",
            [KEY_MEDIA]: [
              {
                fileId: "doc2_media1",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "A",
              },
            ],
            [KEY_VIEW_DATA]: [
              {
                category: Category.DEFAULT,
                catalog: ["y502", "y503", "y505", "yNO"],
                mediaType: MediaType.IMAGE_P,
                viewName: "A",
                viewId: "A_id",
                viewType: ViewType.MANDATORY,
              },
            ],
          },
        ],
        catalogs,
        views,
      })
    );
  });

  test("3 item + mix all cases", () => {
    const expected = {
      countItemsInChecked: 0,
      countItemsInReady: 0,
      countItemsInReview: 0,
      countItemsToApply: 3,
      countItemsTotal: 3,
      readySets: [
        {
          entityId: "doc1",
          version: 1,
          elementsReady: [
            {
              id: "doc1_media1",
              idType: ContentType.MEDIA,
              catalogs: ["y501"],
            },
          ],
        },
        {
          entityId: "doc2",
          version: 1,
          elementsReady: [
            {
              id: "doc2_media1",
              idType: ContentType.MEDIA,
              catalogs: ["y502", "y505"],
            },
          ],
        },
        {
          entityId: "doc3",
          version: 1,
          elementsReady: [
            {
              id: "doc3_media2",
              idType: ContentType.MEDIA,
              catalogs: ["y501", "y502"],
            },
          ],
        },
      ],
    };
    expect(expected).toEqual(
      getReadySets({
        items: [
          {
            id: "doc1",
            version: 1,
            [KEY_ROOT_ID]: "KEY_ROOT_ID",
            [KEY_MEDIA]: [
              {
                fileId: "doc1_media1",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "A",
              },
            ],
            [KEY_VIEW_DATA]: [
              {
                category: Category.DEFAULT,
                catalog: ["y500", "y501"],
                mediaType: MediaType.IMAGE_P,
                viewName: "A",
                viewId: "A_id",
                viewType: ViewType.MANDATORY,
              },
            ],
          },
          {
            id: "doc2",
            version: 1,
            [KEY_ROOT_ID]: "KEY_ROOT_ID",
            [KEY_MEDIA]: [
              {
                fileId: "doc2_media1",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "A",
              },
              {
                fileId: "doc2_media2",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "X",
              },
            ],
            [KEY_VIEW_DATA]: [
              {
                category: Category.DEFAULT,
                catalog: ["y502", "y503", "y505", "yNO"],
                mediaType: MediaType.IMAGE_P,
                viewName: "A",
                viewId: "A_id",
                viewType: ViewType.MANDATORY,
              },
              {
                category: Category.DEFAULT,
                catalog: ["y502", "y503", "y505", "yNO"],
                mediaType: MediaType.IMAGE_P,
                viewName: "NO",
                viewId: "NO",
                viewType: ViewType.MANDATORY,
              },
            ],
          },
          {
            id: "doc3",
            version: 1,
            [KEY_ROOT_ID]: "KEY_ROOT_ID",
            [KEY_MEDIA]: [
              {
                fileId: "doc3_media1",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "A",
              },
              {
                fileId: "doc3_media2",
                filename: "_filename",
                mediaType: MediaType.VIDEO,
                mimeType: "_mimeType",
                uploaded: 1500000000005,
                uploader: "_uploader",
                view: "A",
              },
              {
                fileId: "doc3_media3",
                filename: "_filename",
                mediaType: MediaType.IMAGE_S,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "B",
              },
            ],
            [KEY_VIEW_DATA]: [
              {
                category: Category.DEFAULT,
                catalog: ["y500", "y501", "y502"],
                mediaType: MediaType.IMAGE_P,
                viewName: "A",
                viewId: "A_id",
                viewType: ViewType.MANDATORY,
              },
              {
                category: Category.DEFAULT,
                catalog: ["y500", "y501", "y502", "y503", "y504", "y505"],
                mediaType: MediaType.IMAGE_P,
                viewName: "B",
                viewId: "B_id",
                viewType: ViewType.MANDATORY,
              },
            ],
          },
          {
            id: "doc4",
            version: 1,
            [KEY_ROOT_ID]: "KEY_ROOT_ID",
            [KEY_MEDIA]: [
              {
                fileId: "doc4_media1",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "A",
              },
            ],
            [KEY_VIEW_DATA]: [
              {
                category: Category.DEFAULT,
                catalog: [],
                mediaType: MediaType.IMAGE_P,
                viewName: "A",
                viewId: "A_id",
                viewType: ViewType.MANDATORY,
              },
            ],
          },
        ],
        catalogs,
        views,
      })
    );
  });

  test("1 items in REVIEW", () => {
    const expected = {
      countItemsInChecked: 0,
      countItemsInReady: 0,
      countItemsInReview: 1,
      countItemsToApply: 0,
      countItemsTotal: 1,
      readySets: [],
    };
    expect(expected).toEqual(
      getReadySets({
        skipItemsReview: true,
        items: [
          {
            id: "doc1",
            version: 1,
            [KEY_ROOT_ID]: "KEY_ROOT_ID",
            [KEY_MEDIA]: [
              {
                fileId: "media1",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "A",
              },
            ],
            [KEY_VIEW_DATA]: [
              {
                category: Category.DEFAULT,
                catalog: ["y500", "y501", "y502", "y503"],
                mediaType: MediaType.IMAGE_P,
                viewName: "A",
                viewId: "A_id",
                viewType: ViewType.MANDATORY,
              },
            ],
            [KEY_VIEW_STATUS]: [
              {
                viewName: "A",
                viewId: "A_id",
                status: ViewStatus.REVIEW,
              },
            ],
          },
        ],
        catalogs,
        views,
      })
    );
  });

  test("1 items in CHECKED - onlyItemsChecked:false", () => {
    const expected = {
      countItemsInChecked: 1,
      countItemsInReady: 0,
      countItemsInReview: 0,
      countItemsToApply: 2,
      countItemsTotal: 2,
      readySets: [
        {
          elementsReady: [
            {
              catalogs: ["y501", "y502"],
              id: "media1",
              idType: "Media",
            },
            {
              catalogs: ["y501", "y502"],
              id: "media2",
              idType: "Media",
            },
          ],
          entityId: "doc1",
          version: 1,
        },
      ],
    };
    expect(expected).toEqual(
      getReadySets({
        onlyItemsChecked: false,
        items: [
          {
            id: "doc1",
            version: 1,
            [KEY_ROOT_ID]: "KEY_ROOT_ID",
            [KEY_MEDIA]: [
              {
                fileId: "media1",
                filename: "_filename1",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "A",
              },
              {
                fileId: "media2",
                filename: "_filename2",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "B",
              },
            ],
            [KEY_VIEW_DATA]: [
              {
                category: Category.DEFAULT,
                catalog: ["y500", "y501", "y502", "y503"],
                mediaType: MediaType.IMAGE_P,
                viewName: "A",
                viewId: "A_id",
                viewType: ViewType.MANDATORY,
              },
              {
                category: Category.DEFAULT,
                catalog: ["y500", "y501", "y502", "y503"],
                mediaType: MediaType.IMAGE_P,
                viewName: "B",
                viewId: "B_id",
                viewType: ViewType.MANDATORY,
              },
            ],
            [KEY_VIEW_CHECK]: [
              {
                viewName: "A",
                viewId: "A_id",
                check: ViewCheck.CHECK,
              },
            ],
          },
        ],
        catalogs,
        views,
      })
    );
  });

  test("1 items in CHECKED - onlyItemsChecked:true", () => {
    const expected = {
      countItemsInChecked: 1,
      countItemsInReady: 0,
      countItemsInReview: 0,
      countItemsToApply: 1,
      countItemsTotal: 2,
      readySets: [
        {
          elementsReady: [
            {
              catalogs: ["y501", "y502"],
              id: "media1",
              idType: "Media",
            },
          ],
          entityId: "doc1",
          version: 1,
        },
      ],
    };
    expect(expected).toEqual(
      getReadySets({
        onlyItemsChecked: true,
        items: [
          {
            id: "doc1",
            version: 1,
            [KEY_ROOT_ID]: "KEY_ROOT_ID",
            [KEY_MEDIA]: [
              {
                fileId: "media1",
                filename: "_filename1",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "A",
              },
              {
                fileId: "media2",
                filename: "_filename2",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "B",
              },
            ],
            [KEY_VIEW_DATA]: [
              {
                category: Category.DEFAULT,
                catalog: ["y500", "y501", "y502", "y503"],
                mediaType: MediaType.IMAGE_P,
                viewName: "A",
                viewId: "A_id",
                viewType: ViewType.MANDATORY,
              },
              {
                category: Category.DEFAULT,
                catalog: ["y500", "y501", "y502", "y503"],
                mediaType: MediaType.IMAGE_P,
                viewName: "B",
                viewId: "B_id",
                viewType: ViewType.MANDATORY,
              },
            ],
            [KEY_VIEW_CHECK]: [
              {
                viewName: "A",
                viewId: "A_id",
                check: ViewCheck.CHECK,
              },
              {
                viewName: "B",
                viewId: "B_id",
                check: ViewCheck.NO_CHECK,
              },
            ],
          },
        ],
        catalogs,
        views,
      })
    );
  });

  test("1 items in READY", () => {
    const expected = {
      countItemsInChecked: 0,
      countItemsInReady: 1,
      countItemsInReview: 0,
      countItemsToApply: 0,
      countItemsTotal: 1,
      readySets: [],
    };
    expect(expected).toEqual(
      getReadySets({
        skipItemsReady: true,
        items: [
          {
            id: "doc1",
            version: 1,
            [KEY_ROOT_ID]: "KEY_ROOT_ID",
            [KEY_READY]: [
              {
                catalog: "y500",
                contentId: "media1",
                contentType: ContentType.MEDIA,
                instant: 123,
                user: "_user",
              },
            ],
            [KEY_MEDIA]: [
              {
                fileId: "media1",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "A",
              },
            ],
            [KEY_VIEW_DATA]: [
              {
                category: Category.DEFAULT,
                catalog: ["y500", "y501", "y502", "y503"],
                mediaType: MediaType.IMAGE_P,
                viewName: "A",
                viewId: "A_id",
                viewType: ViewType.MANDATORY,
              },
            ],
          },
        ],
        catalogs,
        views,
      })
    );
  });

  test("1 items in READY & REVIEW", () => {
    const expected = {
      countItemsInChecked: 0,
      countItemsInReady: 1,
      countItemsInReview: 1,
      countItemsToApply: 0,
      countItemsTotal: 1, //
      readySets: [],
    };
    expect(expected).toEqual(
      getReadySets({
        skipItemsReady: true,
        skipItemsReview: true,
        items: [
          {
            id: "doc1",
            version: 1,
            [KEY_ROOT_ID]: "KEY_ROOT_ID",
            [KEY_READY]: [
              {
                catalog: "y500",
                contentId: "media1",
                contentType: ContentType.MEDIA,
                instant: 123,
                user: "_user",
              },
            ],
            [KEY_MEDIA]: [
              {
                fileId: "media1",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "A",
              },
            ],
            [KEY_VIEW_DATA]: [
              {
                category: Category.DEFAULT,
                catalog: ["y500", "y501", "y502", "y503"],
                mediaType: MediaType.IMAGE_P,
                viewName: "A",
                viewId: "A_id",
                viewType: ViewType.MANDATORY,
              },
            ],
            [KEY_VIEW_STATUS]: [
              {
                viewName: "A",
                viewId: "A_id",
                status: ViewStatus.REVIEW,
              },
            ],
          },
        ],
        catalogs,
        views,
      })
    );
  });

  test("1 item + 1 view selected", () => {
    const expected = {
      countItemsInChecked: 0,
      countItemsInReady: 1,
      countItemsInReview: 0,
      countItemsToApply: 1,
      countItemsTotal: 1,
      readySets: [
        {
          entityId: "doc1",
          version: 1,
          elementsReady: [
            {
              id: "media1",
              idType: ContentType.MEDIA,
              catalogs: ["y501"],
            },
          ],
        },
      ],
    };
    expect(expected).toEqual(
      getReadySets({
        items: [
          {
            id: "doc1",
            version: 1,
            [KEY_ROOT_ID]: "KEY_ROOT_ID",
            [KEY_MEDIA]: [
              {
                fileId: "media1",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "A",
              },
              {
                fileId: "media2",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "B",
              },
            ],
            [KEY_VIEW_DATA]: [
              {
                category: Category.DEFAULT,
                catalog: ["y500", "y501"],
                mediaType: MediaType.IMAGE_P,
                viewName: "A",
                viewId: "A_id",
                viewType: ViewType.MANDATORY,
              },
              {
                category: Category.DEFAULT,
                catalog: ["y502", "y503"],
                mediaType: MediaType.IMAGE_P,
                viewName: "B",
                viewId: "B_id",
                viewType: ViewType.MANDATORY,
              },
            ],
            [KEY_READY]: [
              {
                catalog: "y500",
                contentId: "media1",
                contentType: ContentType.MEDIA,
                instant: 1,
                user: "user",
              },
            ],
          },
        ],
        catalogs,
        views: [
          {
            id: "y501_A",
            view: "A",
            catalog: "y501",
            category: "category",
            selected: true,
          },
        ],
      })
    );
  });

  test("1 item + 1 view selected for a media just ready", () => {
    const expected = {
      countItemsInChecked: 0,
      countItemsInReady: 0,
      countItemsInReview: 0,
      countItemsToApply: 0,
      countItemsTotal: 0,
      readySets: [],
    };
    expect(expected).toEqual(
      getReadySets({
        items: [
          {
            id: "doc1",
            version: 1,
            [KEY_ROOT_ID]: "KEY_ROOT_ID",
            [KEY_MEDIA]: [
              {
                fileId: "media1",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "A",
              },
              {
                fileId: "media2",
                filename: "_filename",
                mediaType: MediaType.IMAGE_P,
                mimeType: "_mimeType",
                uploaded: 1500000000000,
                uploader: "_uploader",
                view: "B",
              },
            ],
            [KEY_VIEW_DATA]: [
              {
                category: Category.DEFAULT,
                catalog: ["y500", "y501"],
                mediaType: MediaType.IMAGE_P,
                viewName: "A",
                viewId: "A_id",
                viewType: ViewType.MANDATORY,
              },
              {
                category: Category.DEFAULT,
                catalog: ["y502", "y503"],
                mediaType: MediaType.IMAGE_P,
                viewName: "B",
                viewId: "B_id",
                viewType: ViewType.MANDATORY,
              },
            ],
            [KEY_READY]: [
              {
                catalog: "y500",
                contentId: "media1",
                contentType: ContentType.MEDIA,
                instant: 1,
                user: "user",
              },
            ],
          },
        ],
        catalogs,
        views: [
          {
            id: "y501_A",
            view: "A",
            catalog: "y500",
            category: "category",
            selected: true,
          },
        ],
      })
    );
  });
});
