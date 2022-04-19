import getActiveFilters from "../getActiveFilters";
import IFacetType from "../../IFacetType";
import { emptyFn } from "../../../utils/common";

const colorTheme = "#f00";

describe("getActiveFilters", () => {
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
    expect([facetDirty]).toEqual(getActiveFilters([facetDirty]));
  });

  test("FACETTEXTAREA", () => {
    const facetDirty = {
      id: "facetTextarea",
      label: "facetTextarea",
      type: IFacetType.TEXTAREA,
      colorTheme,
      onChange: emptyFn,
      value: "__tests__",
    };
    expect([facetDirty]).toEqual(getActiveFilters([facetDirty]));
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
    expect([facetDirty]).toEqual(getActiveFilters([facetDirty]));
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
    expect([facetDirty]).toEqual(getActiveFilters([facetDirty]));
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
    expect([facetDirty]).toEqual(getActiveFilters([facetDirty]));
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
    expect([facetDirty]).toEqual(getActiveFilters([facetDirty]));
  });

  test("DATEPICKER", () => {
    const facetDirty = {
      id: "facet_PERCENTAGE",
      label: "facet_PERCENTAGE",
      type: IFacetType.PERCENTAGE,
      colorTheme,
      onChange: emptyFn,
      value: [25, 75],
    };
    expect([facetDirty]).toEqual(getActiveFilters([facetDirty]));
  });

  test("all clean", () => {
    const facets = [
      {
        id: "facetDatepicker",
        label: "facetDatepicker",
        type: IFacetType.DATEPICKER,
        colorTheme,
        onChange: emptyFn,
        value: undefined,
      },
      {
        id: "facetTextarea",
        label: "facetTextarea",
        type: IFacetType.TEXTAREA,
        colorTheme,
        onChange: emptyFn,
        value: undefined,
      },
      {
        id: "facetBoolean",
        label: "facetBoolean",
        type: IFacetType.BOOLEAN,
        colorTheme,
        onChange: emptyFn,
        value: undefined,
      },
      {
        id: "facetMultiselect",
        label: "facetMultiselect",
        type: IFacetType.MULTISELECTION,
        value: [],
        colorTheme,
        onChange: emptyFn,
      },
      {
        id: "facetSelect",
        label: "facetSelect",
        type: IFacetType.SELECTION,
        items: [],
        colorTheme,
        onChange: emptyFn,
      },
      {
        id: "facet_PERCENTAGE",
        label: "facet_PERCENTAGE",
        type: IFacetType.PERCENTAGE,
        colorTheme,
        onChange: emptyFn,
        value: [0, 100],
      },
    ];
    expect([]).toEqual(getActiveFilters(facets));
  });
});
