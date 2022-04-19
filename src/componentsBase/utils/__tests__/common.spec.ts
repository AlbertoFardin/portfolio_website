import { getSignUrl } from "../common";

describe("test composition url", () => {
  test("test composition url with query const", () => {
    const url =
      "http://localhost:9000/g/calzedoniaEcommerceStagingArea/contents/P/" +
      "?auth-token=ce8c7361-b391-4c95-897b-360ce3a52061";
    const expectValue =
      "http://localhost:9000/g/calzedoniaEcommerceStagingArea/contents/P/" +
      "?auth-token=ce8c7361-b391-4c95-897b-360ce3a52061&contentType=jpg&filename=cartella";
    expect(expectValue).toEqual(getSignUrl(url, "cartella", "jpg"));
  });
});
