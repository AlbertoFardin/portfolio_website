import escapeKeyEs from "../escapeKeyEs";

describe("escapeKeyEs", () => {
  test("test entity key", () => {
    const key = "product://?made_in_italy.(boolean).(EMEA).(es)";
    const keyEscaped =
      "product\\:\\/\\/\\?made_in_italy.\\(boolean\\).\\(EMEA\\).\\(es\\)";
    expect(keyEscaped).toEqual(escapeKeyEs(key));
  });

  test("escape: + - = &&", () => {
    const key = "a+a-a=a&&a";
    const keyEscaped = "a\\+a\\-a\\=a\\&\\&a";
    expect(keyEscaped).toEqual(escapeKeyEs(key));
  });

  test("escape: || > < !", () => {
    const key = "a||a>a<a!a";
    const keyEscaped = "a\\|\\|a\\>a\\<a\\!a";
    expect(keyEscaped).toEqual(escapeKeyEs(key));
  });

  test("escape: ( ) { } [ ]", () => {
    const key = "a(a)a{a}a[a]a";
    const keyEscaped = "a\\(a\\)a\\{a\\}a\\[a\\]a";
    expect(keyEscaped).toEqual(escapeKeyEs(key));
  });

  test('escape: ^ " ~ *', () => {
    const key = 'a^a"a~a*a';
    const keyEscaped = 'a\\^a\\"a\\~a\\*a';
    expect(keyEscaped).toEqual(escapeKeyEs(key));
  });

  test("escape: ? : \\ /", () => {
    const key = "a?a:a\\a/a";
    const keyEscaped = "a\\?a\\:a\\a\\/a";
    expect(keyEscaped).toEqual(escapeKeyEs(key));
  });
});
