import { readQueryString } from "./loginUtils";

test("readQueryString", async () => {
  const location = {
    search:
      "?email=alberto.fardin@warda.it&code=#UtkgAg8>&username=albertofardin&groupId=DEMO",
  };
  const expected = {
    email: "alberto.fardin@warda.it",
    code: "#UtkgAg8>",
    groupId: "DEMO",
  };
  expect(readQueryString(location)).toEqual(expected);
});
