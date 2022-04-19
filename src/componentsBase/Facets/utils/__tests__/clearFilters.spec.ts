import clearFilters from "../clearFilters";
import IFacetType from "../../IFacetType";
import { emptyFn } from "../../../utils/common";

const colorTheme = "#f00";

describe("clearFilters", () => {
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
    const facetClean = {
      id: "facetDatepicker",
      label: "facetDatepicker",
      type: IFacetType.DATEPICKER,
      colorTheme,
      onChange: emptyFn,
      dateFormat: "DD/MM/YYYY",
      value: undefined,
    };
    expect(facetClean).toEqual(clearFilters([facetDirty])[0]);
  });

  test("FACETTEXTAREA", () => {
    const facetDirty = {
      id: "facetTextarea",
      label: "facetTextarea",
      type: IFacetType.TEXTAREA,
      colorTheme,
      onChange: emptyFn,
      cartridgeSplit: false,
      value: "__tests__",
    };
    const facetClean = {
      id: "facetTextarea",
      label: "facetTextarea",
      type: IFacetType.TEXTAREA,
      colorTheme,
      onChange: emptyFn,
      cartridgeSplit: false,
      value: undefined,
    };
    expect(facetClean).toEqual(clearFilters([facetDirty])[0]);
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
    const facetClean = {
      id: "facetTextarea",
      label: "facetTextarea",
      type: IFacetType.TEXTAREA,
      colorTheme,
      onChange: emptyFn,
      cartridgeSplit: true,
      value: undefined,
    };
    expect(facetClean).toEqual(clearFilters([facetDirty])[0]);
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
    const facetClean = {
      id: "facetBoolean",
      label: "facetBoolean",
      type: IFacetType.BOOLEAN,
      colorTheme,
      onChange: emptyFn,
      value: undefined,
    };
    expect(facetClean).toEqual(clearFilters([facetDirty])[0]);
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
    const facetClean = {
      id: "facetBoolean",
      label: "facetBoolean",
      type: IFacetType.BOOLEAN,
      colorTheme,
      onChange: emptyFn,
      value: undefined,
    };
    expect(facetClean).toEqual(clearFilters([facetDirty])[0]);
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
    const facetClean = {
      id: "facetMultiselect",
      label: "facetMultiselect",
      type: IFacetType.MULTISELECTION,
      value: undefined,
      colorTheme,
      onChange: emptyFn,
    };
    expect(facetClean).toEqual(clearFilters([facetDirty])[0]);
  });

  test("SELECTION", () => {
    const facetDirty = {
      id: "facetSelect",
      label: "facetSelect",
      type: IFacetType.SELECTION,
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
    const facetClean = {
      id: "facetSelect",
      label: "facetSelect",
      type: IFacetType.SELECTION,
      value: undefined,
      colorTheme,
      onChange: emptyFn,
    };
    expect(facetClean).toEqual(clearFilters([facetDirty])[0]);
  });

  test("PERCENTAGE", () => {
    const facetDirty = {
      id: "facet_PERCENTAGE",
      label: "facet_PERCENTAGE",
      type: IFacetType.PERCENTAGE,
      colorTheme,
      onChange: emptyFn,
      value: [25, 75],
    };
    const facetClean = {
      id: "facet_PERCENTAGE",
      label: "facet_PERCENTAGE",
      type: IFacetType.PERCENTAGE,
      colorTheme,
      onChange: emptyFn,
      value: undefined,
    };
    expect(facetClean).toEqual(clearFilters([facetDirty])[0]);
  });
});
