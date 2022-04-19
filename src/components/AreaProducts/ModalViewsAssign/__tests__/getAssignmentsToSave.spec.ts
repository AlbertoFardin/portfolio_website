import {
  KEY_ROOT_ID,
  KEY_VIEW_DATA,
  KEY_ASSIGNMENTS,
  KEY_VIEW_STATUS,
} from "../../../../constants";
import {
  Category,
  IAssignmentContentType,
  IAssignmentStatus,
  IAssignmentType,
  IViewData,
  MediaType,
  ViewStatus,
  ViewType,
} from "../../../../interfaces";
import getAssignmentsToSave from "../getAssignmentsToSave";
import { ACTION_CLICKED } from "../reducer";

const selectedAssigneesId = ["assignee1_id", "assignee2_id"];
const selectedViewsId = ["view_B", "view_D"];
const viewsData: IViewData[] = [
  {
    category: Category.DEFAULT,
    mediaType: MediaType.IMAGE_P,
    viewName: "view_A",
    viewId: "view_A_id",
    viewType: ViewType.OPTIONAL,
    catalog: [],
  },
  {
    category: Category.DEFAULT,
    mediaType: MediaType.IMAGE_S,
    viewName: "view_B",
    viewId: "view_B_id",
    viewType: ViewType.OPTIONAL,
    catalog: [],
  },
  {
    category: Category.DEFAULT,
    mediaType: MediaType.VIDEO,
    viewName: "view_C",
    viewId: "view_C_id",
    viewType: ViewType.MANDATORY,
    catalog: [],
  },
  {
    category: Category.DEFAULT,
    mediaType: MediaType.IMAGE_P,
    viewName: "view_D",
    viewId: "view_D_id",
    viewType: ViewType.MANDATORY,
    catalog: [],
  },
];
const viewsStatus = [
  {
    status: ViewStatus.DEFAULT,
    viewName: "view_A",
    viewId: "view_A_id",
  },
  {
    status: ViewStatus.DEFAULT,
    viewName: "view_B",
    viewId: "view_B_id",
  },
  {
    status: ViewStatus.REVIEW,
    viewName: "view_C",
    viewId: "view_C_id",
  },
  {
    status: ViewStatus.REVIEW,
    viewName: "view_D",
    viewId: "view_D_id",
  },
];
const items = [
  {
    id: "id_item1",
    version: 1,
    [KEY_ROOT_ID]: "rootid_item1",
    [KEY_VIEW_DATA]: viewsData,
    [KEY_VIEW_STATUS]: viewsStatus,
    [KEY_ASSIGNMENTS]: [
      {
        id: "view_A",
        contentType: IAssignmentContentType.VIEW,
        catalogs: [],
        assignee: "assignee1_id",
        assignmentType: IAssignmentType.DEFAULT,
        status: IAssignmentStatus.DEFAULT,
        notes: "a_note1",
        instant: 123,
        user: "user1_id",
      },
      {
        id: "view_B",
        contentType: IAssignmentContentType.VIEW,
        catalogs: [],
        assignee: "assignee2_id",
        assignmentType: IAssignmentType.DEFAULT,
        status: IAssignmentStatus.DEFAULT,
        notes: "a_note2",
        instant: 123,
        user: "user2_id",
      },
      {
        id: "view_C",
        contentType: IAssignmentContentType.VIEW,
        catalogs: [],
        assignee: "assignee3_id",
        assignmentType: IAssignmentType.DEFAULT,
        status: IAssignmentStatus.DEFAULT,
        notes: "a_note3",
        instant: 123,
        user: "user3_id",
      },
    ],
  },
  {
    id: "id_item2",
    version: 2,
    [KEY_ROOT_ID]: "rootid_item2",
    [KEY_VIEW_DATA]: viewsData,
    [KEY_VIEW_STATUS]: viewsStatus,
    [KEY_ASSIGNMENTS]: [
      {
        id: "view_B",
        contentType: IAssignmentContentType.VIEW,
        catalogs: [],
        assignee: "pippo",
        assignmentType: IAssignmentType.DEFAULT,
        status: IAssignmentStatus.DEFAULT,
        notes: "",
        instant: 123,
        user: "user1",
      },
      {
        id: "view_B",
        contentType: IAssignmentContentType.VIEW,
        catalogs: [],
        assignee: "topolino",
        assignmentType: IAssignmentType.DEFAULT,
        status: IAssignmentStatus.DEFAULT,
        notes: "",
        instant: 123,
        user: "user1",
      },
      {
        id: "view_Z",
        contentType: IAssignmentContentType.VIEW,
        catalogs: [],
        assignee: "assignee1_id",
        assignmentType: IAssignmentType.DEFAULT,
        status: IAssignmentStatus.DEFAULT,
        notes: "b_note1",
        instant: 123,
        user: "user1_id",
      },
    ],
  },
];

describe("ModalMassiveAssign getAssignmentsToSave", () => {
  test("empty - views id not found", () => {
    const expected = [];
    expect(expected).toEqual(
      getAssignmentsToSave({
        actionClicked: ACTION_CLICKED.ASSIGN,
        selectedAssigneesId,
        selectedViewsId: ["view_X", "view_Y"],
        items,
      })
    );
  });

  test("actionClicked NONE", () => {
    const expected = [];
    expect(expected).toEqual(
      getAssignmentsToSave({
        actionClicked: ACTION_CLICKED.NONE,
        selectedAssigneesId,
        selectedViewsId,
        items,
      })
    );
  });

  test("actionClicked REMOVE", () => {
    const expected = [
      {
        assignmentsToAdd: [],
        assignmentsToRemove: [
          {
            assignee: "assignee2_id",
            assignmentType: IAssignmentType.DEFAULT,
            catalogs: [],
            contentType: IAssignmentContentType.VIEW,
            id: "view_B",
            instant: 123,
            notes: "a_note2",
            status: IAssignmentStatus.DEFAULT,
            user: "user2_id",
          },
        ],
        entityId: "id_item1",
        version: 1,
      },
      {
        assignmentsToAdd: [],
        assignmentsToRemove: [
          {
            assignee: "pippo",
            assignmentType: IAssignmentType.DEFAULT,
            catalogs: [],
            contentType: IAssignmentContentType.VIEW,
            id: "view_B",
            instant: 123,
            notes: "",
            status: IAssignmentStatus.DEFAULT,
            user: "user1",
          },
          {
            assignee: "topolino",
            assignmentType: IAssignmentType.DEFAULT,
            catalogs: [],
            contentType: IAssignmentContentType.VIEW,
            id: "view_B",
            instant: 123,
            notes: "",
            status: IAssignmentStatus.DEFAULT,
            user: "user1",
          },
        ],
        entityId: "id_item2",
        version: 2,
      },
    ];
    expect(expected).toEqual(
      getAssignmentsToSave({
        actionClicked: ACTION_CLICKED.REMOVE,
        selectedAssigneesId,
        selectedViewsId,
        items,
      })
    );
  });

  test("actionClicked ASSIGN", () => {
    const expected = [
      {
        assignmentsToAdd: [
          {
            id: "view_B",
            contentType: IAssignmentContentType.VIEW,
            assignee: "assignee1_id",
          },
          {
            id: "view_B",
            contentType: IAssignmentContentType.VIEW,
            assignee: "assignee2_id",
          },
          {
            id: "view_D",
            contentType: IAssignmentContentType.VIEW,
            assignee: "assignee1_id",
          },
          {
            id: "view_D",
            contentType: IAssignmentContentType.VIEW,
            assignee: "assignee2_id",
          },
        ],
        assignmentsToRemove: [
          {
            assignee: "assignee2_id",
            assignmentType: IAssignmentType.DEFAULT,
            catalogs: [],
            contentType: IAssignmentContentType.VIEW,
            id: "view_B",
            instant: 123,
            notes: "a_note2",
            status: IAssignmentStatus.DEFAULT,
            user: "user2_id",
          },
        ],
        entityId: "id_item1",
        version: 1,
      },
      {
        assignmentsToAdd: [
          {
            id: "view_B",
            contentType: IAssignmentContentType.VIEW,
            assignee: "assignee1_id",
          },
          {
            id: "view_B",
            contentType: IAssignmentContentType.VIEW,
            assignee: "assignee2_id",
          },
          {
            id: "view_D",
            contentType: IAssignmentContentType.VIEW,
            assignee: "assignee1_id",
          },
          {
            id: "view_D",
            contentType: IAssignmentContentType.VIEW,
            assignee: "assignee2_id",
          },
        ],
        assignmentsToRemove: [
          {
            assignee: "pippo",
            assignmentType: IAssignmentType.DEFAULT,
            catalogs: [],
            contentType: IAssignmentContentType.VIEW,
            id: "view_B",
            instant: 123,
            notes: "",
            status: IAssignmentStatus.DEFAULT,
            user: "user1",
          },
          {
            assignee: "topolino",
            assignmentType: IAssignmentType.DEFAULT,
            catalogs: [],
            contentType: IAssignmentContentType.VIEW,
            id: "view_B",
            instant: 123,
            notes: "",
            status: IAssignmentStatus.DEFAULT,
            user: "user1",
          },
        ],
        entityId: "id_item2",
        version: 2,
      },
    ];
    expect(expected).toEqual(
      getAssignmentsToSave({
        actionClicked: ACTION_CLICKED.ASSIGN,
        selectedAssigneesId,
        selectedViewsId,
        items,
      })
    );
  });
});
