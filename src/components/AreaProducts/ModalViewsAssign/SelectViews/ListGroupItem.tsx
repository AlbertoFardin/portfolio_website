import * as React from "react";
import Btn from "../../../../componentsBase/Btn";
import Collapse from "@material-ui/core/Collapse";
import useStyles from "../useStylesListContainer";
import ListItem from "./ListItem";
import IView from "./IView";
import IViewGroup from "./IViewGroup";

interface IListGroupItem extends IViewGroup {
  selectedIds: string[];
  onSelect: (id: string, selected: boolean) => void;
}

const ListGroupItem = ({
  id,
  title,
  items,
  selectedIds,
  onSelect,
}: IListGroupItem) => {
  const [accordionOpen, setAccordionOpen] = React.useState(false);
  const classes = useStyles({});

  const selectedIdsSet = new Set(selectedIds);
  const selectedGroup = !items.find((v: IView) => !selectedIdsSet.has(v.id));
  const selectedItemsCount = items.reduce((acc: number, v: IView) => {
    if (selectedIdsSet.has(v.id)) acc += 1;
    return acc;
  }, 0);
  const toggleAccordion = React.useCallback(
    () => setAccordionOpen(!accordionOpen),
    [accordionOpen]
  );
  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <ListItem
          className={classes.listGroupItem}
          id={id}
          label={title}
          labelSub={`(${selectedItemsCount}/${items.length})`}
          selected={selectedGroup}
          onClick={onSelect}
        />
        <Btn
          icon={accordionOpen ? "keyboard_arrow_down" : "keyboard_arrow_up"}
          onClick={toggleAccordion}
        />
      </div>
      <div>
        <Collapse in={accordionOpen}>
          {items.map(({ id, view }) => (
            <ListItem
              className={classes.listItemNested}
              key={id}
              id={id}
              label={view}
              selected={selectedIdsSet.has(id)}
              onClick={onSelect}
            />
          ))}
        </Collapse>
      </div>
    </>
  );
};

export default ListGroupItem;
