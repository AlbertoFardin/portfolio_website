import TextField from "@material-ui/core/TextField";
import classnames from "classnames";
import * as React from "react";
import isEmpty from "lodash-es/isEmpty";
import Btn from "../../Btn";
import { emptyFn } from "../../utils/common";
import useDebounce from "../../utils/useDebounce";
import Chip from "../utils/Chip";
import { getLabels } from "../Label";
import useStyles from "../utils/useStyles";
import BtnMenu from "../utils/BtnMenu";
import { IMenuAction } from "./MenuActions";
import Menu from "./Menu";
import IFieldSelect from "./IFieldSelect";
import IFieldSelectItem from "./IFieldSelectItem";
import { PopoverOrigin } from "@material-ui/core/Popover";
import getChanges from "./getChanges";

const getChipLabelDefault = ({ label }: IFieldSelectItem) => label;
const getMenuIcon = (active: boolean, maxCount: number): string => {
  if (maxCount === 1) {
    return active ? "cancel" : "radio_button_unchecked";
  }
  return active ? "check_box" : "check_box_outline_blank";
};
const getMenuActions = (
  value: IFieldSelectItem[],
  options: IFieldSelectItem[],
  searchable: boolean,
  disabled: boolean,
  selectCountMax: number,
  onClick: (event: React.MouseEvent, id: string) => void,
  classes
): IMenuAction[] => {
  const array = searchable ? options : value;
  const selectCount = value.filter(({ selected }) => selected).length;
  const selectReachLimit = selectCount >= selectCountMax;
  return array.map((v: IFieldSelectItem) => {
    const valueItem = value.find(({ id }) => id === v.id);
    const active = !!valueItem && valueItem.selected;
    return {
      id: v.id,
      label: v.label,
      subLabel: v.subLabel,
      className: v.className,
      classNameLabel: v.classNameLabel,
      classNameSubLabel: v.classNameSubLabel,
      style: v.style,
      styleLabel: v.styleLabel,
      styleSubLabel: v.styleSubLabel,
      avatar: v.avatar,
      title: v.title,
      active,
      onClick,
      buttonsLeftEverVisible: true,
      buttonsLeft: [
        {
          id: "check",
          icon: getMenuIcon(active, selectCountMax),
          color: "#bbbbbb",
          style: { margin: 0 },
          iconClassName: active ? classes.menuIconChecked : classes.menuIcon,
        },
      ],
      disabled:
        active || selectCountMax === 1
          ? disabled
          : selectReachLimit || disabled,
      disableClose: true,
    };
  });
};
const popoverAnchorOriginDefault: PopoverOrigin = {
  vertical: "bottom",
  horizontal: "left",
};
const popoverTransformOriginDefault: PopoverOrigin = {
  vertical: "top",
  horizontal: "left",
};

const FieldSelect = ({
  className,
  classNameMenu,
  label,
  loading = false,
  getChipLabel = getChipLabelDefault,
  adornmentIcon,
  adornmentIconTooltip,
  adornmentIconColor,
  adornmentAvatar,
  adornmentAvatarTooltip,
  adornmentElement,
  itemsSelectedMaxLength = 999,
  itemsGroupedByTitle = false,
  itemsGroupedByTitleNoLabel = "Others",
  menu = [],
  menuDisabled = false,
  menuOnHover = true,
  menuOnClose = emptyFn,
  onClose = emptyFn,
  onChange = emptyFn,
  onSearch = emptyFn,
  options = [],
  placeholder = "Select...",
  popoverAnchorOrigin = popoverAnchorOriginDefault,
  popoverTransformOrigin = popoverTransformOriginDefault,
  readOnly = false,
  searchable = false,
  style,
  value = [],
  autoComplete,
}: IFieldSelect) => {
  const fieldRef = React.useRef(null);
  const [width, setWidth] = React.useState(0);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [inputHover, setInputHover] = React.useState(false);
  const [fieldFocus, setFieldFocus] = React.useState(false);
  const inputValueDebounced = useDebounce(inputValue, 500);

  const itemsSelected = value.filter((x: IFieldSelectItem) => x.selected);
  const itemsMaxLength = itemsSelected.length >= itemsSelectedMaxLength;
  const fieldWidth = fieldRef.current ? fieldRef.current.clientWidth : 1;
  const classes = useStyles({
    width,
    inputHide:
      !!adornmentElement ||
      itemsMaxLength ||
      (readOnly && !isEmpty(itemsSelected)),
    readOnly,
    hasIcon: !!adornmentIcon,
    hasAvatar: !!adornmentAvatar,
    hasMenu: !adornmentElement && !readOnly,
  });

  const cbOnEnter = React.useCallback(() => {
    setInputHover(true);
  }, []);
  const cbOnLeave = React.useCallback(() => {
    setInputHover(false);
    menuOnClose();
  }, [menuOnClose]);
  const cbOnFieldClick = React.useCallback(() => {
    if (!readOnly) {
      setFieldFocus(true);
      setMenuOpen(true);
    }
  }, [readOnly]);
  const cbOnMenuSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    },
    []
  );
  const cbOnMenuClose = React.useCallback(() => {
    setMenuOpen(false);
    setFieldFocus(false);
    setInputValue("");
    onClose();
  }, [onClose]);
  const cbOnChipClick = React.useCallback(
    (id: string) => {
      const [newItem, newItems] = getChanges({
        id,
        value,
        options,
        searchable,
        itemsSelectedMaxLength,
      });
      onChange(
        newItem,
        !searchable ? newItems : newItems.filter(({ selected }) => selected)
      );
    },
    [itemsSelectedMaxLength, onChange, options, searchable, value]
  );
  const cbOnActionClick = React.useCallback(
    (event: React.MouseEvent, id: string) => {
      const [newItem, newItems] = getChanges({
        id,
        value,
        options,
        searchable,
        itemsSelectedMaxLength,
      });
      onChange(newItem, newItems);

      const selectedCount = newItems.filter(({ selected }) => selected).length;
      const reachLimit = selectedCount >= itemsSelectedMaxLength;
      if (reachLimit) {
        setFieldFocus(false);
        setMenuOpen(false);
      }
    },
    [itemsSelectedMaxLength, onChange, options, searchable, value]
  );
  const menuActions = getMenuActions(
    value,
    options,
    searchable,
    loading,
    itemsSelectedMaxLength,
    cbOnActionClick,
    classes
  );
  const endAdornmentDefault = readOnly ? null : (
    <Btn
      icon="arrow_drop_down"
      onClick={cbOnFieldClick}
      style={{
        position: "absolute",
        bottom: 5,
        right: 5,
        margin: 0,
      }}
    />
  );

  React.useEffect(() => {
    if (searchable && inputValueDebounced) {
      setMenuOpen(true);
    }
  }, [searchable, inputValueDebounced]);

  React.useEffect(() => {
    setWidth(fieldWidth);
  }, [fieldWidth]);

  React.useEffect(() => {
    if (searchable && fieldFocus) {
      onSearch(inputValueDebounced);
      setFieldFocus(true);
    }
  }, [fieldFocus, inputValueDebounced, onSearch, searchable]);

  return (
    <>
      <TextField
        ref={fieldRef}
        className={classnames({
          [classes.field]: true,
          [className]: !!className,
        })}
        style={style}
        variant="outlined"
        autoComplete={autoComplete}
        InputProps={{
          className: classes.input,
          startAdornment: (
            <>
              {getLabels(label, readOnly)}
              {!adornmentIcon ? null : (
                <Btn
                  disabled
                  className={classes.adornmentIcon}
                  icon={adornmentIcon}
                  iconStyle={{ color: adornmentIconColor }}
                  tooltip={adornmentIconTooltip}
                />
              )}
              {!adornmentAvatar ? null : (
                <Btn
                  disabled
                  className={classes.adornmentAvatar}
                  avatar={adornmentAvatar}
                  tooltip={adornmentAvatarTooltip}
                />
              )}
              {!adornmentElement ? null : (
                <div
                  className={classes.adornmentElement}
                  children={adornmentElement}
                />
              )}
              {!!adornmentElement || isEmpty(itemsSelected) ? null : (
                <div className={classes.containerChips}>
                  {itemsSelected.map((v: IFieldSelectItem) => (
                    <Chip
                      key={v.id}
                      id={v.id}
                      label={getChipLabel(v)}
                      avatar={v.avatar}
                      readOnly={readOnly}
                      onRemove={cbOnChipClick}
                      {...v}
                    />
                  ))}
                </div>
              )}
            </>
          ),
          endAdornment: !!adornmentElement ? null : (
            <BtnMenu
              onClose={cbOnLeave}
              inputHover={inputHover}
              readOnly={readOnly}
              items={menu}
              disabled={menuDisabled}
              visibleOnHover={menuOnHover}
              renderDefault={endAdornmentDefault}
            />
          ),
          readOnly: true,
          placeholder:
            readOnly && isEmpty(itemsSelected) ? "No value" : placeholder,
          onClick: cbOnFieldClick,
          onMouseOver: cbOnEnter,
          onMouseLeave: cbOnLeave,
        }}
      />
      <Menu
        open={menuOpen && !readOnly}
        anchorEl={fieldRef.current}
        onSearch={cbOnMenuSearch}
        onClose={cbOnMenuClose}
        anchorOrigin={popoverAnchorOrigin}
        transformOrigin={popoverTransformOrigin}
        actions={menuActions}
        actionsGroupedByTitle={itemsGroupedByTitle}
        actionsGroupedByTitleNoLabel={itemsGroupedByTitleNoLabel}
        loading={loading}
        searchable={searchable}
        inputValue={inputValue}
        inputWidth={width}
        className={classNameMenu}
      />
    </>
  );
};

export default FieldSelect;
