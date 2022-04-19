import { SharedRole } from "../../../../interfaces";
import getRoleUpdated from "../getRoleUpdated";

const userId = "userId";

describe("ModalSharePrivate - getRoleUpdated", () => {
  test("empty shares to update", () => {
    const roleId = SharedRole.VIEWER;
    const shares = [];
    expect(roleId).toEqual(getRoleUpdated(userId, roleId, shares));
  });

  test("update to Editor", () => {
    const roleId = SharedRole.VIEWER;
    const roleUp = SharedRole.EDITOR;
    const shares = [
      { id: "userid_2", role: SharedRole.TO_REMOVE_PRIVATE },
      { id: userId, role: roleUp },
    ];
    expect(roleUp).toEqual(getRoleUpdated(userId, roleId, shares));
  });

  test("update to Viewer", () => {
    const roleId = SharedRole.EDITOR;
    const roleUp = SharedRole.VIEWER;
    const shares = [
      { id: "userid_2", role: SharedRole.TO_REMOVE_PRIVATE },
      { id: userId, role: roleUp },
    ];
    expect(roleUp).toEqual(getRoleUpdated(userId, roleId, shares));
  });

  test("update to Owner", () => {
    const roleId = SharedRole.VIEWER;
    const roleUp = SharedRole.OWNER;
    const shares = [
      { id: "userid_2", role: SharedRole.TO_REMOVE_PRIVATE },
      { id: userId, role: roleUp },
    ];
    expect(roleUp).toEqual(getRoleUpdated(userId, roleId, shares));
  });

  test("update to Remove", () => {
    const roleId = SharedRole.VIEWER;
    const roleUp = SharedRole.TO_REMOVE_PRIVATE;
    const shares = [
      { id: "userid_2", role: SharedRole.TO_REMOVE_PRIVATE },
      { id: userId, role: roleUp },
    ];
    expect(roleUp).toEqual(getRoleUpdated(userId, roleId, shares));
  });
});
