import * as React from "react";
import Divider from "@material-ui/core/Divider";
import useStyles from "../useStylesSelect";
import ListTitle from "../ListTitle";
import IMultiReadyCatalog from "../IMultiReadyCatalog";
import IMultiReadyView from "../IMultiReadyView";
import ListItem from "./ListItem";

interface IListContainer {
  catalogs: IMultiReadyCatalog[];
  views: IMultiReadyView[];
  onChange: (
    changedCatalogs: IMultiReadyCatalog[],
    newCatalogs: IMultiReadyCatalog[]
  ) => void;
}

const title = "Catalogs";
const ListContainer = ({ catalogs, views, onChange }: IListContainer) => {
  const classes = useStyles({});
  const allSelected = !catalogs.find(({ selected }) => !selected);
  const onSelect = React.useCallback(
    (id: string) => {
      let newItem;
      const newItems = catalogs.map((item) => {
        if (id === item.id) {
          newItem = {
            ...item,
            selected: !item.selected,
          };
          return newItem;
        }
        return item;
      });
      onChange([newItem], newItems);
    },
    [catalogs, onChange]
  );
  const onSelectAll = React.useCallback(() => {
    const newItems = catalogs.map((item) => ({
      ...item,
      selected: allSelected ? !!item.disabled : true,
    }));
    onChange(newItems, newItems);
  }, [catalogs, onChange, allSelected]);

  return (
    <div className={classes.listContainer}>
      <ListTitle
        icon="list_alt"
        title={title}
        subTitle="In which catalogs do you want to apply the Ready status?"
      />
      <ListItem
        id="all"
        label={title.toUpperCase()}
        selected={allSelected}
        onClick={onSelectAll}
        className={classes.listItemSelectAll}
      />
      <Divider />
      <div className={classes.listContainerScroll}>
        {catalogs.map(
          ({
            id,
            displayName,
            selected,
            disabled,
            viewsReady,
          }: IMultiReadyCatalog) => {
            const disabledReason = viewsReady.reduce((acc, vr) => {
              const view = views.find((v) => v.view === vr && v.catalog === id);
              if (!!view && view.selected) acc.push(vr);
              return acc;
            }, [] as string[]);
            return (
              <ListItem
                key={id}
                id={id}
                label={displayName}
                selected={selected}
                disabledReason={disabledReason}
                disabled={disabled}
                onClick={onSelect}
              />
            );
          }
        )}
      </div>
    </div>
  );
};

export default ListContainer;
