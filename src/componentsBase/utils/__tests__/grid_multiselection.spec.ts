import { getListSorted, multiSelectCtrl, multiSelectShift } from "../grid";

describe("DynamicGrid utils: test selection function:", () => {
  const items = [
    { id: "Ananas" },
    { id: "ananas" },
    { id: "Apple" },
    { id: "apple" },
    { id: "Banana" },
    { id: "banana" },
    { id: "Kiwi" },
    { id: "kiwi" },
    { id: "Orange" },
    { id: "orange" },
  ];

  test("getListSorted -> sort item array", () => {
    const itemsSelected = [
      { id: "apple" },
      { id: "kiwi" },
      { id: "banana" },
      { id: "Ananas" },
      { id: "orange" },
    ];
    const expected = [
      { id: "Ananas" },
      { id: "apple" },
      { id: "banana" },
      { id: "kiwi" },
      { id: "orange" },
    ];
    const calculated = getListSorted(itemsSelected, items);
    expect(expected).toEqual(calculated);
  });

  test("multiSelectCtrl -> add item to itemsSelected", () => {
    const expected = [{ id: "banana" }, { id: "kiwi" }];
    const calculated = multiSelectCtrl({
      itemsSelected: [{ id: "kiwi" }],
      items,
      selected: false,
      data: { id: "banana" },
    });
    expect(expected).toEqual(calculated);
  });

  test("multiSelectCtrl -> remove item to itemsSelected", () => {
    const expected = [{ id: "kiwi" }];
    const calculated = multiSelectCtrl({
      itemsSelected: [{ id: "banana" }, { id: "kiwi" }],
      items,
      selected: true,
      data: { id: "banana" },
    });
    expect(expected).toEqual(calculated);
  });

  test("multiSelectShift -> select all, ascendente", () => {
    const expected = items;
    const calculated = multiSelectShift({
      indexItemSelected: 0,
      indexItemClick: 9,
      items,
      itemsSelected: [],
    });

    expect(expected).toEqual(calculated);
  });

  test("multiSelectShift -> select all, descendente", () => {
    const expected = items;
    const calculated = multiSelectShift({
      indexItemSelected: 9,
      indexItemClick: 0,
      items,
      itemsSelected: [],
    });

    expect(expected).toEqual(calculated);
  });

  test("multiSelectShift -> itemsSelected valorizzato, aggiungo items", () => {
    const expected = [
      { id: "ananas" },
      { id: "Apple" },
      { id: "apple" },
      { id: "kiwi" },
    ];
    const calculated = multiSelectShift({
      indexItemSelected: 1,
      indexItemClick: 3,
      items,
      itemsSelected: [{ id: "kiwi" }, { id: "apple" }],
    });

    expect(expected).toEqual(calculated);
  });
});
