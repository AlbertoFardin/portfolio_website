import {
  CdnPublishedStatus,
  IFileDetail,
  SharedRole,
} from "../../../../interfaces";
import { ORGANIZATION_ID } from "../../constants";
import getSharesPrivate from "../getSharesPrivate";

const ownerId = "ownerId";
const userId = "userId";
const data: IFileDetail = {
  id: "fileId",
  documentRepoId: "documentRepoId",
  name: "name",
  mimeType: "mimeType",
  cdnPublishedStatus: CdnPublishedStatus.NOT_PUBLISHED,
  publicshares: [],
  parentFolder: "parentFolder",
  owner: ownerId,
  sharedWith: [],
  createdOn: "createdOn",
  createdBy: "createdBy",
  lastModified: "lastModified",
  path: [],
  tags: [],
};

describe("ModalSharePrivate - getSharesPrivate", () => {
  test("empty", () => {
    expect([]).toEqual(getSharesPrivate([]));
  });

  test("shared with organization ", () => {
    const datas = [
      {
        ...data,
        sharedWith: [{ id: ORGANIZATION_ID, role: SharedRole.EDITOR }],
      },
    ];
    expect([{ id: ownerId, role: SharedRole.OWNER }]).toEqual(
      getSharesPrivate(datas)
    );
  });

  test("shared as Viewer ", () => {
    const datas = [
      {
        ...data,
        sharedWith: [{ id: userId, role: SharedRole.VIEWER }],
      },
    ];
    expect([
      { id: ownerId, role: SharedRole.OWNER },
      { id: userId, role: SharedRole.VIEWER },
    ]).toEqual(getSharesPrivate(datas));
  });

  test("shared many - case 1", () => {
    const datas = [
      {
        ...data,
        sharedWith: [{ id: userId, role: SharedRole.VIEWER }],
      },
      {
        ...data,
        sharedWith: [{ id: userId, role: SharedRole.EDITOR }],
      },
    ];
    expect([
      { id: ownerId, role: SharedRole.OWNER },
      { id: userId, role: SharedRole.VARIES },
    ]).toEqual(getSharesPrivate(datas));
  });

  test("shared many - case 2", () => {
    const datas = [
      {
        ...data,
        sharedWith: [{ id: userId, role: SharedRole.VIEWER }],
      },
      {
        ...data,
        owner: userId,
      },
    ];
    expect([
      { id: ownerId, role: SharedRole.OWNER },
      { id: userId, role: SharedRole.VARIES },
    ]).toEqual(getSharesPrivate(datas));
  });
});
