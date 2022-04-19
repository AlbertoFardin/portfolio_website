import { TYPE_FOLDER } from "../../../../constants";
import {
  CdnPublishedStatus,
  IFileDetail,
  SharedRole,
  IShared,
} from "../../../../interfaces";
import composeJsonToSave from "../composeJsonToSave";

const dataFile: IFileDetail = {
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
const dataFolder: IFileDetail = {
  id: "folderId",
  documentRepoId: "documentRepoId",
  name: "name",
  mimeType: TYPE_FOLDER,
  cdnPublishedStatus: CdnPublishedStatus.NOT_PUBLISHED,
  publicshares: [],
  parentFolder: "parentFolder",
  owner: "owner",
  sharedWith: [],
  createdOn: "createdOn",
  createdBy: "createdBy",
  lastModified: "lastModified",
  path: [],
};
const share: IShared = {
  id: "userId1",
  role: SharedRole.VIEWER,
};

describe("ModalSharePrivate - composeJsonToSave", () => {
  test("empty shares", () => {
    expect([]).toEqual(
      composeJsonToSave({
        assetDatas: [dataFile, dataFolder],
        shares: [],
      })
    );
  });

  test("empty assetDatas", () => {
    expect([]).toEqual(
      composeJsonToSave({
        assetDatas: [],
        shares: [share],
      })
    );
  });

  test("many assetdatas", () => {
    const expected = [
      {
        fileId: dataFile.id,
        isFolder: false,
        sharedWith: share.id,
        role: share.role,
      },
      {
        fileId: dataFolder.id,
        isFolder: true,
        sharedWith: share.id,
        role: share.role,
      },
    ];
    expect(expected).toEqual(
      composeJsonToSave({
        assetDatas: [dataFile, dataFolder],
        shares: [share],
      })
    );
  });

  test("many shares ", () => {
    const shares: IShared[] = [
      {
        id: "userId1",
        role: SharedRole.VIEWER,
      },
      {
        id: "userId2",
        role: SharedRole.EDITOR,
      },
      {
        id: "userId3",
        role: SharedRole.OWNER,
      },
      {
        id: "userId4",
        role: SharedRole.TO_REMOVE_PRIVATE,
      },
      {
        id: "userId5",
        role: SharedRole.TO_REMOVE_ORGANIZ,
      },
    ];
    const expected = [
      {
        fileId: dataFile.id,
        isFolder: false,
        sharedWith: "userId1",
        role: SharedRole.VIEWER,
      },
      {
        fileId: dataFile.id,
        isFolder: false,
        sharedWith: "userId2",
        role: SharedRole.EDITOR,
      },
      {
        fileId: dataFile.id,
        isFolder: false,
        sharedWith: "userId3",
        role: SharedRole.OWNER,
      },
      {
        fileId: dataFile.id,
        isFolder: false,
        sharedWith: "userId4",
        role: null,
      },
      {
        fileId: dataFile.id,
        isFolder: false,
        sharedWith: "userId5",
        role: null,
      },
    ];
    expect(expected).toEqual(
      composeJsonToSave({
        assetDatas: [dataFile],
        shares,
      })
    );
  });
});
