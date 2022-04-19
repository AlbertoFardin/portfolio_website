import {
  IProduct,
  MediaType,
  ViewCheck,
  IViewDetail,
  ViewStatus,
  ViewType,
  Category,
  ViewStatusAnnotated,
  ContentType,
} from "../../../interfaces";
import getBadgeViewCatalogs from "../getBadgeViewCatalogs";
import * as Colors from "../../../componentsBase/style/Colors";
import {
  KEY_MEDIA,
  KEY_PUBLICATIONS,
  KEY_READY,
  KEY_ROOT_ID,
} from "../../../constants";

const item: IProduct = {
  id: "id_1",
  version: 1,
  [KEY_ROOT_ID]: "rootid_1",
  [KEY_MEDIA]: [
    {
      fileId: "Aid_1",
      filename: "A_1",
      mediaType: MediaType.IMAGE_S,
      mimeType: "mimeType",
      uploaded: 1,
      uploader: "uploader",
      view: "A",
    },
    {
      fileId: "A_2",
      filename: "Aid_2",
      mediaType: MediaType.IMAGE_S,
      mimeType: "mimeType",
      uploaded: 2,
      uploader: "uploader",
      view: "A",
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
  catalog: ["cat1", "cat2", "cat3", "cat666"],
  mediaType: MediaType.IMAGE_S,
  category: Category.DEFAULT,
};
const tenantCatalogs = [
  {
    id: "cat1",
    displayName: "cat1",
  },
  {
    id: "cat2",
    displayName: "cat2",
  },
  {
    id: "cat3",
    displayName: "cat3",
  },
];
const dispatch = () => null;

describe("getBadgeViewCatalogs", () => {
  test("no badge", () => {
    expect(
      getBadgeViewCatalogs({
        viewDetail: {
          ...viewDetail,
          catalog: [],
        },
        item,
        dispatch,
        tenantCatalogs,
      })
    ).toEqual(null);
  });

  test("style", () => {
    const style = { margin: 10 };
    expect(
      getBadgeViewCatalogs({
        viewDetail: {
          ...viewDetail,
          viewId: "viewid_B",
          viewName: "B",
        },
        item,
        dispatch,
        tenantCatalogs,
        style,
      })
    ).toMatchObject({
      style,
    });
  });

  test("catalogs NOT READY", () => {
    expect(
      getBadgeViewCatalogs({
        viewDetail: {
          ...viewDetail,
          viewId: "viewid_B",
          viewName: "B",
        },
        item,
        dispatch,
        tenantCatalogs,
      })
    ).toMatchObject({
      color: Colors.Gray2,
      label: "0/3",
    });
  });

  test("catalogs REVIEW", () => {
    expect(
      getBadgeViewCatalogs({
        viewDetail: {
          ...viewDetail,
          status: ViewStatus.REVIEW,
        },
        item: {
          ...item,
          [KEY_READY]: [
            {
              catalog: "cat1",
              contentId: "Aid_1",
              contentType: ContentType.MEDIA,
              instant: 123,
              user: "mario",
            },
          ],
        },
        dispatch,
        tenantCatalogs,
      })
    ).toMatchObject({
      color: Colors.Orange,
      label: "1/3",
    });
  });

  test("catalogs READY", () => {
    expect(
      getBadgeViewCatalogs({
        viewDetail,
        item: {
          ...item,
          [KEY_READY]: [
            {
              catalog: "cat1",
              contentId: "Aid_1",
              contentType: ContentType.MEDIA,
              instant: 123,
              user: "mario",
            },
          ],
        },
        dispatch,
        tenantCatalogs,
      })
    ).toMatchObject({
      color: Colors.Cyan,
      label: "1/3",
      variant: "light",
    });
  });

  test("catalogs READY and CONFIRMED", () => {
    expect(
      getBadgeViewCatalogs({
        viewDetail,
        item: {
          ...item,
          [KEY_PUBLICATIONS]: [
            {
              catalog: "cat1",
              contentId: "Aid_1",
              contentType: ContentType.MEDIA,
              instant: 123,
              user: "mario",
            },
          ],
          [KEY_READY]: [
            {
              catalog: "cat1",
              contentId: "Aid_1",
              contentType: ContentType.MEDIA,
              instant: 123,
              user: "mario",
            },
          ],
        },
        dispatch,
        tenantCatalogs,
      })
    ).toMatchObject({
      color: Colors.Cyan,
      label: "1/3",
      variant: "bold",
    });
  });

  test("single catalog READY and CONFIRMED", () => {
    expect(
      getBadgeViewCatalogs({
        viewDetail,
        item: {
          ...item,
          [KEY_PUBLICATIONS]: [
            {
              catalog: "cat1",
              contentId: "Aid_1",
              contentType: ContentType.MEDIA,
              instant: 123,
              user: "mario",
            },
          ],
          [KEY_READY]: [
            {
              catalog: "cat1",
              contentId: "Aid_1",
              contentType: ContentType.MEDIA,
              instant: 123,
              user: "mario",
            },
          ],
        },
        dispatch,
        tenantCatalogs: [
          {
            id: "cat1",
            displayName: "cat1",
          },
        ],
      })
    ).toMatchObject({
      color: Colors.Cyan,
      icon: "public",
      variant: "light",
    });
  });
});
