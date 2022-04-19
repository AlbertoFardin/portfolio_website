import ButtonBase from "@material-ui/core/ButtonBase";
import Icon from "@material-ui/core/Icon";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Collapse from "@material-ui/core/Collapse";
import TypographyEllipsis from "../TypographyEllipsis";
import Chip from "./Chip";
import { IItem } from "./interfaces";

const useStyles = makeStyles(({ palette }) => ({
  group: {
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
  },
  groupHeader: {
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    padding: "0 20px",
    height: 40,
    color: palette.primary.main,
    "border-bottom": "1px solid #eee",
    transition: "all 150ms",
    position: "sticky",
    top: 0,
    "z-index": 1,
    "background-color": "#fff",
  },
  groupHeaderIcon: {
    margin: "0 5px",
    width: 25,
    height: 22,
    "font-size": "20px !important",
    color: "#bbb",
  },
  groupContent: {
    padding: "10px 20px 20px",
    "overflow-y": "auto",
    transition: "all 150ms",
  },
}));

interface IChipGroup {
  chips: IItem[];
  chipsIdSelected: string[];
  onClickChip: (chipId: string) => void;
  title: string;
}

const ChipGroup = ({
  chips,
  chipsIdSelected,
  onClickChip,
  title,
}: IChipGroup) => {
  const classes = useStyles({});
  const [collapsed, setCollapsed] = React.useState(true);
  const onExpand = React.useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);

  return (
    <div className={classes.group}>
      <ButtonBase className={classes.groupHeader} onClick={onExpand}>
        <TypographyEllipsis variant="body2" children={title} />
        <div style={{ flex: 1 }} />
        <Icon
          className={classes.groupHeaderIcon}
          children={collapsed ? "keyboard_arrow_down" : "keyboard_arrow_up"}
        />
      </ButtonBase>
      <Collapse in={!collapsed}>
        <div className={classes.groupContent}>
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
        </div>
      </Collapse>
    </div>
  );
};

export default ChipGroup;
