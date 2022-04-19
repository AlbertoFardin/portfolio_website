/* eslint-disable react/jsx-no-bind */
import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import RowItemsSet from "./RowItemsSet";
import { IItemsSet } from "../interfaces";

const useStyles = makeStyles({
  panelRowItemsSet: {
    "max-height": 225,
    "overflow-x": "hidden",
    "overflow-y": "overlay",
    position: "relative",
  },
});

interface IPanelRowItemsSet {
  itemsSets: IItemsSet[];
  onChange: (newItemsSets: IItemsSet[]) => void;
}

const PanelRowItemsSet = ({ itemsSets = [], onChange }: IPanelRowItemsSet) => {
  const classes = useStyles({});
  return (
    <div className={classes.panelRowItemsSet}>
      {itemsSets.map(
        (set: IItemsSet, i) => (
          <RowItemsSet
            key={set.id}
            id={set.id}
            isDefault={set.default}
            label={set.label}
            labelCount={set.items.length}
            selected={set.active}
            onSelect={() => {
              const newItemsSets = itemsSets.map((cc, ii) => ({
                ...cc,
                active: ii === i,
              }));
              onChange(newItemsSets);
            }}
            onRename={(newName: string) => {
              const newSet = { ...set, label: newName };
              const newItemsSets = itemsSets.map((el) =>
                el.id === set.id ? newSet : el
              );
              onChange(newItemsSets);
            }}
            onDelete={() => {
              let newItemsSets = Array.from(itemsSets);
              newItemsSets.splice(i, 1);
              newItemsSets = newItemsSets.map((cc, ii) => ({
                ...cc,
                active: ii === i - 1,
              }));
              onChange(newItemsSets);
            }}
            onDuplicate={() => {
              let newItemsSets = Array.from(itemsSets);
              const newSet = {
                ...set,
                id: uuidv4(),
                label: `Copied - ${set.label}`,
                default: false,
              };
              newItemsSets.splice(i + 1, 0, newSet);
              newItemsSets = newItemsSets.map((cc, ii) => ({
                ...cc,
                active: ii === i + 1,
              }));
              onChange(newItemsSets);
            }}
          />
        ),
        []
      )}
    </div>
  );
};

export default PanelRowItemsSet;
