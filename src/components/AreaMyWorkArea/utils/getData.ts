import { IColumnSc, IFilter } from "../../../interfaces";
import isSearchable from "../../PanelFilters/isSearchable";

export default ({
  columns,
  filters,
  activeColumnSet,
  activeFieldsPaneldetailsSet,
  activeFiltersSet,
}: {
  columns: IColumnSc[];
  filters: IFilter[];
  activeColumnSet;
  activeFieldsPaneldetailsSet;
  activeFiltersSet;
}) => {
  const keyAttributeFamilyAttributes = columns.reduce((acc, c) => {
    let vAttributeFamily = acc.find(
      (a) => a.attributeFamily === c.attributeFamily
    );
    if (!vAttributeFamily) {
      vAttributeFamily = {
        attributeFamily: c.attributeFamily,
        attributes: [],
      };
      acc.push(vAttributeFamily);
    }
    vAttributeFamily.attributes.push({
      id: c.id,
      label: c.label,
      level: c.groupId,
      filter: {
        enabled: !!activeFiltersSet.items.find((i) => i.id === c.id),
        dirty: false,
        available: isSearchable(filters.find((d) => d.id === c.id)),
      },
      column: {
        enabled: !!activeColumnSet.items.find((i) => i.id === c.id),
        dirty: false,
        available: true,
      },
      detailPanel: {
        enabled: !!activeFieldsPaneldetailsSet.items.find((i) => i.id === c.id),
        dirty: false,
        available: true,
      },
    });
    return acc;
  }, []);
  return keyAttributeFamilyAttributes;
};
