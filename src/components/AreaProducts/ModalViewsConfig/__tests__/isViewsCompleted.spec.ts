import { MediaType, ViewType } from "../../../../interfaces";
import isViewsCompleted from "../isViewsCompleted";
import { ViewStatus } from "../reducer";

describe("ModalMassiveEditViews - isViewsCompleted", () => {
  test("status NONE", () => {
    expect(true).toEqual(
      isViewsCompleted([
        {
          id: "A",
          status: ViewStatus.NONE,
          data: {},
        },
      ])
    );
  });

  test("status VALUED", () => {
    expect(true).toEqual(
      isViewsCompleted([
        {
          id: "A",
          status: ViewStatus.VALUED,
          data: {},
        },
      ])
    );
  });

  test("status REMOVE", () => {
    expect(true).toEqual(
      isViewsCompleted([
        {
          id: "A",
          status: ViewStatus.REMOVE,
          data: {},
        },
      ])
    );
  });

  test("status MODIFY", () => {
    expect(true).toEqual(
      isViewsCompleted([
        {
          id: "A",
          status: ViewStatus.MODIFY,
          data: {},
        },
      ])
    );
    expect(true).toEqual(
      isViewsCompleted([
        {
          id: "A",
          status: ViewStatus.MODIFY,
          data: {
            viewType: ViewType.MANDATORY,
            mediaType: MediaType.IMAGE_S,
            catalog: ["cat1", "cat2"],
          },
        },
      ])
    );
    expect(false).toEqual(
      isViewsCompleted([
        {
          id: "A",
          status: ViewStatus.MODIFY,
          data: {
            catalog: [],
          },
        },
      ])
    );
  });

  test("status CREATE", () => {
    expect(true).toEqual(
      isViewsCompleted([
        {
          id: "A",
          status: ViewStatus.CREATE,
          data: {
            viewType: ViewType.MANDATORY,
            mediaType: MediaType.IMAGE_S,
            catalog: ["cat1", "cat2"],
          },
        },
      ])
    );
    expect(false).toEqual(
      isViewsCompleted([
        {
          id: "A",
          status: ViewStatus.CREATE,
          data: {},
        },
      ])
    );
    expect(false).toEqual(
      isViewsCompleted([
        {
          id: "A",
          status: ViewStatus.CREATE,
          data: {
            mediaType: MediaType.IMAGE_S,
            catalog: ["cat1", "cat2"],
          },
        },
      ])
    );
    expect(false).toEqual(
      isViewsCompleted([
        {
          id: "A",
          status: ViewStatus.CREATE,
          data: {
            viewType: ViewType.MANDATORY,
            catalog: ["cat1", "cat2"],
          },
        },
      ])
    );
    expect(false).toEqual(
      isViewsCompleted([
        {
          id: "A",
          status: ViewStatus.CREATE,
          data: {
            viewType: ViewType.MANDATORY,
            mediaType: MediaType.IMAGE_S,
            catalog: [],
          },
        },
      ])
    );
  });
});
