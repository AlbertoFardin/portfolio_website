import getMultiReadyCatalogs from "../getMultiReadyCatalogs";
import {
  KEY_ROOT_ID,
  KEY_READY,
  KEY_VIEW_DATA,
  KEY_MEDIA,
  KEY_VIEW_STATUS,
} from "../../../../../constants";
import {
  Category,
  ContentType,
  MediaType,
  ViewStatus,
  ViewType,
} from "../../../../../interfaces";

const catalogDefault = {
  languages: ["en", "it", "sp"],
  fallback: "en",
  disabled: false,
  selected: false,
  viewsReady: [],
};
const catalogs = ["y500", "y501", "y502", "y503"].map((id: string) => ({
  id,
  displayName: id,
  languages: ["en", "it", "sp"],
  fallback: "en",
}));

describe("getMultiReadyCatalogs", () => {
  test("0 items + 0 ready", () => {
    expect([]).toEqual(getMultiReadyCatalogs([], catalogs));
  });

  test("1 items & 1 catalogs + 0 ready", () => {
    const items = [
      {
        id: "1",
        version: 1,
        [KEY_ROOT_ID]: "KEY_ROOT_ID",
        [KEY_VIEW_DATA]: [
          {
            catalog: ["y500"],
            category: Category.DEFAULT,
            mediaType: MediaType.IMAGE_P,
            viewName: "A",
            viewId: "idA",
            viewType: ViewType.OPTIONAL,
          },
        ],
        [KEY_VIEW_STATUS]: [
          {
            status: ViewStatus.DEFAULT,
            viewName: "A",
            viewId: "idA",
          },
        ],
      },
    ];
    const expected = [
      {
        id: "y500",
        displayName: "y500",
        ...catalogDefault,
      },
    ];
    expect(expected).toEqual(getMultiReadyCatalogs(items, catalogs));
  });

  test("2 items & 3 catalogs + 0 ready", () => {
    const items = [
      {
        id: "1",
        version: 1,
        [KEY_ROOT_ID]: "KEY_ROOT_ID",
        [KEY_VIEW_DATA]: [
          {
            catalog: ["y501"],
            category: Category.DEFAULT,
            mediaType: MediaType.IMAGE_P,
            status: ViewStatus.DEFAULT,
            viewName: "A",
            viewId: "idA",
            viewType: ViewType.OPTIONAL,
          },
        ],
        [KEY_VIEW_STATUS]: [
          {
            status: ViewStatus.DEFAULT,
            viewName: "A",
            viewId: "idA",
          },
        ],
      },
      {
        id: "2",
        version: 1,
        [KEY_ROOT_ID]: "KEY_ROOT_ID",
        [KEY_VIEW_DATA]: [
          {
            catalog: ["y500", "y503", "y505"],
            category: Category.DEFAULT,
            mediaType: MediaType.IMAGE_P,
            viewName: "A",
            viewId: "idA",
            viewType: ViewType.OPTIONAL,
          },
        ],
        [KEY_VIEW_STATUS]: [
          {
            status: ViewStatus.DEFAULT,
            viewName: "A",
            viewId: "idA",
          },
        ],
      },
    ];
    const expected = [
      {
        id: "y500",
        displayName: "y500",
        ...catalogDefault,
      },
      {
        id: "y501",
        displayName: "y501",
        ...catalogDefault,
      },
      {
        id: "y503",
        displayName: "y503",
        ...catalogDefault,
      },
    ];
    expect(expected).toEqual(getMultiReadyCatalogs(items, catalogs));
  });

  test("1 items & 1 catalogs + 1 ready", () => {
    const items = [
      {
        id: "1",
        version: 1,
        [KEY_ROOT_ID]: "KEY_ROOT_ID",
        [KEY_VIEW_DATA]: [
          {
            catalog: ["y500"],
            category: Category.DEFAULT,
            mediaType: MediaType.IMAGE_P,
            viewName: "A",
            viewId: "idA",
            viewType: ViewType.OPTIONAL,
          },
        ],
        [KEY_VIEW_STATUS]: [
          {
            status: ViewStatus.DEFAULT,
            viewName: "A",
            viewId: "idA",
          },
        ],
        [KEY_MEDIA]: [
          {
            fileId: "media1",
            filename: "filename",
            mediaType: MediaType.IMAGE_P,
            mimeType: "mimeType",
            uploaded: 1,
            uploader: "uploader",
            view: "A",
          },
        ],
        [KEY_READY]: [
          {
            catalog: "y500",
            contentId: "media1",
            contentType: ContentType.MEDIA,
            instant: 1,
            user: "_user",
          },
        ],
      },
    ];
    const expected = [
      {
        id: "y500",
        displayName: "y500",
        ...catalogDefault,
        selected: true,
        disabled: true,
        viewsReady: ["A"],
      },
    ];
    expect(expected).toEqual(getMultiReadyCatalogs(items, catalogs));
  });

  test("2 items & 3 catalogs + 1 ready", () => {
    const items = [
      {
        id: "1",
        version: 1,
        [KEY_ROOT_ID]: "KEY_ROOT_ID",
        [KEY_VIEW_DATA]: [
          {
            catalog: ["y503"],
            category: Category.DEFAULT,
            mediaType: MediaType.IMAGE_P,
            viewName: "A",
            viewId: "idA",
            viewType: ViewType.OPTIONAL,
          },
        ],
        [KEY_VIEW_STATUS]: [
          {
            status: ViewStatus.DEFAULT,
            viewName: "A",
            viewId: "idA",
          },
        ],
        [KEY_READY]: [],
      },
      {
        id: "1",
        version: 1,
        [KEY_ROOT_ID]: "KEY_ROOT_ID",
        [KEY_VIEW_DATA]: [
          {
            catalog: ["y500"],
            category: Category.DEFAULT,
            mediaType: MediaType.IMAGE_P,
            viewName: "A",
            viewId: "idA",
            viewType: ViewType.OPTIONAL,
          },
          {
            catalog: ["y502", "y505"],
            category: Category.DEFAULT,
            mediaType: MediaType.IMAGE_P,
            viewName: "B",
            viewId: "idB",
            viewType: ViewType.OPTIONAL,
          },
        ],
        [KEY_VIEW_STATUS]: [
          {
            status: ViewStatus.DEFAULT,
            viewName: "A",
            viewId: "idA",
          },
          {
            status: ViewStatus.DEFAULT,
            viewName: "B",
            viewId: "idB",
          },
        ],
        [KEY_MEDIA]: [
          {
            fileId: "media1",
            filename: "filename",
            mediaType: MediaType.IMAGE_P,
            mimeType: "mimeType",
            uploaded: 1,
            uploader: "uploader",
            view: "A",
          },
        ],
        [KEY_READY]: [
          {
            catalog: "y500",
            contentId: "media1",
            contentType: ContentType.MEDIA,
            instant: 1,
            user: "_user",
          },
        ],
      },
    ];
    const expected = [
      {
        id: "y500",
        displayName: "y500",
        ...catalogDefault,
        selected: true,
        disabled: true,
        viewsReady: ["A"],
      },
      {
        id: "y502",
        displayName: "y502",
        ...catalogDefault,
      },
      {
        id: "y503",
        displayName: "y503",
        ...catalogDefault,
      },
    ];
    expect(expected).toEqual(getMultiReadyCatalogs(items, catalogs));
  });

  test("2 items & 3 catalogs + 2 ready", () => {
    const items = [
      {
        id: "1",
        version: 1,
        [KEY_ROOT_ID]: "KEY_ROOT_ID",
        [KEY_VIEW_DATA]: [
          {
            catalog: ["y503"],
            category: Category.DEFAULT,
            mediaType: MediaType.IMAGE_P,
            viewName: "A",
            viewId: "idA",
            viewType: ViewType.OPTIONAL,
          },
        ],
        [KEY_VIEW_STATUS]: [
          {
            status: ViewStatus.DEFAULT,
            viewName: "A",
            viewId: "idA",
          },
        ],
        [KEY_READY]: [],
      },
      {
        id: "1",
        version: 1,
        [KEY_ROOT_ID]: "KEY_ROOT_ID",
        [KEY_VIEW_DATA]: [
          {
            catalog: ["y500"],
            category: Category.DEFAULT,
            mediaType: MediaType.IMAGE_P,
            viewName: "A",
            viewId: "idA",
            viewType: ViewType.OPTIONAL,
          },
          {
            catalog: ["y500", "y502", "y503", "y505"],
            category: Category.DEFAULT,
            mediaType: MediaType.IMAGE_P,
            viewName: "B",
            viewId: "idB",
            viewType: ViewType.OPTIONAL,
          },
        ],
        [KEY_VIEW_STATUS]: [
          {
            status: ViewStatus.DEFAULT,
            viewName: "A",
            viewId: "idA",
          },
          {
            status: ViewStatus.DEFAULT,
            viewName: "B",
            viewId: "idB",
          },
        ],
        [KEY_MEDIA]: [
          {
            fileId: "media1",
            filename: "filename",
            mediaType: MediaType.IMAGE_P,
            mimeType: "mimeType",
            uploaded: 1,
            uploader: "uploader",
            view: "B",
          },
        ],
        [KEY_READY]: [
          {
            catalog: "y500",
            contentId: "media1",
            contentType: ContentType.MEDIA,
            instant: 1,
            user: "_user",
          },
          {
            catalog: "y502",
            contentId: "_contentId",
            contentType: ContentType.MEDIA,
            instant: 1,
            user: "_user",
          },
          {
            catalog: "y505",
            contentId: "_contentId",
            contentType: ContentType.MEDIA,
            instant: 1,
            user: "_user",
          },
        ],
      },
    ];
    const expected = [
      {
        id: "y500",
        displayName: "y500",
        ...catalogDefault,
        selected: true,
        disabled: true,
        viewsReady: ["B"],
      },
      {
        id: "y502",
        displayName: "y502",
        ...catalogDefault,
      },
      {
        id: "y503",
        displayName: "y503",
        ...catalogDefault,
      },
    ];
    expect(expected).toEqual(getMultiReadyCatalogs(items, catalogs));
  });
});
