import Icon from "@material-ui/core/Icon";
import classnames from "classnames";
import * as React from "react";
import Tooltip from "../../Tooltip";

interface IIconSort {
  classes;
  selected?: boolean;
  hidden?: boolean;
  icon: string;
  onClick: () => void;
}

const IconSort = ({
  classes,
  selected = false,
  hidden = false,
  icon,
  onClick,
}: IIconSort) => {
  if (hidden) return <div className={classes.iconSortHidden} />;

  return (
    <Tooltip title={selected ? "Remove Sorting" : ""}>
      <Icon
        className={classnames({
          [classes.iconSort]: true,
          [classes.colorTheme]: selected,
        })}
        onClick={onClick}
        children={icon}
      />
    </Tooltip>
  );
};

export default IconSort;
