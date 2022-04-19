import {
  IUserProfile,
  IProduct,
  MediaType,
  ViewCheck,
  IViewDetail,
  ViewStatus,
  ViewType,
  Category,
  ViewStatusAnnotated,
  IAssignmentContentType,
  IAssignmentType,
  IM2m,
} from "../../../interfaces";
import getBadgeViewAssignee from "../getBadgeViewAssignee";
import * as Colors from "../../../componentsBase/style/Colors";
import { KEY_ASSIGNMENTS, KEY_ROOT_ID } from "../../../constants";

const users: IUserProfile[] = [1, 2, 3, 4, 5].map((n) => ({
  id: `userid_${n}`,
  sub: `cognito_${n}`,
  updatedAt: "1",
  createdAt: "1",
  picture: `picture_${n}`,
  firstName: `firstName_${n}`,
  lastName: `lastName_${n}`,
  group: "DEMO",
  roles: [],
}));
const m2ms: IM2m[] = [
  {
    clientId: "valueClientId",
    sub: "valueSub",
    name: "valueName",
  },
];
const item: IProduct = {
  id: "id_1",
  version: 1,
  [KEY_ROOT_ID]: "rootid_1",
  [KEY_ASSIGNMENTS]: [
    {
      id: "A",
      contentType: IAssignmentContentType.VIEW,
      assignee: "userid_1",
      assignmentType: IAssignmentType.DEFAULT,
    },
  ],
};
const viewDetail: IViewDetail = {
  viewId: "viewid_A",
  viewName: "A",
  status: ViewStatus.DEFAULT,
  check: ViewCheck.CHECK,
  viewType: ViewType.OPTIONAL,
  viewStatusAnnotated: ViewStatusAnnotated.ANNOTATION_NOT_RESOLVED,
  catalog: ["cat1", "cat2"],
  mediaType: MediaType.IMAGE_S,
  category: Category.DEFAULT,
};
const dispatch = () => null;

describe("getBadgeViewAssignee", () => {
  test("no badge", () => {
    const item = {
      id: "id_1",
      version: 1,
      [KEY_ROOT_ID]: "rootid_1",
    };
    expect([]).toEqual(
      getBadgeViewAssignee({ viewDetail, users, m2ms, item, dispatch })
    );
  });

  test("single badge -> style", () => {
    const style = { margin: 10 };
    const badges = getBadgeViewAssignee({
      viewDetail,
      users,
      m2ms,
      item,
      dispatch,
      style,
    });
    expect(1).toEqual(badges.length);
    expect(badges[0]).toMatchObject({
      color: Colors.Gray2,
      style,
    });
  });

  test("single badge -> avatar", () => {
    expect(
      getBadgeViewAssignee({ viewDetail, users, m2ms, item, dispatch })[0]
    ).toMatchObject({
      avatar: "picture_1",
      icon: undefined,
    });
  });

  test("single badge -> tooltip", () => {
    expect(
      getBadgeViewAssignee({ viewDetail, users, m2ms, item, dispatch })[0]
    ).toMatchObject({
      tooltip: "Assigned to firstName_1 lastName_1",
    });
  });

  test("more badge", () => {
    const item: IProduct = {
      id: "id_1",
      version: 1,
      [KEY_ROOT_ID]: "rootid_1",
      [KEY_ASSIGNMENTS]: [1, 2, 3, 4, 5, 6, 7].map((n) => ({
        id: "A",
        contentType: IAssignmentContentType.VIEW,
        assignee: `userid_${n}`,
        assignmentType: IAssignmentType.DEFAULT,
      })),
    };
    const badges = getBadgeViewAssignee({
      viewDetail,
      users,
      m2ms,
      item,
      dispatch,
      maxCount: 3,
    });
    expect(3).toEqual(badges.length);
    expect("picture_1").toEqual(badges[0].avatar);
    expect("picture_2").toEqual(badges[1].avatar);
    expect("+5").toEqual(badges[2].label);
  });
});
