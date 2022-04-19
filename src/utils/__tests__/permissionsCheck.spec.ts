import permissionsCheck from "../permissionsCheck";

const permissions = [
  {
    id: "key1",
    label: "key1_label",
  },
  {
    id: "key2",
    label: "key2_label",
  },
  {
    id: "key3",
    label: "key3_label",
  },
  {
    id: "key4",
    label: "key4_label",
  },
  {
    id: "key5",
    label: "key5_label",
  },
];

describe("permissionsCheck", () => {
  test("single check", () => {
    expect(true).toEqual(
      permissionsCheck({
        keys: ["key1"],
        permissions,
      })
    );
    expect(false).toEqual(
      permissionsCheck({
        keys: ["XXXX"],
        permissions,
      })
    );
  });

  test("multi check AND", () => {
    expect(true).toEqual(
      permissionsCheck({
        keys: ["key1", "key2"],
        permissions,
        condition: "AND",
      })
    );
    expect(false).toEqual(
      permissionsCheck({
        keys: ["key1", "XXXX"],
        permissions,
        condition: "AND",
      })
    );
  });

  test("multi check OR", () => {
    expect(true).toEqual(
      permissionsCheck({
        keys: ["key1", "key2"],
        permissions,
        condition: "OR",
      })
    );
    expect(true).toEqual(
      permissionsCheck({
        keys: ["key1", "XXXX"],
        permissions,
        condition: "OR",
      })
    );
  });
});
