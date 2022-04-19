import isEmpty from "lodash-es/isEmpty";
import * as moment from "moment";
import IFacet from "../IFacet";
import IFacetType from "../IFacetType";
import {
  defaultValue as fPercentageDefaultValue,
  IFacetPercentage,
} from "../FacetPercentage";
import IChipProps from "./IChipProps";
import { IFacetMultiSelection } from "../FacetMultiSelection";
import { IFacetBoolean } from "../FacetBoolean";
import { IFacetDatePicker } from "../FacetDatePicker";
import { IFacetTextarea } from "../FacetTextarea";

const getChipId = (id: string, value: string) => `${id}_${value}`;

export default (filters: IFacet[], dateFormat = "MM/DD/YYYY"): IChipProps[] => {
  const filtersId = new Set([]);
  const chipsprops = [];
  filters.forEach((o) => {
    const { id, type } = o;
    if (filtersId.has(id)) console.error(`ERROR: filters with same id: ${id}`);

    filtersId.add(id);

    switch (type) {
      case IFacetType.DICTIONARY:
      case IFacetType.CATEGORY:
      case IFacetType.USERSELECTION:
      case IFacetType.SELECTION:
      case IFacetType.MULTISELECTION: {
        const f = { ...o } as IFacetMultiSelection;
        if (!isEmpty(f.value)) {
          f.value.forEach(({ id, label }) => {
            chipsprops.push({
              id: getChipId(f.id, id),
              filter: f,
              value: id,
              label: label || id,
            });
          });
        }
        break;
      }
      case IFacetType.BOOLEAN: {
        const f = { ...o } as IFacetBoolean;
        if (typeof f.value === "boolean") {
          chipsprops.push({
            id: getChipId(f.id, String(f.value)),
            filter: f,
            value: f.value,
            label: f.value ? "Yes" : "No",
          });
        }
        break;
      }
      case IFacetType.DATEPICKER: {
        const f = { ...o } as IFacetDatePicker;
        if (!isEmpty(f.value)) {
          const { startDate, endDate } = f.value;
          const selectOnlyADay = endDate - startDate === 86340000;
          if (!!startDate && !!endDate) {
            chipsprops.push({
              id: getChipId(f.id, String([startDate, endDate])),
              filter: f,
              value: f,
              label: selectOnlyADay
                ? moment(startDate).format(dateFormat)
                : `${moment(startDate).format(dateFormat)} - ${moment(
                    endDate
                  ).format(dateFormat)}`,
            });
          }
        }
        break;
      }
      case IFacetType.TEXTAREA: {
        const f = { ...o } as IFacetTextarea;
        let chipLabel = "";

        if (f.cartridgeSplit) {
          chipLabel = ((f.value || []) as string[]).reduce(
            (acc, cur) => (cur ? `${acc} ${cur}` : acc),
            ""
          );
        } else {
          chipLabel = f.value as string;
        }

        if (chipLabel) {
          chipsprops.push({
            id: getChipId(f.id, String(f.value)),
            filter: f,
            value: f.value,
            label: chipLabel,
          });
        }
        break;
      }
      case IFacetType.PERCENTAGE: {
        const f = { ...o } as IFacetPercentage;
        const [v1, v2] = f.value || fPercentageDefaultValue;
        const valued =
          v1 !== fPercentageDefaultValue[0] ||
          v2 !== fPercentageDefaultValue[1];
        if (valued) {
          chipsprops.push({
            id: getChipId(f.id, String([v1, v2])),
            filter: f,
            value: f,
            label: v1 === v2 ? `${v1}%` : `${v1}% - ${v2}%`,
          });
        }
        break;
      }
      default:
        break;
    }
  });
  return chipsprops;
};
