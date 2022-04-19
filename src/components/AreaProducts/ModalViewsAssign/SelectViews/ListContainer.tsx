import * as React from "react";
import useStyles from "../useStylesListContainer";
import ListTitle from "../ListTitle";
import getViews from "./getViews";
import IView from "./IView";
import IViewGroup from "./IViewGroup";
import ListGroupItem from "./ListGroupItem";
import ListItem from "./ListItem";
import { IProduct } from "../../../../interfaces";
import FieldSearch from "../../../FieldSearch";

interface IListContainer {
  selectedIds: string[];
  items: IProduct[];
  onChange: (newSelectedIds: string[]) => void;
}

const ListContainer = ({ items, selectedIds, onChange }: IListContainer) => {
  const classes = useStyles({});
  const views = getViews(items);
  const [searchValue, setSearchValue] = React.useState("");
  const viewsGroupCategory = views.reduce((acc, view: IView) => {
    const group = acc.find((g) => g.id === view.category);
    if (!group) {
      acc.push({
        id: view.category,
        title: view.category,
        items: [view],
      });
    } else {
      group.items.push(view);
    }
    return acc;
  }, [] as IViewGroup[]);
  const onSelect = React.useCallback(
    (id: string, selected: boolean) => {
      const newSelectedId = Array.from(selectedIds);
      const selecedGroup = viewsGroupCategory.find(
        (g: IViewGroup) => g.id === id
      );

      if (selecedGroup) {
        // select/deselect all view in the group
        selecedGroup.items.forEach((v) => {
          if (selected) {
            const indexToRemove = newSelectedId.findIndex((x) => x === v.id);
            if (indexToRemove !== -1) newSelectedId.splice(indexToRemove, 1);
          } else {
            const alreadySelected = !!newSelectedId.find((s) => s === v.id);
            if (!alreadySelected) newSelectedId.push(v.id);
          }
        });
      } else {
        // select/deselect a single view
        const indexToRemove = newSelectedId.findIndex((x) => x === id);
        if (indexToRemove !== -1) {
          newSelectedId.splice(indexToRemove, 1);
        } else {
          newSelectedId.push(id);
        }
      }

      onChange(newSelectedId);
    },
    [onChange, selectedIds, viewsGroupCategory]
  );

  const selectedIdsSet = new Set(selectedIds);

  return (
    <div className={classes.listContainer}>
      <ListTitle title="Select View" selectedIds={selectedIds} />
      <FieldSearch
        style={{ width: "-webkit-fill-available" }}
        placeholder="Search view..."
        value={searchValue}
        onChange={setSearchValue}
      />
      <div className={classes.listContainerScroll}>
        {searchValue
          ? views
              .filter(({ view }: IView) => {
                const valueItem = view.toLocaleLowerCase();
                const valueInput = searchValue.toLocaleLowerCase();
                return valueItem.indexOf(valueInput) !== -1;
              })
              .map(({ id, view }: IView) => (
                <ListItem
                  key={id}
                  id={id}
                  label={view}
                  selected={selectedIdsSet.has(id)}
                  onClick={onSelect}
                />
              ))
          : viewsGroupCategory.map(({ id, title, items }: IViewGroup) => (
              <ListGroupItem
                key={id}
                id={id}
                title={title}
                items={items}
                onSelect={onSelect}
                selectedIds={selectedIds}
              />
            ))}
      </div>
    </div>
  );
};

export default ListContainer;
