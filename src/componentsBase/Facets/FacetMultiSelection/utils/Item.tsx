import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TypographyEllipsis from "../../../TypographyEllipsis";
import boldSearchText from "../../../utils/boldSearchText";
import Checkbox, { Type } from "./ItemCheckbox";
import { IItem } from "../IFacetMultiSelection";
import { emptyFn } from "../../../utils/common";
import * as Colors from "../../../style/Colors";

const colorGray = "#999999";
const noKey = "N/A";

interface IStyles {
  id: string;
}
const useStyles = makeStyles({
  listitem: {
    height: 30,
    padding: "0 10px",
    "white-space": "nowrap",
    "border-radius": 5,
    flex: 1,
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
  },
  label: {
    color: ({ id }: IStyles) => (id === noKey ? colorGray : Colors.Gray1),
    "font-style": ({ id }: IStyles) => (id === noKey ? "italic" : "normal"),
  },
  labelCount: {
    color: colorGray,
    "margin-left": 5,
  },
});

interface IFacetMultiSelectionItem extends IItem {
  valueMax?: number;
  disabled?: boolean;
  selected?: boolean;
  labelSearch?: string;
  onClick?: (item: IItem) => void;
}

const FacetMultiSelectionItem = ({
  valueMax,
  disabled,
  selected,
  id,
  label,
  labelSearch = "",
  count,
  onClick = emptyFn,
}: IFacetMultiSelectionItem) => {
  const classes = useStyles({ id });
  const cbOnClick = React.useCallback(() => {
    onClick({ id, label });
  }, [id, label, onClick]);

  return (
    <ListItem
      button
      className={classes.listitem}
      disabled={disabled}
      onClick={cbOnClick}
    >
      <Checkbox
        selected={selected}
        type={valueMax === 1 ? Type.RADIO : Type.CHECK}
        visibility={!disabled}
      />
      <TypographyEllipsis
        variant="body1"
        className={classes.label}
        children={boldSearchText(labelSearch, label)}
      />
      {!Number.isInteger(count) ? null : (
        <Typography
          variant="body1"
          className={classes.labelCount}
          children={`(${count})`}
        />
      )}
      <div style={{ flex: 1 }} />
    </ListItem>
  );
};

export default FacetMultiSelectionItem;
