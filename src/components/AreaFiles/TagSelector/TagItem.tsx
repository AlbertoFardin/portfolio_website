import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import { ITag, TagColor } from "../../../interfaces";
import Btn from "../../../componentsBase/Btn";
import classnames from "classnames";
import { emptyFn } from "../../../componentsBase/utils/common";
import * as Colors from "../../../componentsBase/style/Colors";

interface IStyles {
  color: string;
}
const useStyles = makeStyles({
  tag: {
    "border-radius": 5,
    margin: "0 5px 5px 0",
    border: ({ color }: IStyles) => `1px solid ${color}`,
    "min-height": 0,
  },
  tagColor: {
    color: ({ color }: IStyles) => color,
  },
  icon: {
    "font-size": "14px !important",
  },
  label: {
    //
  },
});

interface ITagItem extends ITag {
  disabled?: boolean;
  selected?: boolean;
  icon?: string;
  tooltip?: string | React.ReactElement;
  onClick?: (tag: ITag) => void;
  className?: string;
  readOnly?: boolean;
}

const TagItem = ({
  id,
  disabled,
  selected,
  icon,
  type,
  position,
  name,
  tooltip,
  onClick = emptyFn,
  className,
  readOnly,
}: ITagItem) => {
  const color = disabled ? Colors.Gray2 : TagColor[type];
  const classes = useStyles({ color });
  const cbOnClick = React.useCallback(() => {
    onClick({
      id,
      name,
      position,
      type,
    });
  }, [onClick, id, name, position, type]);

  return (
    <Btn
      variant={selected ? "bold" : "light"}
      color={color}
      className={classnames({
        [classes.tag]: true,
        [className]: !!className,
      })}
      icon={readOnly ? undefined : icon}
      iconClassName={classnames({
        [classes.icon]: true,
        [classes.tagColor]: !selected,
      })}
      label={name}
      labelClassName={classnames({
        [classes.label]: true,
        [classes.tagColor]: !selected,
      })}
      onClick={readOnly ? undefined : cbOnClick}
      tooltip={readOnly ? undefined : tooltip}
    />
  );
};

export default TagItem;
