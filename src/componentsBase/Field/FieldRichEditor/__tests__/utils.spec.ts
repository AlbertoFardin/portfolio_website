import {
  getHtmlStringFromContentState,
  getContentStateFromFragmentHtmlString,
} from "../utils";

test("verify idenpontecy getContentStateFromFragmentHtmlString & getHtmlStringFromContentState", () => {
  {
    const tagBr = "<p></p>";

    expect(
      getHtmlStringFromContentState(
        getContentStateFromFragmentHtmlString(tagBr)
      )
    ).toEqual(tagBr);
  }
  {
    const tagBr = "<p>ciao</p>";

    expect(
      getHtmlStringFromContentState(
        getContentStateFromFragmentHtmlString(tagBr)
      )
    ).toEqual(tagBr);
  }
  {
    const tagBr = "<p><br></p>";

    expect(
      getHtmlStringFromContentState(
        getContentStateFromFragmentHtmlString(tagBr)
      )
    ).toEqual("<p></p>");
  }
});
