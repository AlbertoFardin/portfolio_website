import isFiltered from "../isFiltered";
import IFacetType from "../../IFacetType";
import { IFacetBoolean } from "../../FacetBoolean";
import { IFacetDatePicker } from "../../FacetDatePicker";
import { IFacetMultiSelection } from "../../FacetMultiSelection";
import { IFacetTextarea } from "../../FacetTextarea";

describe("isFiltered", () => {
  test("no filter", () => {
    expect(false).toEqual(
      isFiltered({
        filterFullText: "",
        filtersFaceted: [],
      })
    );
  });

  test("filter fulltext", () => {
    expect(true).toEqual(
      isFiltered({
        filterFullText: "filterFullText",
        filtersFaceted: [],
      })
    );
  });

  test("facet FACETBOOLEAN true", () => {
    const facet = {
      type: IFacetType.BOOLEAN,
      id: "facet",
      colorTheme: "#f00",
      onChange: () => null,
      value: true,
    } as IFacetBoolean;
    expect(true).toEqual(
      isFiltered({
        filterFullText: "",
        filtersFaceted: [facet],
      })
    );
  });

  test("facet FACETBOOLEAN false", () => {
    const facet = {
      type: IFacetType.BOOLEAN,
      id: "facet",
      colorTheme: "#f00",
      onChange: () => null,
      value: false,
    } as IFacetBoolean;
    expect(true).toEqual(
      isFiltered({
        filterFullText: "",
        filtersFaceted: [facet],
      })
    );
  });

  test("facet FACETTEXTAREA", () => {
    const facet = {
      type: IFacetType.TEXTAREA,
      id: "facet",
      colorTheme: "#f00",
      onChange: () => null,
      value: "value",
    } as IFacetTextarea;
    expect(true).toEqual(
      isFiltered({
        filterFullText: "",
        filtersFaceted: [facet],
      })
    );
  });

  test("facet DATEPICKER startDate", () => {
    const facet = {
      dateFormat: "DD/MM/YYYY",
      type: IFacetType.DATEPICKER,
      id: "facet",
      colorTheme: "#f00",
      onChange: () => null,
      value: {
        startDate: 1580293581371,
      },
    } as IFacetDatePicker;
    expect(true).toEqual(
      isFiltered({
        filterFullText: "",
        filtersFaceted: [facet],
      })
    );
  });

  test("facet DATEPICKER endDate", () => {
    const facet = {
      dateFormat: "DD/MM/YYYY",
      type: IFacetType.DATEPICKER,
      id: "facet",
      colorTheme: "#f00",
      onChange: () => null,
      value: {
        endDate: 1580293581371,
      },
    } as IFacetDatePicker;
    expect(true).toEqual(
      isFiltered({
        filterFullText: "",
        filtersFaceted: [facet],
      })
    );
  });

  test("facet MULTISELECTION", () => {
    const facet = {
      type: IFacetType.MULTISELECTION,
      id: "facet",
      colorTheme: "#f00",
      onChange: () => null,
      value: [
        {
          label: "label",
          id: "value",
        },
      ],
    } as IFacetMultiSelection;
    expect(true).toEqual(
      isFiltered({
        filterFullText: "",
        filtersFaceted: [facet],
      })
    );
  });

  test("facet PERCENTAGE startDate", () => {
    const facet = {
      type: IFacetType.PERCENTAGE,
      id: "facet",
      colorTheme: "#f00",
      onChange: () => null,
      value: [25, 75],
    };
    expect(true).toEqual(
      isFiltered({
        filterFullText: "",
        filtersFaceted: [facet],
      })
    );
  });
});
