import * as React from "react";
import * as Colors from "../style/Colors";
import { ITreeItem } from "./interfaces";
import Tooltip from "../Tooltip";
import TypographyEllipsis from "../TypographyEllipsis";
import Btn from "../Btn";
import { makeStyles } from "@material-ui/core/styles";
import getChildren from "./getChildren";
import Icon from "@material-ui/core/Icon";
import IconCollapse from "../IconCollapse";
import Collapse from "@material-ui/core/Collapse";
import hexToRgbA from "../utils/hexToRgbA";

interface IStyles {
  parent: string;
  selectable: boolean;
}
const useStyles = makeStyles(({ palette }) => ({
  treeItem: {
    position: "relative",
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
    overflow: "hidden",
    "margin-left": ({ parent, selectable }: IStyles) => {
      if (!parent) return 0;
      return selectable ? 23 : 13;
    },
  },
  btnClick: {
    color: palette.primary.main,
    "border-radius": 100,
    "padding-right": 15,
    margin: 0,
    display: "flex",
    "flex-direction": "row",
    "align-items": "stretch",
    "text-align": "start",
    "min-height": 30,
    cursor: "pointer",
    "background-color": "transparent",
    "&:hover": {
      "background-color": hexToRgbA(palette.primary.main, 0.1),
    },
  },
  btnCheck: {
    margin: 0,
  },
  btnChild: {
    "align-self": "center",
    margin: "0 0 0 10px",
    height: 16,
    width: 16,
  },
  label: {
    flex: 1,
  },
  icon: {
    color: Colors.Gray1,
    "font-size": "20px !important",
    margin: "0 5px",
    "align-self": "center",
    height: "auto",
  },
}));

interface ITreeItemCmp extends ITreeItem {
  items: ITreeItem[];
  selectable: boolean;
  expanded: string[];
  selected: string[];
  onClick: (id: string) => void;
  onCheck: (id: string) => void;
  onToggle: (id: string) => void;
}

const TreeItem = ({
  id,
  label,
  parent,
  icon,
  tooltip,
  hasChildren,
  items,
  selectable,
  selected,
  expanded,
  onClick,
  onCheck,
  onToggle,
}: ITreeItemCmp) => {
  const classes = useStyles({ parent, selectable });

  const isSelected = new Set(selected).has(id);
  const isExpanded = new Set(expanded).has(id);
  const children = getChildren(items, id);

  const cbOnClick = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      onClick(id);
    },
    [onClick, id]
  );
  const cbOnCheck = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      onCheck(id);
    },
    [onCheck, id]
  );
  const cbOnToggle = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      onToggle(id);
    },
    [onToggle, id]
  );

  return (
    <div className={classes.treeItem}>
      <Tooltip title={tooltip}>
        <div
          role="presentation"
          className={classes.btnClick}
          onClick={cbOnClick}
        >
          {hasChildren || !!children.length ? (
            <IconCollapse
              className={classes.btnChild}
              collapse={!isExpanded}
              onClick={cbOnToggle}
            />
          ) : (
            <div className={classes.btnChild} />
          )}
          {selectable ? (
            <Btn
              className={classes.btnCheck}
              icon={isSelected ? "check_box" : "check_box_outline_blank"}
              onClick={cbOnCheck}
            />
          ) : null}
          {icon ? <Icon className={classes.icon} children={icon} /> : null}
          <TypographyEllipsis
            className={classes.label}
            variant="body1"
            children={label}
          />
        </div>
      </Tooltip>
      <Collapse in={new Set(expanded).has(id)} mountOnEnter unmountOnExit>
        {children.map((c) => (
          <TreeItem
            key={c.id}
            {...c}
            items={items}
            selectable={selectable}
            expanded={expanded}
            selected={selected}
            onClick={onClick}
            onCheck={onCheck}
            onToggle={onToggle}
          />
        ))}
      </Collapse>
    </div>
  );
};

export default TreeItem;
