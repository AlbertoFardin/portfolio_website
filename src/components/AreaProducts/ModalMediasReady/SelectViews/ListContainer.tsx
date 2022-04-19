import * as React from "react";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Placeholder from "../../../../componentsBase/Placeholder";
import useStyles from "../useStylesSelect";
import ListTitle from "../ListTitle";
import IMultiReadyView from "../IMultiReadyView";
import IMultiReadyCatalog from "../IMultiReadyCatalog";
import ListItem from "./ListItem";

interface IGroup {
  id: string;
  title: string;
  items: IMultiReadyView[];
}

interface IListContainer {
  catalogs: IMultiReadyCatalog[];
  views: IMultiReadyView[];
  onChange: (
    changedViews: IMultiReadyView[],
    newViews: IMultiReadyView[]
  ) => void;
}

const title = "Views";
const ListContainer = ({ catalogs, views, onChange }: IListContainer) => {
  const classes = useStyles({});
  const groups = catalogs.reduce((acc, catalog: IMultiReadyCatalog) => {
    const { id, selected, displayName } = catalog;
    if (selected) {
      acc.push({
        id,
        title: displayName,
        items: views.filter((v) => v.catalog === id),
      });
    }
    return acc;
  }, [] as IGroup[]);
  const groupsAllSelected = !groups.find(({ items }: IGroup) => {
    return !!items.find(({ selected }: IMultiReadyView) => !selected);
  });
  const onSelect = React.useCallback(
    (id: string) => {
      let newItem;
      const newItems = views.map((item) => {
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
    [views, onChange]
  );
  const onSelectAll = React.useCallback(() => {
    const newItems = views.map((item) => ({
      ...item,
      selected: !groupsAllSelected,
    }));
    onChange(newItems, newItems);
  }, [views, onChange, groupsAllSelected]);
  const placeholder = !catalogs.find(({ selected }) => selected);

  return (
    <div className={classes.listContainer}>
      <ListTitle
        icon="photo"
        title={title}
        subTitle="Among selected catalogs to which views do you want to apply the Ready status?"
      />
      {placeholder ? (
        <Placeholder label="Please select at least one catalog" />
      ) : (
        <>
          <ListItem
            id="all"
            label={title.toUpperCase()}
            selected={groupsAllSelected}
            onClick={onSelectAll}
            className={classes.listItemSelectAll}
          />
          <Divider />
          <div className={classes.listContainerScroll}>
            {groups.map(({ id, title, items }: IGroup) => (
              <React.Fragment key={id}>
                <Typography
                  className={classes.listContainerGroupTitle}
                  variant="subtitle2"
                  children={title}
                />
                {items.map(({ id, view, selected, category }) => (
                  <ListItem
                    key={id}
                    id={id}
                    label={view}
                    labelSub={category === "DEFAULT" ? "" : `(${category})`}
                    selected={selected}
                    onClick={onSelect}
                    className={classes.listItemNested}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ListContainer;
