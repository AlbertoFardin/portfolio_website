import checkCatalogsDisabled from "../checkCatalogsDisabled";

describe("checkCatalogsDisabled.spec", () => {
  test("2 catalogs deselected + 0 views ready selected", () => {
    const catalogs = [
      {
        id: "y500",
        viewsReady: [],
        displayName: "y500",
        languages: ["en", "it", "sp"],
        fallback: "en",
        disabled: false,
        selected: false,
      },
      {
        id: "y501",
        viewsReady: [],
        displayName: "y501",
        languages: ["en", "it", "sp"],
        fallback: "en",
        disabled: false,
        selected: false,
      },
    ];
    const views = [
      {
        id: `y500_A`,
        view: "A",
        catalog: "y500",
        category: "category",
        selected: true,
      },
      {
        id: `y500_B`,
        view: "B",
        catalog: "y500",
        category: "category",
        selected: true,
      },
    ];
    const expected = catalogs;
    expect(expected).toEqual(checkCatalogsDisabled(catalogs, views));
  });

  test("2 catalogs deselected + 1 views ready selected", () => {
    const catalogs = [
      {
        id: "y500",
        viewsReady: ["A"],
        displayName: "y500",
        languages: ["en", "it", "sp"],
        fallback: "en",
        disabled: false,
        selected: false,
      },
      {
        id: "y501",
        viewsReady: [],
        displayName: "y501",
        languages: ["en", "it", "sp"],
        fallback: "en",
        disabled: false,
        selected: false,
      },
    ];
    const views = [
      {
        id: `y500_A`,
        view: "A",
        catalog: "y500",
        category: "category",
        selected: true,
      },
      {
        id: `y500_B`,
        view: "B",
        catalog: "y500",
        category: "category",
        selected: true,
      },
    ];
    const expected = [
      {
        id: "y500",
        viewsReady: ["A"],
        displayName: "y500",
        languages: ["en", "it", "sp"],
        fallback: "en",
        disabled: false,
        selected: false,
      },
      {
        id: "y501",
        viewsReady: [],
        displayName: "y501",
        languages: ["en", "it", "sp"],
        fallback: "en",
        disabled: false,
        selected: false,
      },
    ];
    expect(expected).toEqual(checkCatalogsDisabled(catalogs, views));
  });

  test("2 catalogs SELECTED + 2 views ready selected", () => {
    const catalogs = [
      {
        id: "y500",
        viewsReady: ["A"],
        displayName: "y500",
        languages: ["en", "it", "sp"],
        fallback: "en",
        disabled: false,
        selected: true,
      },
      {
        id: "y501",
        viewsReady: [],
        displayName: "y501",
        languages: ["en", "it", "sp"],
        fallback: "en",
        disabled: false,
        selected: true,
      },
    ];
    const views = [
      {
        id: `y500_A`,
        view: "A",
        catalog: "y500",
        category: "category",
        selected: true,
      },
      {
        id: `y500_B`,
        view: "B",
        catalog: "y500",
        category: "category",
        selected: true,
      },
    ];
    const expected = [
      {
        id: "y500",
        viewsReady: ["A"],
        displayName: "y500",
        languages: ["en", "it", "sp"],
        fallback: "en",
        disabled: true,
        selected: true,
      },
      {
        id: "y501",
        viewsReady: [],
        displayName: "y501",
        languages: ["en", "it", "sp"],
        fallback: "en",
        disabled: false,
        selected: true,
      },
    ];
    expect(expected).toEqual(checkCatalogsDisabled(catalogs, views));
  });
});
