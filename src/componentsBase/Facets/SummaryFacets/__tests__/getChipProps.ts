import getChipProps from "../getChipProps";
import IFacetType from "../../IFacetType";
import { emptyFn } from "../../../utils/common";

const colorTheme = "#f00";

describe("getChipProps", () => {
  test("DATEPICKER", () => {
    const facetDirty = {
      id: "facetDatepicker",
      label: "facetDatepicker",
      type: IFacetType.DATEPICKER,
      colorTheme,
      onChange: emptyFn,
      dateFormat: "DD/MM/YYYY",
      value: {
        startDate: 1585662109606,
        endDate: 1585662109606,
      },
    };
    const chips = [
      {
        id: "facetDatepicker_1585662109606,1585662109606",
        filter: facetDirty,
        value: facetDirty,
        label: "03/31/2020 - 03/31/2020",
      },
    ];
    expect(chips).toEqual(getChipProps([facetDirty]));
  });

  test("FACETTEXTAREA", () => {
    const facetDirty = {
      id: "facetTextarea",
      label: "facetTextarea",
      type: IFacetType.TEXTAREA,
      colorTheme,
      onChange: emptyFn,
      cartridgeSplit: false,
      value: "TEST",
    };
    const chips = [
      {
        id: "facetTextarea_TEST",
        filter: facetDirty,
        value: "TEST",
        label: "TEST",
      },
    ];
    expect(chips).toEqual(getChipProps([facetDirty]));
  });

  test("FACETTEXTAREA cartridgeSplit", () => {
    const facetDirty = {
      id: "facetTextarea",
      label: "facetTextarea",
      type: IFacetType.TEXTAREA,
      colorTheme,
      onChange: emptyFn,
      cartridgeSplit: true,
      value: ["t1", "t2", "t3"],
    };
    const chips = [
      {
        id: "facetTextarea_t1,t2,t3",
        filter: facetDirty,
        value: ["t1", "t2", "t3"],
        label: " t1 t2 t3",
      },
    ];
    expect(chips).toEqual(getChipProps([facetDirty]));
  });

  test("FACETBOOLEAN true", () => {
    const facetDirty = {
      id: "facetBoolean",
      label: "facetBoolean",
      type: IFacetType.BOOLEAN,
      colorTheme,
      onChange: emptyFn,
      value: true,
    };
    const chips = [
      {
        id: "facetBoolean_true",
        filter: facetDirty,
        value: true,
        label: "Yes",
      },
    ];
    expect(chips).toEqual(getChipProps([facetDirty]));
  });

  test("FACETBOOLEAN false", () => {
    const facetDirty = {
      id: "facetBoolean",
      label: "facetBoolean",
      type: IFacetType.BOOLEAN,
      colorTheme,
      onChange: emptyFn,
      value: false,
    };
    const chips = [
      {
        id: "facetBoolean_false",
        filter: facetDirty,
        value: false,
        label: "No",
      },
    ];
    expect(chips).toEqual(getChipProps([facetDirty]));
  });

  test("MULTISELECTION", () => {
    const facetDirty = {
      id: "facetMultiselect",
      label: "facetMultiselect",
      type: IFacetType.MULTISELECTION,
      value: [
        {
          id: "item1",
          label: "item1",
        },
        {
          id: "item2",
          label: "item2",
        },
        {
          id: "item3",
          label: "item3",
        },
      ],
      colorTheme,
      onChange: emptyFn,
    };
    const chips = [
      {
        id: "facetMultiselect_item1",
        filter: facetDirty,
        value: "item1",
        label: "item1",
      },
      {
        id: "facetMultiselect_item2",
        filter: facetDirty,
        value: "item2",
        label: "item2",
      },
      {
        id: "facetMultiselect_item3",
        filter: facetDirty,
        value: "item3",
        label: "item3",
      },
    ];
    expect(chips).toEqual(getChipProps([facetDirty]));
  });

  test("SELECTION", () => {
    const facetDirty = {
      id: "facetSelect",
      label: "facetSelect",
      type: IFacetType.SELECTION,
      value: [
        {
          id: "item2",
          label: "item2",
        },
      ],
      colorTheme,
      onChange: emptyFn,
    };
    const chips = [
      {
        id: "facetSelect_item2",
        filter: facetDirty,
        value: "item2",
        label: "item2",
      },
    ];
    expect(chips).toEqual(getChipProps([facetDirty]));
  });

  test("PERCENTAGE", () => {
    const facetDirty = {
      id: "PERCENTAGE",
      label: "PERCENTAGE",
      type: IFacetType.PERCENTAGE,
      colorTheme,
      onChange: emptyFn,
      value: [25, 75],
    };
    const chips = [
      {
        id: "PERCENTAGE_25,75",
        filter: facetDirty,
        value: facetDirty,
        label: "25% - 75%",
      },
    ];
    expect(chips).toEqual(getChipProps([facetDirty]));
  });
});
