/* eslint-disable jsx-a11y/no-autofocus */
import Popover from "@material-ui/core/Popover";
import Divider from "@material-ui/core/Divider";
import Icon from "@material-ui/core/Icon";
import * as React from "react";
import isEmpty from "lodash-es/isEmpty";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { PopoverOrigin } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import CircularProgress from "@material-ui/core/CircularProgress";
import classnames from "classnames";
import { emptyFn } from "../../utils/common";
import MenuActions, { IMenuAction } from "./MenuActions";

interface IStyle {
  inputWidth: number;
}
const useStyles = makeStyles(({ palette }) => ({
  menu: {
    "min-width": ({ inputWidth }: IStyle) => inputWidth,
  },
  searchbox: {
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
  },
  searchboxIcon: {
    color: "#bbb",
    margin: "0 6px 0 18px",
    "font-size": "20px !important",
  },
  searchboxInput: {
    padding: "5px 10px 5px 0",
  },
  searchboxSpinner: {
    margin: "0 8px 0 18px",
    color: palette.primary.main,
  },
  divider: {
    margin: "0 20px",
  },
}));

interface IMenu {
  className?: string;
  anchorEl: Element | ((element: Element) => Element);
  anchorOrigin: PopoverOrigin;
  transformOrigin: PopoverOrigin;
  actions: IMenuAction[];
  actionsGroupedByTitle?: boolean;
  actionsGroupedByTitleNoLabel?: string;
  open: boolean;
  onSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClose?: () => void;
  loading: boolean;
  searchable?: boolean;
  inputValue?: string;
  inputWidth?: number;
}

const Menu = ({
  className,
  actions,
  actionsGroupedByTitle,
  actionsGroupedByTitleNoLabel,
  anchorEl,
  anchorOrigin,
  transformOrigin,
  open,
  onSearch = emptyFn,
  onClose = emptyFn,
  loading,
  searchable,
  inputValue = "",
  inputWidth = 150,
}: IMenu) => {
  const classes = useStyles({ inputWidth });
  const onContextMenu = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // fix double ActionsMenu open
      event.preventDefault();
      event.stopPropagation();
    },
    []
  );
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      anchorReference="anchorEl"
      elevation={2}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      PaperProps={{
        className: classnames({
          [classes.menu]: true,
          [className]: !!className,
        }),
      }}
      BackdropProps={{
        invisible: true,
        onClick: onClose,
        onContextMenu,
      }}
      disableAutoFocus
      disableEnforceFocus
    >
      {!searchable ? null : (
        <>
          <div className={classes.searchbox}>
            {loading ? (
              <CircularProgress
                size={18}
                className={classes.searchboxSpinner}
              />
            ) : (
              <Icon className={classes.searchboxIcon} children="search" />
            )}

            <InputBase
              className={classes.searchboxInput}
              autoFocus
              onChange={onSearch}
              placeholder="Search"
            />
          </div>
          {isEmpty(actions) ? null : <Divider className={classes.divider} />}
        </>
      )}
      <MenuActions
        actions={actions}
        actionsGroupedByTitle={actionsGroupedByTitle}
        actionsGroupedByTitleNoLabel={actionsGroupedByTitleNoLabel}
        inputValue={inputValue}
      />
    </Popover>
  );
};

export default Menu;
