import { EditFieldType } from "../../../../interfaces";
import check from "./checkValueConsistency";

test("il tipo TextField e il valore stringa ritorni vero", () => {
  expect(check(EditFieldType.TextField, "")).toEqual(true);
});

test("il tipo TextField e il valore array di stringhe ritorni falso", () => {
  expect(check(EditFieldType.TextField, [])).toEqual(false);
});

test("il tipo TextAreaField e il valore stringa ritorni vero", () => {
  expect(check(EditFieldType.TextAreaField, "")).toEqual(true);
});
test("il tipo TextAreaField e il valore array di stringhe ritorni falso", () => {
  expect(check(EditFieldType.TextAreaField, [])).toEqual(false);
});

test("il tipo MultiStringField e il valore stringa ritorni falso", () => {
  expect(check(EditFieldType.MultiStringField, "")).toEqual(false);
});
test("il tipo MultiStringField e il valore array di stringhe ritorni vero", () => {
  expect(check(EditFieldType.MultiStringField, [])).toEqual(true);
});
