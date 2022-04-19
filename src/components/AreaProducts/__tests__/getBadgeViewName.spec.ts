import {
  MediaType,
  ViewCheck,
  IViewDetail,
  ViewStatus,
  ViewType,
  Category,
  ViewStatusAnnotated,
} from "../../../interfaces";
import getBadgeViewName from "../getBadgeViewName";
import * as Colors from "../../../componentsBase/style/Colors";

describe("getBadgeViewName", () => {
  test("style", () => {
    const viewDetail: IViewDetail = {
      viewId: "A_id",
      viewName: "A",
      status: ViewStatus.DEFAULT,
      check: ViewCheck.CHECK,
      viewType: ViewType.OPTIONAL,
      viewStatusAnnotated: ViewStatusAnnotated.ANNOTATION_NOT_RESOLVED,
      catalog: ["cat1", "cat2"],
      mediaType: MediaType.IMAGE_S,
      category: Category.DEFAULT,
    };
    const style = { margin: 10 };
    expect(getBadgeViewName({ viewDetail, style })).toMatchObject({
      style: {
        minWidth: 40,
        padding: "0 5px",
        margin: 10,
      },
    });
  });

  test("label required", () => {
    const viewDetail: IViewDetail = {
      viewId: "A_id",
      viewName: "A",
      status: ViewStatus.DEFAULT,
      check: ViewCheck.CHECK,
      viewType: ViewType.OPTIONAL,
      viewStatusAnnotated: ViewStatusAnnotated.ANNOTATION_NOT_RESOLVED,
      catalog: ["cat1", "cat2"],
      mediaType: MediaType.IMAGE_S,
      category: Category.DEFAULT,
    };
    expect(getBadgeViewName({ viewDetail })).toMatchObject({
      label: "A",
      labelRequired: false,
    });
  });

  test("label required", () => {
    const viewDetail: IViewDetail = {
      viewId: "A_id",
      viewName: "A",
      status: ViewStatus.DEFAULT,
      check: ViewCheck.CHECK,
      viewType: ViewType.MANDATORY,
      viewStatusAnnotated: ViewStatusAnnotated.ANNOTATION_NOT_RESOLVED,
      catalog: ["cat1", "cat2"],
      mediaType: MediaType.IMAGE_S,
      category: Category.DEFAULT,
    };
    expect(getBadgeViewName({ viewDetail })).toMatchObject({
      label: "A",
      labelRequired: true,
    });
  });

  test("check", () => {
    const viewDetail: IViewDetail = {
      viewId: "A_id",
      viewName: "A",
      status: ViewStatus.DEFAULT,
      check: ViewCheck.CHECK,
      viewType: ViewType.MANDATORY,
      viewStatusAnnotated: ViewStatusAnnotated.ANNOTATION_NOT_RESOLVED,
      catalog: ["cat1", "cat2"],
      mediaType: MediaType.IMAGE_S,
      category: Category.DEFAULT,
    };
    expect(getBadgeViewName({ viewDetail })).toMatchObject({
      color: Colors.Purple,
      icon: "check_circle",
    });
  });

  test("check to verify", () => {
    const viewDetail: IViewDetail = {
      viewId: "A_id",
      viewName: "A",
      status: ViewStatus.DEFAULT,
      check: ViewCheck.CHECK_TO_VERIFY,
      viewType: ViewType.MANDATORY,
      viewStatusAnnotated: ViewStatusAnnotated.ANNOTATION_NOT_RESOLVED,
      catalog: ["cat1", "cat2"],
      mediaType: MediaType.IMAGE_S,
      category: Category.DEFAULT,
    };
    expect(getBadgeViewName({ viewDetail })).toMatchObject({
      color: Colors.Gray2,
      icon: "check_circle",
      label: "A",
    });
  });

  test("not check", () => {
    const viewDetail: IViewDetail = {
      viewId: "A_id",
      viewName: "A",
      status: ViewStatus.DEFAULT,
      check: ViewCheck.NO_CHECK,
      viewType: ViewType.MANDATORY,
      viewStatusAnnotated: ViewStatusAnnotated.ANNOTATION_NOT_RESOLVED,
      catalog: ["cat1", "cat2"],
      mediaType: MediaType.IMAGE_S,
      category: Category.DEFAULT,
    };
    expect(getBadgeViewName({ viewDetail })).toMatchObject({
      color: Colors.Gray2,
      icon: "",
    });
  });
});
