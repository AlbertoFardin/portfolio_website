import * as React from "react";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import Icon from "@material-ui/core/Icon";
import classnames from "classnames";
import useStyles from "../useStylesListItem";

interface IListItem {
  id: string;
  label: string;
  labelSub?: string;
  disabled?: boolean;
  selected?: boolean;
  onClick: (id: string, selected: boolean) => void;
  className?: string;
}

const ListItem = ({
  id,
  label,
  labelSub = "",
  disabled = false,
  selected = false,
  onClick,
  className,
}: IListItem) => {
  const classes = useStyles({
    disabled,
    selected,
  });
  const cbOnClick = React.useCallback(() => {
    if (!disabled) onClick(id, selected);
  }, [disabled, id, selected, onClick]);
  return (
    <ButtonBase
      disableRipple={disabled}
      className={classnames({
        [classes.listItem]: true,
        [className]: !!className,
      })}
      onClick={cbOnClick}
    >
      <Icon
        className={classes.icon}
        children={selected ? "check_box" : "check_box_outline_blank"}
      />
      <Typography
        className={classes.label}
        variant="subtitle1"
        children={label}
      />
      <Typography
        className={classes.labelSub}
        variant="subtitle1"
        children={labelSub}
      />
    </ButtonBase>
  );
};

export default ListItem;
