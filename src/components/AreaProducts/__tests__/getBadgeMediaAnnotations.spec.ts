import { MediaType, IMedia } from "../../../interfaces";
import getBadgeMediaAnnotations from "../getBadgeMediaAnnotations";
import * as Colors from "../../../componentsBase/style/Colors";

describe("getBadgeMediaAnnotations", () => {
  test("no badge", () => {
    const media: IMedia = {
      fileId: "_fileId",
      filename: "_filename",
      mediaType: MediaType.IMAGE_S,
      mimeType: "_mimeType",
      uploaded: 123,
      uploader: "_uploader",
      view: "_view",
    };
    expect(getBadgeMediaAnnotations({ media })).toEqual(null);
  });

  test("style", () => {
    const media: IMedia = {
      fileId: "_fileId",
      annotationsResolved: true,
      filename: "_filename",
      mediaType: MediaType.IMAGE_S,
      mimeType: "_mimeType",
      uploaded: 123,
      uploader: "_uploader",
      view: "_view",
    };
    const style = { margin: 10 };
    expect(getBadgeMediaAnnotations({ media, style })).toMatchObject({
      style,
    });
  });

  test("resolved", () => {
    const media: IMedia = {
      fileId: "_fileId",
      annotationsResolved: true,
      filename: "_filename",
      mediaType: MediaType.IMAGE_S,
      mimeType: "_mimeType",
      uploaded: 123,
      uploader: "_uploader",
      view: "_view",
    };
    expect(getBadgeMediaAnnotations({ media })).toMatchObject({
      color: "#ccc",
      icon: "messenger",
    });
  });

  test("not resolved", () => {
    const media: IMedia = {
      fileId: "_fileId",
      annotationsResolved: false,
      filename: "_filename",
      mediaType: MediaType.IMAGE_S,
      mimeType: "_mimeType",
      uploaded: 123,
      uploader: "_uploader",
      view: "_view",
    };
    expect(getBadgeMediaAnnotations({ media })).toMatchObject({
      color: Colors.Purple,
      icon: "messenger",
    });
  });
});
