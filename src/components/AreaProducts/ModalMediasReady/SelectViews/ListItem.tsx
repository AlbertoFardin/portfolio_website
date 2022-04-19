import * as React from "react";
import classnames from "classnames";
import useStyles from "../useStylesSelect";
import ListCheckbox from "../ListCheckbox";

interface IListItem {
  id: string;
  label: string;
  labelSub?: string;
  selected: boolean;
  onClick: (id: string) => void;
  className?: string;
}

const ListItem = ({
  id,
  label,
  labelSub,
  selected,
  onClick,
  className = "",
}: IListItem) => {
  const classes = useStyles({});
  return (
    <div
      className={classnames({
        [classes.listItem]: true,
        [className]: !!className,
      })}
    >
      <ListCheckbox
        id={id}
        label={label}
        labelSub={labelSub}
        selected={selected}
        onClick={onClick}
      />
    </div>
  );
};

export default ListItem;
