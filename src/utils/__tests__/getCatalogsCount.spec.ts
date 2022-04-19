import getCatalogsCount from "../getCatalogsCount";

describe("getCatalogsCount", () => {
  test("count", () => {
    const catalogs = [
      {
        id: "fruits",
        displayName: "name_fruits",
        languages: ["apple", "banana"],
        fallback: "apple",
      },
      {
        id: "tomato",
        displayName: "name_tomato",
        languages: ["apple", "potato"],
        fallback: "",
      },
      {
        id: "vegetables",
        displayName: "name_vegetables",
        languages: ["potato"],
        fallback: "apple",
      },
      {
        id: "ketchup",
        displayName: "name_ketchup",
        languages: [],
        fallback: "",
      },
    ];
    const { countCatalogs, countLanguages } = getCatalogsCount(catalogs);
    expect({
      countCatalogs: 4,
      countLanguages: 3,
    }).toEqual({ countCatalogs, countLanguages });
  });

  test("string", () => {
    const catalogs = [
      {
        id: "fruits",
        displayName: "name_fruits",
        languages: ["apple", "banana"],
        fallback: "apple",
      },
      {
        id: "tomato",
        displayName: "name_tomato",
        languages: ["apple", "potato"],
        fallback: "",
      },
      {
        id: "vegetables",
        displayName: "name_vegetables",
        languages: ["potato"],
        fallback: "apple",
      },
      {
        id: "ketchup",
        displayName: "name_ketchup",
        languages: [],
        fallback: "",
      },
    ];
    const { allCatalogs, allLanguages } = getCatalogsCount(catalogs);
    expect({
      allCatalogs: ["fruits", "tomato", "vegetables", "ketchup"],
      allLanguages: ["apple", "banana", "potato"],
    }).toEqual({ allCatalogs, allLanguages });
  });
});
