import { PreviewType } from "../../../../componentsBase/Preview";
import decorateCellThumbnails from "../decorateCellThumbnails";
import { MediaType } from "../../../../interfaces";

describe("getThumbnails", () => {
  test("1 IMAGE & 1 badge", () => {
    const expected = [
      {
        badges: [
          {
            label: "_view_1",
            tooltip: "_view_1",
            style: {
              minWidth: 40,
              left: 8,
              top: 6,
            },
          },
        ],
        id: "thumb",
        srcUrl: "/seecommerce/products/media-content/_fileId_1/s",
        srcType: PreviewType.IMAGE,
        placeholderIcon: "photo",
        placeholderIconStyle: { color: "#ddd" },
        paperFold: true,
      },
    ];

    expect(expected).toEqual(
      decorateCellThumbnails({
        businessId: "_businessId_1",
        fileId: "_fileId_1",
        filename: "_filename_1",
        mediaType: MediaType.IMAGE_S,
        mediaTypeLabel: "_mediaTypeLabel",
        mimeType: "_mimeType_1",
        uploaded: 1584528410295,
        uploader: "_uploader_1",
        view: "_view_1",
      })
    );
  });

  test("1 IMAGE_S & 0 badge", () => {
    const expected = [
      {
        badges: [],
        id: "thumb",
        srcUrl: "/seecommerce/products/media-content/_fileId_1/s",
        srcType: PreviewType.IMAGE,
        placeholderIcon: "photo",
        placeholderIconStyle: { color: "#ddd" },
        paperFold: true,
      },
    ];

    expect(expected).toEqual(
      decorateCellThumbnails({
        businessId: "_businessId_1",
        fileId: "_fileId_1",
        filename: "_filename_1",
        mediaType: MediaType.IMAGE_S,
        mediaTypeLabel: "_mediaTypeLabel",
        mimeType: "_mimeType_1",
        uploaded: 1584528410295,
        uploader: "_uploader_1",
        view: "",
      })
    );
  });

  test("1 IMAGE_P & 0 badge", () => {
    const expected = [
      {
        badges: [],
        id: "thumb",
        srcUrl: "/seecommerce/products/media-content/_fileId_1/s",
        srcType: PreviewType.IMAGE,
        placeholderIcon: "photo_filter",
        placeholderIconStyle: { color: "#ddd" },
        paperFold: false,
      },
    ];

    expect(expected).toEqual(
      decorateCellThumbnails({
        businessId: "_businessId_1",
        fileId: "_fileId_1",
        filename: "_filename_1",
        mediaType: MediaType.IMAGE_P,
        mediaTypeLabel: "_mediaTypeLabel",
        mimeType: "_mimeType_1",
        uploaded: 1584528410295,
        uploader: "_uploader_1",
        view: "",
      })
    );
  });

  test("1 VIDEO & 0 badge", () => {
    const expected = [
      {
        badges: [],
        id: "thumb",
        srcUrl: "/seecommerce/products/media-content/_fileId_1/LQ",
        srcType: PreviewType.VIDEO,
        placeholderIcon: "movie",
        placeholderIconStyle: { color: "#ddd" },
        paperFold: false,
      },
    ];

    expect(expected).toEqual(
      decorateCellThumbnails({
        businessId: "_businessId_1",
        fileId: "_fileId_1",
        filename: "_filename_1",
        mediaType: MediaType.VIDEO,
        mediaTypeLabel: "_mediaTypeLabel",
        mimeType: "_mimeType_1",
        uploaded: 1584528410295,
        uploader: "_uploader_1",
        view: "",
      })
    );
  });
});
