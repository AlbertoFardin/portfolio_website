import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import isEmpty from "lodash-es/isEmpty";
import sortByLabel from "./sortByLabel";
import ChipGroup from "./ChipGroup";
import { IItem, IItemGroup } from "./interfaces";

const useStyles = makeStyles({
  panelChipGroup: {
    flex: 1,
    "max-height": 308,
    "overflow-x": "hidden",
    "overflow-y": "auto",
  },
});

interface IPanelChipGroup {
  items: IItem[];
  itemsGroups: IItemGroup[];
  chipsIdSelected: string[];
  onClickChip: (chipId: string) => void;
}

const PanelChipGroup = ({
  items,
  itemsGroups,
  chipsIdSelected,
  onClickChip,
}: IPanelChipGroup) => {
  const classes = useStyles({});
  const groups = itemsGroups.reduce((acc, { id, label }: IItemGroup) => {
    const chips = sortByLabel(items.filter((c: IItem) => c.groupId === id));
    if (!isEmpty(chips)) acc.push({ id, label, chips });
    return acc;
  }, []);
  const chipsWithoutGroup = sortByLabel(
    items.filter(({ groupId }) => !groupId)
  );

  return (
    <div className={classes.panelChipGroup}>
      {groups.map(({ id, label, chips }) => (
        <ChipGroup
          key={id}
          chips={chips}
          chipsIdSelected={chipsIdSelected}
          onClickChip={onClickChip}
          title={label}
        />
      ))}
      {isEmpty(chipsWithoutGroup) ? null : (
        <ChipGroup
          chips={chipsWithoutGroup}
          chipsIdSelected={chipsIdSelected}
          onClickChip={onClickChip}
          title="Others"
        />
      )}
    </div>
  );
};

export default PanelChipGroup;
