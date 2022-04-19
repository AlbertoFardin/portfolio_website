import { PreviewType } from "../../../../componentsBase/Preview";
import {
  KEY_CATALOG,
  KEY_READY,
  KEY_VIEW_DATA,
  KEY_MEDIA,
  KEY_ROOT_ID,
  KEY_VIEW_STATUS,
} from "../../../../constants";
import decorateCellThumbnails from "../decorateCellThumbnails";
import {
  ViewType,
  ViewStatus,
  MediaType,
  Category,
  IM2m,
  IUserProfile,
} from "../../../../interfaces";
import getViewBadge from "../../getBadgeViewName";
import getViewDetail from "../../getViewDetail";

const attributeKey = KEY_MEDIA;
const dispatch = () => null;
const getBadges = (item, viewName) => {
  const viewDetail = getViewDetail(item, viewName);
  const badgeViewName = getViewBadge({
    viewDetail,
    style: { left: 8, top: 6 },
  });
  return [badgeViewName];
};
const users: IUserProfile[] = [
  {
    id: "id_mario",
    sub: "id_cognito",
    picture: "url_mario",
    firstName: "Mario",
    lastName: "Rossi",
    createdAt: "creation_date",
    updatedAt: "update_date",
    roles: [],
  },
];
const m2ms: IM2m[] = [
  {
    clientId: "valueClientId",
    sub: "valueSub",
    name: "valueName",
  },
];
const tenantCatalogs = [];

describe("decorateCellThumbnails", () => {
  test("1 IMAGE", () => {
    const item = {
      id: "E20984690630549F9999",
      version: 1,
      [KEY_ROOT_ID]: "rootDocumentId",
      [KEY_CATALOG]: [],
      [KEY_READY]: [],
      [KEY_VIEW_STATUS]: [
        {
          viewName: "A",
          viewId: "A",
          status: ViewStatus.DEFAULT,
        },
      ],
      [KEY_VIEW_DATA]: [
        {
          category: Category.DEFAULT,
          viewName: "A",
          viewId: "A",
          viewType: ViewType.OPTIONAL,
          mediaType: MediaType.IMAGE_S,
          catalog: [],
        },
      ],
      [KEY_MEDIA]: [
        {
          view: "A",
          filename: "E20984690630549F9999_D.jpg",
          uploader: "moncler-internal",
          uploaded: 1565283252152,
          mimeType: "image/jpeg",
          mediaType: MediaType.IMAGE_P,
          fileId: "e97bcb6e-35c9-4653-914e-610442b27886",
        },
      ],
    };
    expect(
      decorateCellThumbnails({
        dispatch,
        item,
        users,
        m2ms,
        tenantCatalogs,
        attributeKey,
      })[0]
    ).toMatchObject({
      label: "",
      id: "e97bcb6e-35c9-4653-914e-610442b27886",
      paperFold: false,
      placeholderIcon: "photo",
      srcType: PreviewType.IMAGE,
      style: { borderColor: "transparent" },
      stylePreview: undefined,
      srcUrl:
        "/seecommerce/products/media-content/e97bcb6e-35c9-4653-914e-610442b27886/s?t=1",
    });
  });

  test("1 VIDEO", () => {
    const item = {
      id: "E20984690630549F9999",
      version: 1,
      [KEY_ROOT_ID]: "rootDocumentId",
      [KEY_CATALOG]: [],
      [KEY_READY]: [],
      [KEY_VIEW_STATUS]: [
        {
          viewName: "A",
          viewId: "A",
          status: ViewStatus.DEFAULT,
        },
      ],
      [KEY_VIEW_DATA]: [
        {
          category: Category.DEFAULT,
          viewName: "A",
          viewId: "A",
          viewType: ViewType.OPTIONAL,
          mediaType: MediaType.VIDEO,
          catalog: [],
        },
      ],
      [KEY_MEDIA]: [
        {
          view: "A",
          filename: "E20984690630549F9999_D.mp4",
          uploader: "moncler-internal",
          uploaded: 1565283252152,
          mimeType: "image/jpeg",
          mediaType: MediaType.VIDEO,
          fileId: "e97bcb6e-35c9-4653-914e-610442b27886",
        },
      ],
    };
    expect(
      decorateCellThumbnails({
        dispatch,
        item,
        users,
        m2ms,
        tenantCatalogs,
        attributeKey,
      })[0]
    ).toMatchObject({
      label: "",
      badges: getBadges(item, "A"),
      id: "e97bcb6e-35c9-4653-914e-610442b27886",
      paperFold: false,
      placeholderIcon: "movie",
      srcType: PreviewType.VIDEO,
      style: { borderColor: "transparent" },
      stylePreview: undefined,
      srcUrl:
        "/seecommerce/products/media-content/e97bcb6e-35c9-4653-914e-610442b27886/LQ?t=1",
    });
  });

  test("1 IMAGE placeholder", () => {
    const item = {
      id: "E20984690630549F9999",
      version: 1,
      [KEY_ROOT_ID]: "rootDocumentId",
      [KEY_CATALOG]: [],
      [KEY_READY]: [],
      [KEY_VIEW_STATUS]: [
        {
          viewName: "R",
          viewId: "R",
          status: ViewStatus.DEFAULT,
        },
        {
          viewName: "Z",
          viewId: "Z",
          status: ViewStatus.DEFAULT,
        },
        {
          viewName: "A",
          viewId: "A",
          status: ViewStatus.DEFAULT,
        },
      ],
      [KEY_VIEW_DATA]: [
        {
          category: Category.DEFAULT,
          viewName: "R",
          viewId: "R",
          viewType: ViewType.OPTIONAL,
          mediaType: MediaType.IMAGE_S,
          catalog: [],
        },
      ],
      [KEY_MEDIA]: [
        {
          view: "Z",
          filename: "E20984690630549F9999_Z.png",
          uploader: "moncler-internal",
          uploaded: 1565283265776,
          mimeType: "image/png",
          mediaType: MediaType.IMAGE_P,
          fileId: "7f5c83f6-70f8-457f-8185-d6a8f1a23abd",
        },
        {
          view: "A",
          filename: "E20984690630549F9999_D.jpg",
          uploader: "moncler-internal",
          uploaded: 1565283252152,
          mimeType: "image/jpeg",
          mediaType: MediaType.IMAGE_P,
          fileId: "e97bcb6e-35c9-4653-914e-610442b27886",
        },
        {
          view: "PIPPO",
          filename: "E20984690630549F9999_F.jpg",
          uploader: "moncler-internal",
          uploaded: 1565283259472,
          mimeType: "image/jpeg",
          mediaType: MediaType.IMAGE_P,
          fileId: "998ea8f4-d848-4cef-a06a-7bff48dd1b08",
        },
      ],
    };
    expect(
      decorateCellThumbnails({
        dispatch,
        item,
        users,
        m2ms,
        tenantCatalogs,
        attributeKey,
      })[0]
    ).toMatchObject({
      label: "",
      id: "R",
      paperFold: true,
      placeholderIcon: "photo",
      srcType: PreviewType.IMAGE,
      style: { borderColor: "transparent" },
      stylePreview: undefined,
      srcUrl: "",
    });
  });
});
