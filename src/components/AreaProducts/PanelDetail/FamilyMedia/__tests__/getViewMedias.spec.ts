import getViewMedias from "../getViewMedias";
import { ViewType, MediaType, Category } from "../../../../../interfaces";
import { KEY_VIEW_DATA, KEY_MEDIA, KEY_ROOT_ID } from "../../../../../constants";

describe("getMedias", () => {
  test("array media is empty", () => {
    const expected = [
      {
        fileId: "A",
        view: "A",
      },
    ];

    expect(expected).toEqual(
      getViewMedias({
        id: "xxx",
        version: 1,
        [KEY_ROOT_ID]: "KEY_ROOT_ID",
        [KEY_VIEW_DATA]: [
          {
            category: Category.DEFAULT,
            viewName: "A",
            viewId: "A",
            viewType: ViewType.OPTIONAL,
            mediaType: MediaType.IMAGE_P,
            catalog: ["Y500", "Y501"],
          },
        ],
        [KEY_MEDIA]: [],
      })
    );
  });

  test("array media === array view", () => {
    const media = [
      {
        fileId: "e97bcb6e-35c9-4653-914e-610442b27886",
        filename: "E20984690630549F9999_D.jpg",
        mediaType: "POST_PRODUCED",
        mimeType: "image/jpeg",
        uploaded: 1565283252152,
        uploader: "moncler-internal",
        view: "A",
      },
      {
        fileId: "A",
        view: "A",
      },
    ];
    const expected = media;

    expect(expected).toEqual(
      getViewMedias({
        id: "xxx",
        version: 1,
        [KEY_ROOT_ID]: "KEY_ROOT_ID",
        [KEY_VIEW_DATA]: [
          {
            category: Category.DEFAULT,
            viewName: "A",
            viewId: "A",
            viewType: ViewType.OPTIONAL,
            mediaType: MediaType.IMAGE_P,
            catalog: ["Y500", "Y501"],
          },
        ],
        [KEY_MEDIA]: [
          {
            fileId: "e97bcb6e-35c9-4653-914e-610442b27886",
            filename: "E20984690630549F9999_D.jpg",
            mediaType: MediaType.IMAGE_P,
            mimeType: "image/jpeg",
            uploaded: 1565283252152,
            uploader: "moncler-internal",
            view: "A",
          },
        ],
      })
    );
  });

  test("array media !== array view", () => {
    const expected = [
      {
        fileId: "e97bcb6e-35c9-4653-914e-610442b27886",
        filename: "E20984690630549F9999_D.jpg",
        mediaType: "POST_PRODUCED",
        mimeType: "image/jpeg",
        uploaded: 1565283252152,
        uploader: "moncler-internal",
        view: "A",
      },
      {
        fileId: "A",
        view: "A",
      },
      {
        fileId: "B",
        view: "B",
      },
    ];

    expect(expected).toEqual(
      getViewMedias({
        id: "xxx",
        version: 1,
        [KEY_ROOT_ID]: "KEY_ROOT_ID",
        [KEY_VIEW_DATA]: [
          {
            category: Category.DEFAULT,
            viewName: "A",
            viewId: "A",
            viewType: ViewType.OPTIONAL,
            mediaType: MediaType.IMAGE_P,
            catalog: ["Y500", "Y501"],
          },
          {
            category: Category.DEFAULT,
            viewName: "B",
            viewId: "B",
            viewType: ViewType.OPTIONAL,
            mediaType: MediaType.IMAGE_S,
            catalog: ["Y500", "Y501"],
          },
        ],
        [KEY_MEDIA]: [
          {
            fileId: "e97bcb6e-35c9-4653-914e-610442b27886",
            filename: "E20984690630549F9999_D.jpg",
            mediaType: MediaType.IMAGE_P,
            mimeType: "image/jpeg",
            uploaded: 1565283252152,
            uploader: "moncler-internal",
            view: "A",
          },
          {
            fileId: "_pippo",
            filename: "_pippo.jpg",
            mediaType: MediaType.IMAGE_P,
            mimeType: "image/jpeg",
            uploaded: 1565283252152,
            uploader: "moncler-internal",
            view: "PIPPO",
          },
        ],
      })
    );
  });
});
