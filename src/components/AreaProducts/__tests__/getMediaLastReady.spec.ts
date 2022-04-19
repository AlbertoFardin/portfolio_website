import getMediaLastReady from "../getMediaLastReady";
import { MediaType, ContentType } from "../../../interfaces";

const medias = [
  {
    view: "A",
    filename: "_filename",
    uploader: "_uploader",
    mimeType: "_mimeType",
    uploaded: 1565283252152,
    mediaType: MediaType.IMAGE_P,
    fileId: "1",
  },
  {
    view: "A",
    filename: "_filename",
    uploader: "_uploader",
    mimeType: "_mimeType",
    uploaded: 1575553038743,
    mediaType: MediaType.IMAGE_P,
    fileId: "2",
  },
  {
    view: "X",
    filename: "_filename",
    uploader: "_uploader",
    mimeType: "_mimeType",
    uploaded: 1575553026631,
    mediaType: MediaType.IMAGE_P,
    fileId: "3",
  },
  {
    view: "A",
    filename: "_filename",
    uploader: "_uploader",
    mimeType: "_mimeType",
    uploaded: 1575553026631,
    mediaType: MediaType.IMAGE_P,
    fileId: "4",
  },
];

const ready = [
  {
    catalog: "y500",
    contentId: "1",
    contentType: ContentType.MEDIA,
    user: "_user",
    instant: 1500000000001,
  },
  {
    catalog: "y500",
    contentId: "2",
    contentType: ContentType.MEDIA,
    user: "_user",
    instant: 1500000000002,
  },
  {
    catalog: "y500",
    contentId: "4",
    contentType: ContentType.MEDIA,
    user: "_user",
    instant: 1500000000003,
  },
  {
    catalog: "y500",
    contentId: "2",
    contentType: ContentType.MEDIA,
    user: "_user",
    instant: 1500000000099,
  },
];

describe("getMediaLastReady", () => {
  test("NOT FOUND", () => {
    const expected = null;
    expect(expected).toEqual(getMediaLastReady(ready, medias, "X"));
  });

  test("test", () => {
    const expected = {
      view: "A",
      filename: "_filename",
      uploader: "_uploader",
      mimeType: "_mimeType",
      uploaded: 1575553038743,
      mediaType: MediaType.IMAGE_P,
      fileId: "2",
    };
    expect(expected).toEqual(getMediaLastReady(ready, medias, "A"));
  });
});
