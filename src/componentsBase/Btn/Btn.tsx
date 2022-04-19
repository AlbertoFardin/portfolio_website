import Icon from "@material-ui/core/Icon";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import classnames from "classnames";
import Tooltip from "../Tooltip";
import useStyles from "./useStyles";
import IBtn from "./IBtn";
import InputFile from "../InputFile";
import Avatar from "@material-ui/core/Avatar";
import ActionsMenu from "../ActionsMenu";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { emptyFn } from "../utils/common";

enum ACTION {
  SET_HOVER = "SET_HOVER",
  SET_NEED_TOOLTIP = "SET_NEED_TOOLTIP",
  SET_MENU_OPEN = "SET_MENU_OPEN",
  SET_ON_CLOSE = "SET_ON_CLOSE",
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION.SET_HOVER:
      return { ...state, hover: action.hover };
    case ACTION.SET_NEED_TOOLTIP:
      return {
        ...state,
        needTooltip: action.needTooltip,
      };
    case ACTION.SET_MENU_OPEN:
      return {
        ...state,
        menuOpen: action.menuOpen,
      };
    case ACTION.SET_ON_CLOSE:
      return {
        ...state,
        menuOpen: false,
        hover: false,
      };
    default:
      throw new Error();
  }
};

/**
 * **Btn** Buttons allow users to take actions, and make choices, with a single tap.
 * This component can show icon, label, menu, emoji, avatar.
 */
const Btn = ({
  variant = "light",
  className,
  style,
  tooltip,
  disabled,
  onClick,
  icon,
  iconClassName,
  iconStyle,
  label,
  labelPosition = "right",
  labelRequired,
  labelClassName,
  labelStyle,
  color,
  selected,
  upload,
  avatar,
  avatarClassName,
  avatarStyle,
  copyToClipboard,
  focusRipple = true,
  menu,
  emoji,
  emojiClassName,
  emojiStyle,
  onMouseEnter,
  onMouseLeave,
  tabIndex = 0,
}: IBtn) => {
  const buttonRef = React.useRef(null);
  const labelRef = React.useRef(null);
  const [state, dispatch] = React.useReducer(reducer, {
    hover: false,
    needTooltip: false,
    menuOpen: false,
  });
  const { hover, needTooltip, menuOpen } = state;
  const classes = useStyles({
    variant,
    color,
    hover,
    selected,
    emoji,
    icon,
    disabled,
    label,
    onClick,
    menu,
    menuOpen,
  });
  const cbOnMouseEnter = React.useCallback(
    (event) => {
      event.persist();
      dispatch({ type: ACTION.SET_HOVER, hover: true });
      if (onMouseEnter) onMouseEnter(event);
    },
    [onMouseEnter]
  );
  const cbOnMouseLeave = React.useCallback(
    (event) => {
      event.persist();
      dispatch({ type: ACTION.SET_HOVER, hover: false });
      if (onMouseLeave) onMouseLeave(event);
    },
    [onMouseLeave]
  );
  const cbOnClose = React.useCallback(() => {
    dispatch({ type: ACTION.SET_ON_CLOSE });
    setTimeout(menu.onClose || emptyFn, 200);
  }, [menu]);
  const cbOnClick = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!!menu) {
        dispatch({ type: ACTION.SET_MENU_OPEN, menuOpen: true });
      }
      if (!!onClick) onClick(event);
    },
    [menu, onClick]
  );
  const labelRequiredCmp = (
    <span className={classes.requiredSign} children={"*"} />
  );
  const labelCmp = (
    <Typography
      ref={labelRef}
      noWrap
      variant="body2"
      className={classnames({
        [classes.label]: true,
        [labelClassName]: !!labelClassName,
      })}
      style={labelStyle}
      children={
        <>
          {label}
          {!labelRequired ? null : labelRequiredCmp}
        </>
      }
    />
  );
  const emojiCmp = (
    <span
      role="img"
      aria-label={emoji}
      className={classnames({
        [classes.emoji]: true,
        [emojiClassName]: !!emojiClassName,
      })}
      style={emojiStyle}
      children={emoji}
    />
  );
  const iconCmp = (
    <Icon
      className={classnames({
        [classes.icon]: true,
        [iconClassName]: !!iconClassName,
      })}
      style={iconStyle}
      children={icon}
    />
  );
  const avatarCmp = (
    <Avatar
      className={classnames({
        [classes.avatar]: true,
        [avatarClassName]: !!avatarClassName,
      })}
      style={avatarStyle}
      src={avatar}
    />
  );

  const setHover = React.useCallback((hover) => {
    dispatch({ type: ACTION.SET_HOVER, hover });
  }, []);

  React.useEffect(() => {
    if (!!labelRef && !!labelRef.current) {
      const { offsetWidth, scrollWidth } = labelRef.current;
      const newValue = offsetWidth < scrollWidth;
      dispatch({ type: ACTION.SET_NEED_TOOLTIP, needTooltip: newValue });
    }
  }, [needTooltip]);

  return (
    <>
      <CopyToClipboard
        text={copyToClipboard}
        tabIndex={disabled ? -1 : tabIndex}
      >
        <ButtonBase
          ref={buttonRef}
          className={classnames({
            [classes.button]: true,
            [className]: !!className,
          })}
          style={style}
          focusRipple={focusRipple}
          disableRipple={disabled || !onClick}
          onClick={disabled ? undefined : cbOnClick}
          onMouseEnter={cbOnMouseEnter}
          onMouseLeave={cbOnMouseLeave}
        >
          <Tooltip title={tooltip || (needTooltip ? label : "")}>
            <div className={classes.buttonContent}>
              {!!label && labelPosition === "left" ? labelCmp : null}
              {!emoji ? null : emojiCmp}
              {!icon ? null : iconCmp}
              {!avatar ? null : avatarCmp}
              {!!label && labelPosition === "right" ? labelCmp : null}
              {!menu || !menu.icon ? null : (
                <Icon
                  className={classnames({
                    [classes.icon]: true,
                    [menu.iconClassName]: !!menu.iconClassName,
                  })}
                  style={menu.iconStyle}
                  children="arrow_drop_down"
                />
              )}
              {!upload ? null : (
                <InputFile
                  acceptFiles={upload.acceptFiles}
                  directory={upload.directory}
                  multiple={upload.multiple}
                  onChangeInput={upload.onChangeInput}
                  setHover={setHover}
                />
              )}
            </div>
          </Tooltip>
        </ButtonBase>
      </CopyToClipboard>
      {!menu ? null : (
        <ActionsMenu
          open={menuOpen}
          anchorEl={buttonRef.current}
          actions={menu.items}
          anchorOrigin={menu.anchorOrigin}
          transformOrigin={menu.transformOrigin}
          onClose={cbOnClose}
          title={menu.title}
        />
      )}
    </>
  );
};

export default Btn;
