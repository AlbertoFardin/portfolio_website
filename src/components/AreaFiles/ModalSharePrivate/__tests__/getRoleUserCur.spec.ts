import {
  CdnPublishedStatus,
  IFileDetail,
  SharedRole,
} from "../../../../interfaces";
import getRoleUserCur from "../getRoleUserCur";

const userId = "userId";
const data: IFileDetail = {
  id: "fileId",
  documentRepoId: "documentRepoId",
  name: "name",
  mimeType: "mimeType",
  cdnPublishedStatus: CdnPublishedStatus.NOT_PUBLISHED,
  publicshares: [],
  parentFolder: "parentFolder",
  owner: "owner",
  sharedWith: [],
  createdOn: "createdOn",
  createdBy: "createdBy",
  lastModified: "lastModified",
  path: [],
  tags: [],
};

describe("ModalSharePrivate - getRoleUserCur", () => {
  test("no assetdatas", () => {
    expect(undefined).toEqual(getRoleUserCur([], userId));
  });

  test("assetdatas without shares", () => {
    const datas = [
      {
        ...data,
        sharedWith: [],
      },
    ];
    expect(undefined).toEqual(getRoleUserCur(datas, userId));
  });

  test("assetdatas without userId shared", () => {
    const datas = [
      {
        ...data,
        sharedWith: [{ id: "userId2", role: SharedRole.EDITOR }],
      },
    ];
    expect(undefined).toEqual(getRoleUserCur(datas, userId));
  });

  test("assetdatas with userId shared", () => {
    const datas = [
      {
        ...data,
        sharedWith: [{ id: userId, role: SharedRole.EDITOR }],
      },
    ];
    expect(SharedRole.EDITOR).toEqual(getRoleUserCur(datas, userId));
  });

  test("assetdatas with userId shared in same role", () => {
    const datas = [
      {
        ...data,
        sharedWith: [{ id: userId, role: SharedRole.EDITOR }],
      },
      {
        ...data,
        sharedWith: [{ id: userId, role: SharedRole.EDITOR }],
      },
    ];
    expect(SharedRole.EDITOR).toEqual(getRoleUserCur(datas, userId));
  });

  test("assetdatas with userId shared in many roles", () => {
    const datas = [
      {
        ...data,
        sharedWith: [{ id: userId, role: SharedRole.EDITOR }],
      },
      {
        ...data,
        sharedWith: [{ id: userId, role: SharedRole.VIEWER }],
      },
    ];
    expect(SharedRole.VARIES).toEqual(getRoleUserCur(datas, userId));
  });

  test("assetdatas with userId as owner", () => {
    const datas = [
      {
        ...data,
        owner: userId,
      },
    ];
    expect(SharedRole.OWNER).toEqual(getRoleUserCur(datas, userId));
  });

  test("assetdatas with userId as owner and many shares", () => {
    const datas = [
      {
        ...data,
        owner: userId,
        sharedWith: [],
      },
      {
        ...data,
        sharedWith: [{ id: userId, role: SharedRole.VIEWER }],
      },
    ];
    expect(SharedRole.VARIES).toEqual(getRoleUserCur(datas, userId));
  });
});
