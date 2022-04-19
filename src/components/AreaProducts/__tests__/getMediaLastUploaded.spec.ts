import getMediaLastUploaded from "../getMediaLastUploaded";
import { MediaType } from "../../../interfaces";

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

describe("getMediaLastUploaded", () => {
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
    expect(expected).toEqual(getMediaLastUploaded(medias, "A"));
  });
});
