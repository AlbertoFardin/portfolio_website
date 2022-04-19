import {
  CdnPublishedStatus,
  IFileDetail,
  SharedRole,
} from "../../../../interfaces";
import { ORGANIZATION_ID } from "../../constants";
import getRoleOrganiz from "../getRoleOrganiz";

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

describe("ModalSharePrivate - getRoleOrganiz", () => {
  test("no assetdatas", () => {
    expect(SharedRole.TO_REMOVE_ORGANIZ).toEqual(getRoleOrganiz([]));
  });

  test("shared as EDITOR", () => {
    expect(SharedRole.EDITOR).toEqual(
      getRoleOrganiz([
        {
          ...data,
          sharedWith: [{ id: ORGANIZATION_ID, role: SharedRole.EDITOR }],
        },
      ])
    );
  });

  test("shared as VIEWER", () => {
    expect(SharedRole.VIEWER).toEqual(
      getRoleOrganiz([
        {
          ...data,
          sharedWith: [{ id: ORGANIZATION_ID, role: SharedRole.VIEWER }],
        },
      ])
    );
  });

  test("many assetdatas shared same role", () => {
    expect(SharedRole.VIEWER).toEqual(
      getRoleOrganiz([
        {
          ...data,
          sharedWith: [{ id: ORGANIZATION_ID, role: SharedRole.VIEWER }],
        },
        {
          ...data,
          sharedWith: [{ id: ORGANIZATION_ID, role: SharedRole.VIEWER }],
        },
      ])
    );
  });

  test("many assetdatas shared different role - case 1", () => {
    expect(SharedRole.VARIES).toEqual(
      getRoleOrganiz([
        {
          ...data,
          sharedWith: [{ id: ORGANIZATION_ID, role: SharedRole.VIEWER }],
        },
        {
          ...data,
          sharedWith: [{ id: ORGANIZATION_ID, role: SharedRole.EDITOR }],
        },
      ])
    );
  });

  test("many assetdatas shared different role - case 2", () => {
    expect(SharedRole.VARIES).toEqual(
      getRoleOrganiz([
        {
          ...data,
          sharedWith: [{ id: ORGANIZATION_ID, role: SharedRole.VIEWER }],
        },
        {
          ...data,
          sharedWith: [],
        },
      ])
    );
  });
});
