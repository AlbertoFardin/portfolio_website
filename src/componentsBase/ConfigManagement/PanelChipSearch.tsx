import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import isEmpty from "lodash-es/isEmpty";
import Typography from "@material-ui/core/Typography";
import Chip from "./Chip";
import sortByLabel from "./sortByLabel";
import { IItem } from "./interfaces";

const useStyles = makeStyles({
  panelChipSearch: {
    padding: "5px 20px 15px 20px",
    "max-height": 270,
    overflow: "auto",
  },
  panelEmpty: {
    padding: 0,
  },
  emptyLabel: {
    margin: "auto",
    "text-align": "center",
    padding: 15,
    "font-style": "italic",
    color: "#ccc",
  },
});

interface IPanelChipSearch {
  items: IItem[];
  inputValue?: string;
  chipsIdSelected: string[];
  onClickChip: (chipId: string) => void;
}

const PanelChipSearch = ({
  items,
  inputValue = "",
  chipsIdSelected,
  onClickChip,
}: IPanelChipSearch) => {
  const classes = useStyles({});
  const chips = sortByLabel(items).filter(({ label }) => {
    return label.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase());
  });

  return (
    <div
      className={classnames({
        [classes.panelChipSearch]: true,
        [classes.panelEmpty]: isEmpty(chips),
      })}
    >
      {chips.map((c: IItem) => (
        <Chip
          key={c.id}
          id={c.id}
          label={c.label}
          tooltip={c.tooltip}
          selected={!!chipsIdSelected.find((id) => id === c.id)}
          onClick={onClickChip}
        />
      ))}
      {!isEmpty(chips) ? null : (
        <Typography
          className={classes.emptyLabel}
          variant="body1"
          children="No item found"
        />
      )}
    </div>
  );
};

export default PanelChipSearch;
