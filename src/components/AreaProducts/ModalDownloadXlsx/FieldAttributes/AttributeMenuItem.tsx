import * as React from "react";
import * as Colors from "../../../../componentsBase/style/Colors";
import ListItem from "@material-ui/core/ListItem";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import IAttributeMenuItem from "./IAttributeMenuItem";

interface IStyles {
  title: boolean;
  selected: boolean;
}
const useStyles = makeStyles({
  listitem: {
    padding: "8px 15px",
    "align-items": "center",
  },
  listitemIcon: {
    color: ({ selected }: IStyles) => (selected ? Colors.Purple : Colors.Gray2),
    "font-size": "17px !important",
    "margin-right": 10,
  },
  listitemLabel: {
    "max-width": 300,
    "white-space": "nowrap",
    "text-overflow": "ellipsis",
    overflow: "hidden",
    "font-weight": ({ title }: IStyles) => (title ? "bold" : "normal"),
  },
  flex1: {
    flex: 1,
  },
});

interface IAttributeMenuItemCmp extends IAttributeMenuItem {
  style?: React.CSSProperties;
  children?: JSX.Element | React.ReactNode;
}

const AttributeMenuItem = ({
  id,
  title,
  selected,
  icon,
  label,
  onClick,
  style,
  children,
}: IAttributeMenuItemCmp) => {
  const classes = useStyles({ title, selected });
  const onClickCb = React.useCallback(() => {
    if (!!icon) onClick(id);
  }, [icon, id, onClick]);

  return (
    <ListItem
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      button={!!onClick as any}
      className={classes.listitem}
      style={style}
      onClick={onClickCb}
    >
      {!icon ? null : <Icon className={classes.listitemIcon} children={icon} />}
      <Typography
        variant="body1"
        className={classes.listitemLabel}
        children={label}
      />
      <div className={classes.flex1} />
      {children}
    </ListItem>
  );
};

export default AttributeMenuItem;
