import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import classnames from "classnames";
import isEmpty from "lodash-es/isEmpty";
import * as React from "react";
import Tooltip from "../Tooltip";
import { emptyFn } from "../utils/common";
import ListItemButton from "./ListItemButton";
import { CopyToClipboard } from "react-copy-to-clipboard";
import IListItem from "./IListItem";
import IListItemButton from "./IListItemButton";

const iconSize = 18;
const iconColor = "#42526e";

interface IStyles {
  hover: boolean;
}
const hoverColor = "#f1f1f1";
const useStyles = makeStyles({
  listitem: {
    "min-height": 35,
    padding: "0 15px",
    "background-color": ({ hover }: IStyles) => (hover ? hoverColor : "#fff"),
    "&:hover": {
      "background-color": hoverColor,
      "& $button": {
        visibility: "visible",
      },
    },
  },
  listitemDisabled: {
    opacity: 0.5,
  },
  listitemLeftElements: {
    padding: "0 25px 0 15px",
  },
  label: {
    "white-space": "nowrap",
    "max-width": 400,
  },
  labelMini: {
    color: "#aaaaaa",
  },
  labelEllipsis: {
    overflow: "hidden",
    "text-overflow": "ellipsis",
  },
  labelContainer: {
    width: "100%",
    display: "flex",
    "flex-direction": "row",
    flex: 1,
    "align-items": "center",
  },
  iconList: {
    "min-width": 30,
  },
  icon: {
    // font-size === Btn
    "font-size": `${iconSize}px !important`,
    color: iconColor,
  },
  emoji: {
    "min-width": 30,
    "font-size": iconSize,
  },
  avatar: {
    height: 25,
    width: 25,
    margin: "0 10px 0 5px",
  },
  button: {
    transition: "all 0ms !important",
    margin: "0 5px !important",
    visibility: ({ hover }: IStyles) => (hover ? "visible" : "hidden"),
  },
  buttonVisible: {
    visibility: "visible !important" as "visible",
  },
});

const WrdListItem = ({
  id,
  active = false,
  avatar,
  buttons = [],
  buttonsLeft = [],
  buttonsEverVisible = false,
  buttonsLeftEverVisible = false,
  className,
  classNameLabel,
  classNameSubLabel,
  classNameIcon,
  disabled = false,
  emoji,
  getAdditionalChildren = emptyFn,
  hover = false,
  icon,
  onClose = emptyFn,
  onClickStopPropagation = true,
  onClick = emptyFn,
  onMouseEnter = emptyFn,
  onMouseLeave = emptyFn,
  style,
  styleLabel,
  styleSubLabel,
  styleIcon,
  subLabel,
  label,
  copyToClipboard,
}: IListItem) => {
  const classes = useStyles({ hover });
  const labelEl = React.useRef(null);
  const [needTooltip, setNeedTooltip] = React.useState(false);
  const getListItemButtons = React.useCallback(
    (
      btns: IListItemButton[] = [],
      visible = false,
      additionalCmp: JSX.Element = null
    ) => {
      if (isEmpty(btns)) return null;
      return (
        <>
          {additionalCmp}
          {btns.map((b) => (
            <ListItemButton
              {...b}
              key={b.id}
              className={classnames({
                [classes.button]: true,
                [classes.buttonVisible]: visible,
              })}
              color={b.color}
              onClick={onClick}
              id={b.id}
              parentId={id}
              disabled={disabled}
            />
          ))}
        </>
      );
    },
    [classes.button, classes.buttonVisible, disabled, id, onClick]
  );
  const onCbClick = React.useCallback(
    (event) => {
      if (onClickStopPropagation) {
        event.preventDefault();
        event.stopPropagation();
      }
      if (!disabled) onClick(event, id, undefined);
    },
    [disabled, id, onClick, onClickStopPropagation]
  );

  React.useEffect(() => {
    if (
      !!labelEl &&
      labelEl.current &&
      !!label &&
      !needTooltip &&
      labelEl.current.offsetWidth < labelEl.current.scrollWidth
    ) {
      setNeedTooltip(true);
    }
  }, [label, needTooltip]);

  return (
    <CopyToClipboard text={copyToClipboard}>
      <ListItem
        button
        disableRipple={disabled}
        className={classnames({
          [classes.listitem]: true,
          [classes.listitemDisabled]: disabled,
          [classes.listitemLeftElements]: !!avatar || !isEmpty(buttonsLeft),
          [className]: !!className,
        })}
        style={style}
        onClick={onCbClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div ref={labelEl} className={classes.labelContainer}>
          {getListItemButtons(buttonsLeft, buttonsLeftEverVisible)}
          {!avatar ? null : <Avatar className={classes.avatar} src={avatar} />}
          {!icon ? null : (
            <ListItemIcon className={classes.iconList}>
              <Icon
                children={icon}
                className={classnames({
                  [classes.icon]: true,
                  [classNameIcon]: !!classNameIcon,
                })}
                style={styleIcon}
              />
            </ListItemIcon>
          )}
          {!emoji ? null : (
            <span
              role="img"
              aria-label={emoji}
              className={classes.emoji}
              children={emoji}
            />
          )}

          <Tooltip
            title={
              !needTooltip ? (
                ""
              ) : (
                <>
                  {label}
                  {!subLabel ? null : (
                    <>
                      <br />
                      -
                      <br />
                      {subLabel}
                    </>
                  )}
                </>
              )
            }
          >
            <div style={{ width: "100%" }}>
              {!label ? null : (
                <Typography
                  className={classnames({
                    [classes.label]: true,
                    [classes.labelEllipsis]: needTooltip,
                    [classNameLabel]: !!classNameLabel,
                  })}
                  style={styleLabel}
                  variant={active ? "subtitle2" : "subtitle1"}
                  children={label}
                />
              )}
              {!subLabel ? null : (
                <Typography
                  className={classnames({
                    [classes.label]: true,
                    [classes.labelMini]: true,
                    [classes.labelEllipsis]: needTooltip,
                    [classNameSubLabel]: !!classNameSubLabel,
                  })}
                  style={styleSubLabel}
                  variant="caption"
                  children={subLabel}
                />
              )}
            </div>
          </Tooltip>

          {getListItemButtons(
            buttons,
            buttonsEverVisible,
            <div style={{ flex: 1, minWidth: 20 }} />
          )}
          {getAdditionalChildren({
            id,
            active,
            onClick,
            onClose,
          })}
        </div>
      </ListItem>
    </CopyToClipboard>
  );
};

export default WrdListItem;
