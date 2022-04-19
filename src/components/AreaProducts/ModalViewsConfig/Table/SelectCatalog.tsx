import * as React from "react";
import getSelectValue from "./getSelectValue";
import { KEY_CATALOG, KEY_VIEW_DATA } from "../../../../constants";
import Select, { ISelect } from "./Select";

const SelectCatalog = ({
  fieldKey,
  viewDraft,
  items,
  disabled,
  onChange,
}: ISelect) => {
  const catalogsCount = items.reduce((acc, item) => {
    const itemCatalog = item[KEY_CATALOG] || [];
    itemCatalog.forEach((c) => {
      acc[c] = (acc[c] || 0) + 1;
    });
    return acc;
  }, {});
  const catalogs: string[] = Object.keys(catalogsCount);
  const { value, placeholder } = getSelectValue({
    key: fieldKey,
    viewDraft,
    items,
  });
  const singleItem = items.length === 1;
  const onClick = React.useCallback(
    (event, catId) => {
      const newValue = !placeholder ? Array.from(value) : [];
      const indexToRemove = newValue.findIndex((v) => v === catId);
      if (indexToRemove === -1) {
        newValue.push(catId);
      } else {
        newValue.splice(indexToRemove, 1);
      }
      onChange(fieldKey, newValue);
    },
    [fieldKey, onChange, value, placeholder]
  );

  return (
    <Select
      fieldKey={fieldKey}
      viewDraft={viewDraft}
      variant={!disabled && placeholder ? "bold" : "light"}
      label={!placeholder ? value.join(", ") : value}
      disabled={disabled}
      tooltip={!placeholder && value.length > 2 ? value.join(", ") : ""}
      menu={catalogs.map((c) => {
        const viewDraftValue = viewDraft.data[fieldKey];
        const itemsHasCatalog = !items.find((item) => {
          const viewData = (item[KEY_VIEW_DATA] || []).find(
            (v) => v.viewName === viewDraft.id
          );
          return !viewData || !new Set(viewData.catalog).has(c);
        });
        const draftHasCatalog = new Set(viewDraftValue).has(c);

        // questo catalog è selezionato se è presente nel viewDraft
        // o se tutti gli items hanno tale catalog sulla medesima viewData
        const selected = !!viewDraftValue ? draftHasCatalog : itemsHasCatalog;

        return {
          id: c,
          onClick,
          disableClose: true,
          icon: selected ? "check_box" : "check_box_outline_blank",
          label: singleItem
            ? c
            : `${c} (${catalogsCount[c]}/${items.length} products)`,
        };
      })}
    />
  );
};

export default SelectCatalog;
