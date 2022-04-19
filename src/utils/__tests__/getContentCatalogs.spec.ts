import { ContentType } from "../../interfaces";
import getCatalogsByContentId from "../getCatalogsByContentId";
import * as catalogsJson from "./catalogs.json";

describe("getCatalogsByContentId", () => {
  test("check contentId", () => {
    const expected = [
      {
        catalog: "y500",
        contentId: "c01a8f42-756b-45ce-add0-89d5f5a47ef0",
        contentType: ContentType.MEDIA,
        user: "auth0|5d23494488b61b0d554d3abc",
        instant: 1569489256007,
      },
      {
        catalog: "y501",
        contentId: "c01a8f42-756b-45ce-add0-89d5f5a47ef0",
        contentType: ContentType.MEDIA,
        user: "auth0|5d23494488b61b0d554d3abc",
        instant: 1569408605428,
      },
      {
        catalog: "y501",
        contentId: "c01a8f42-756b-45ce-add0-89d5f5a47ef0",
        contentType: ContentType.MEDIA,
        user: "auth0|5d23494488b61b0d554d3abc",
        instant: 1569489256007,
      },
      {
        catalog: "y502",
        contentId: "c01a8f42-756b-45ce-add0-89d5f5a47ef0",
        contentType: ContentType.MEDIA,
        user: "auth0|5d23494488b61b0d554d3abc",
        instant: 1569489256007,
      },
      {
        catalog: "y503",
        contentId: "c01a8f42-756b-45ce-add0-89d5f5a47ef0",
        contentType: ContentType.MEDIA,
        user: "auth0|5d23494488b61b0d554d3abc",
        instant: 1569489256007,
      },
      {
        catalog: "y505",
        contentId: "c01a8f42-756b-45ce-add0-89d5f5a47ef0",
        contentType: ContentType.MEDIA,
        user: "auth0|5d23494488b61b0d554d3abc",
        instant: 1569489256007,
      },
    ];
    const catalogs = catalogsJson.map((c) => ({
      ...c,
      contentType: ContentType.MEDIA,
    }));

    expect(expected).toEqual(
      getCatalogsByContentId({
        catalogs,
        contentId: "c01a8f42-756b-45ce-add0-89d5f5a47ef0",
        contentType: ContentType.MEDIA,
      })
    );
  });

  test("check contentType", () => {
    const catalogs = [
      {
        catalog: "y500",
        contentId: "000",
        contentType: ContentType.ATTRIBUTE,
        user: "auth0|5d23494488b61b0d554d3abc",
        instant: 1569489256007,
      },
      {
        catalog: "y501",
        contentId: "001",
        contentType: ContentType.ATTRIBUTE,
        user: "auth0|5d23494488b61b0d554d3abc",
        instant: 1569408605428,
      },
    ];
    const expected = [
      {
        catalog: "y501",
        contentId: "001",
        contentType: ContentType.ATTRIBUTE,
        user: "auth0|5d23494488b61b0d554d3abc",
        instant: 1569408605428,
      },
    ];

    expect(expected).toEqual(
      getCatalogsByContentId({
        catalogs,
        contentId: "001",
        contentType: ContentType.ATTRIBUTE,
      })
    );
  });
});
