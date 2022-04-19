import getViewsReady from "../getViewsReady";
import {
  KEY_ROOT_ID,
  KEY_VIEW_DATA,
  KEY_MEDIA,
  KEY_READY,
} from "../../../../../constants";
import {
  MediaType,
  ViewType,
  ContentType,
  Category,
} from "../../../../../interfaces";

describe("getViewsReady", () => {
  test("0 items", () => {
    expect([]).toEqual(getViewsReady("y500", []));
  });

  test("1 items + 0 ready", () => {
    expect([]).toEqual(
      getViewsReady("y500", [
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
      ])
    );
  });

  test("1 items + 1 ready", () => {
    expect(["A"]).toEqual(
      getViewsReady("y500", [
        {
          id: "id1",
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
          [KEY_READY]: [
            {
              catalog: "y500",
              contentId: "doc1_media1",
              contentType: ContentType.MEDIA,
              instant: 123,
              user: "_user",
            },
          ],
        },
      ])
    );
  });

  test("2 items + 3 ready", () => {
    expect(["A", "B"]).toEqual(
      getViewsReady("y500", [
        {
          id: "id1",
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
          [KEY_READY]: [
            {
              catalog: "y500",
              contentId: "doc1_media1",
              contentType: ContentType.MEDIA,
              instant: 123,
              user: "_user",
            },
          ],
        },
        {
          id: "id2",
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
              view: "B",
            },
          ],
          [KEY_VIEW_DATA]: [
            {
              category: Category.DEFAULT,
              catalog: ["y500", "y501"],
              mediaType: MediaType.IMAGE_P,
              viewName: "B",
              viewId: "B_id",
              viewType: ViewType.MANDATORY,
            },
            {
              category: Category.DEFAULT,
              catalog: ["y500", "y501"],
              mediaType: MediaType.IMAGE_P,
              viewName: "A",
              viewId: "A_id",
              viewType: ViewType.MANDATORY,
            },
          ],
          [KEY_READY]: [
            {
              catalog: "y500",
              contentId: "media1",
              contentType: ContentType.MEDIA,
              instant: 123,
              user: "_user",
            },
            {
              catalog: "y500",
              contentId: "doc2_media2",
              contentType: ContentType.MEDIA,
              instant: 123,
              user: "_user",
            },
            {
              catalog: "y501",
              contentId: "doc2_media2",
              contentType: ContentType.MEDIA,
              instant: 123,
              user: "_user",
            },
          ],
        },
      ])
    );
  });
});
