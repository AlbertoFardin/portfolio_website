import * as React from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import Icon from "@material-ui/core/Icon";
import useStyles from "../useStylesListItem";
import TypographyEllipsis from "../../../../componentsBase/TypographyEllipsis";

interface IListItem {
  id: string;
  avatar: JSX.Element | React.ReactNode;
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick: (id: string) => void;
}

const ListItem = ({
  id,
  avatar,
  label,
  selected = false,
  disabled = false,
  onClick,
}: IListItem) => {
  const classes = useStyles({
    disabled,
    selected,
  });
  const cbOnClick = React.useCallback(() => {
    if (!disabled) onClick(id);
  }, [disabled, id, onClick]);
  return (
    <ButtonBase
      disableRipple={disabled}
      className={classes.listItem}
      onClick={cbOnClick}
    >
      <Icon
        className={classes.icon}
        children={selected ? "check_box" : "check_box_outline_blank"}
      />
      {avatar}
      <TypographyEllipsis
        className={classes.label}
        variant="subtitle1"
        children={label}
      />
      <div className={classes.flex1} />
    </ButtonBase>
  );
};

export default ListItem;
