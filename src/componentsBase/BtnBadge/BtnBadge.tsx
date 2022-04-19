import classnames from "classnames";
import * as React from "react";
import * as Colors from "../style/Colors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Btn, { IBtn } from "../Btn";

const badgeSize = 24;
const badgeBorder = 2;

interface IStyles {
  variant: "light" | "bold";
  color: string;
}
const useStyles = makeStyles({
  badge: {
    position: "absolute",
    zIndex: 2,
    margin: 0,
    padding: 0,
    "background-color": ({ variant, color }: IStyles) =>
      variant === "bold" ? color : "#fff",
    "border-width": badgeBorder,
    "border-style": "solid",
    "border-color": ({ color }: IStyles) => color,
    "min-width": badgeSize,
    "min-height": badgeSize,
  },
  badgeLabel: {
    color: ({ variant }: IStyles) =>
      variant === "bold" ? "#fff" : Colors.Gray1,
  },
  badgeIcon: {
    "font-size": "14px !important",
    margin: "auto",
    color: ({ variant, color }: IStyles) =>
      variant === "bold" ? "#fff" : color,
  },
  badgeAvatar: {
    height: `${badgeSize - badgeBorder * 2}px !important`,
    width: `${badgeSize - badgeBorder * 2}px !important`,
    margin: 0,
    "border-width": 0,
  },
});

const BtnBadge = (b: IBtn) => {
  const { variant, color } = b;
  const classes = useStyles({ variant, color });
  return (
    <Btn
      {...b}
      className={classnames({
        [classes.badge]: true,
        [b.className]: !!b.className,
      })}
      iconClassName={classnames({
        [classes.badgeIcon]: true,
        [b.iconClassName]: !!b.iconClassName,
      })}
      labelClassName={classnames({
        [classes.badgeLabel]: true,
        [b.labelClassName]: !!b.labelClassName,
      })}
      avatarClassName={classnames({
        [classes.badgeAvatar]: true,
        [b.avatarClassName]: !!b.avatarClassName,
      })}
    />
  );
};

export default BtnBadge;
