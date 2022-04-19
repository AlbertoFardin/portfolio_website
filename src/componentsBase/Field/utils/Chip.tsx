import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Icon from "@material-ui/core/Icon";
import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import classnames from "classnames";
import TypographyEllipsis from "../../TypographyEllipsis";
import { emptyFn } from "../../utils/common";

interface IStyle {
  avatar: string;
  readOnly: boolean;
}
const size = 23;
const backgroundColor = "#f1f1f1";
const useStyle = makeStyles({
  chip: {
    cursor: "default",
    height: size,
    position: "relative",
    display: "inline-flex",
    "align-items": "center",
    margin: 2,
    overflow: "hidden",
    "max-width": 250,
    "border-radius": 20,
    transition: "background-color 500ms",
    "vertical-align": "middle",
    "padding-right": 5,
    "padding-left": 0,
    "margin-right": 5,
    "&:hover": {
      "background-color": ({ readOnly }: IStyle) =>
        readOnly ? "transparent" : backgroundColor,
      "& $chipItemHideaway": {
        opacity: 0,
      },
      "& $chipBtnRemove": {
        opacity: 1,
        "& span": {
          color: "#666",
        },
      },
    },
  },
  chipItem: {
    transition: "all 250ms",
    height: size,
    "min-height": size,
    width: size,
    "min-width": size,
    "border-radius": 20,
  },
  chipItemHideaway: {
    opacity: 1,
  },
  chipBtnRemove: {
    opacity: ({ avatar }: IStyle) => (avatar ? 0 : 1),
    position: ({ avatar }: IStyle) => (avatar ? "absolute" : "relative"),
    "& span": {
      transition: "all 250ms",
      color: "#ccc",
      "font-size": "14px !important",
    },
  },
  label: {
    "margin-left": ({ avatar }: IStyle) => (avatar ? 3 : 0),
  },
});

interface IChip {
  id: string;
  label: string;
  avatar?: string;
  onRemove?: (id: string) => void;
  readOnly?: boolean;
  showRemoveIcon?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const Chip = ({
  id,
  label,
  avatar,
  readOnly = false,
  onRemove = emptyFn,
  showRemoveIcon = true,
  className,
  style,
}: IChip) => {
  const classes = useStyle({ avatar, readOnly });
  const onCbRemove = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      onRemove(id);
    },
    [id, onRemove]
  );
  return (
    <div className={classnames([classes.chip, className])} style={style}>
      {!avatar ? null : (
        <Avatar
          className={classnames({
            [classes.chipItem]: true,
            [classes.chipItemHideaway]: !readOnly,
          })}
          src={avatar}
        />
      )}
      {readOnly || !showRemoveIcon ? null : (
        <ButtonBase
          className={classnames([classes.chipItem, classes.chipBtnRemove])}
          onClick={onCbRemove}
          children={<Icon children="cancel" />}
        />
      )}
      <TypographyEllipsis
        className={classes.label}
        variant="body1"
        children={label}
      />
    </div>
  );
};

export default Chip;
