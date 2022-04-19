import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import * as React from "react";
import TypographyEllipsis from "../TypographyEllipsis";
import Btn from "../Btn";
import { IChip } from ".";

const colorLabel = "#42526e";
const colorBackground = "#eaeaea";

interface IStyles {
  selected: boolean;
}
const useStyle = makeStyles(({ palette }) => {
  const colorMain = palette.primary.main;
  const getColor = ({ selected }: IStyles) => (selected ? "#fff" : colorLabel);
  return {
    chip: {
      position: "relative",
      display: "inline-flex",
      "align-items": "center",
      margin: 2,
      overflow: "hidden",
      "max-width": 350,
      color: getColor,
      "background-color": ({ selected }: IStyles) =>
        selected ? colorMain : colorBackground,
      "border-radius": 50,
    },
    chipBase: {
      width: "100%",
      height: "100%",
      margin: "0 !important",
      "white-space": "nowrap",
      display: "inline-flex",
      "flex-direction": "row",
      "align-items": "center",
      "min-width": 10,
      padding: "2px 15px",
      color: getColor,
    },
    chipBaseWithBtnRemove: {
      "padding-left": 20,
    },
    chipBaseWithAvatar: {
      "padding-right": 0,
    },
    btnRemove: {
      margin: "auto",
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      "z-index": 1,
      "min-width": 1,
      "min-height": 1,
    },
    btnRemoveIcon: {
      color: getColor,
      "font-size": "12px !important",
    },
    avatar: {
      height: 25,
      width: 25,
      margin: "0 2px 0 8px",
    },
    label: {
      color: getColor,
    },
  };
});

const Chip = ({
  avatar,
  className,
  classNameLabel,
  label = "",
  onClick,
  onRemove,
  tooltip,
  tooltipAlwaysVisible = false,
  style,
  styleLabel,
  selected = true,
}: IChip) => {
  const classes = useStyle({ selected });
  const onCbRemove = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      onRemove(event);
    },
    [onRemove]
  );

  return (
    <div
      className={classnames({
        [classes.chip]: true,
        [className]: !!className,
      })}
      style={style}
    >
      {!onRemove ? null : (
        <Btn
          className={classes.btnRemove}
          icon="close"
          iconClassName={classes.btnRemoveIcon}
          onClick={onCbRemove}
        />
      )}
      <ButtonBase
        className={classnames({
          [classes.chipBase]: true,
          [classes.chipBaseWithBtnRemove]: !!onRemove,
          [classes.chipBaseWithAvatar]: !!avatar,
        })}
        disableRipple={!onClick}
        onClick={onClick}
      >
        <TypographyEllipsis
          variant={"body2"}
          style={styleLabel}
          className={classnames([classes.label, classNameLabel])}
          children={label}
          tooltip
          tooltipLabel={tooltip}
          tooltipAlwaysVisible={tooltipAlwaysVisible}
        />
        {!avatar ? null : <Avatar className={classes.avatar} src={avatar} />}
      </ButtonBase>
    </div>
  );
};

export default Chip;
