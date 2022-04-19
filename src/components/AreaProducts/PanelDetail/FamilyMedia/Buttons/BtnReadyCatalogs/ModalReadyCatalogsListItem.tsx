import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import * as React from "react";
import { emptyFn } from "../../../../../../componentsBase/utils/common";
import Tooltip from "../../../../../../componentsBase/Tooltip";
import TypographyEllipsis from "../../../../../../componentsBase/TypographyEllipsis";

export enum ListItemIconType {
  SELECT = "SELECT",
  REMOVE = "REMOVE",
}
const IconProps = {
  [ListItemIconType.REMOVE]: {
    iconColor: "#d90b0b",
    iconCheck: "remove_circle",
    iconUncheck: "remove_circle_outline",
  },
  [ListItemIconType.SELECT]: {
    iconColor: "#48b784",
    iconCheck: "check_box",
    iconUncheck: "check_box_outline_blank",
  },
};

interface IStyles {
  selected: boolean;
  readOnly: boolean;
  iconColor: string;
}
const useStyles = makeStyles({
  modalReadyCatalogsListItem: {
    display: "flex",
    "flex-direction": "row",
    "justify-content": "start",
    "align-items": "center",
    margin: 0,
    padding: "2px 5px",
    "border-radius": 5,
    outline: "none",
    cursor: ({ readOnly }: IStyles) => (readOnly ? "default" : "auto"),
    "min-width": 220,
    color: ({ iconColor }: IStyles) => iconColor,
  },
  icon: {
    "font-size": "16px !important",
    "margin-right": 5,
    color: ({ selected, iconColor }: IStyles) =>
      selected ? iconColor : "#CBCBCB",
  },
  readOnly: {
    opacity: 0.4,
  },
  date: {
    "font-size": 12,
    color: "#1A1A1A",
  },
  flex1: {
    flex: 1,
  },
  cantDeselect: {
    "font-style": "italic",
    color: "#CBCBCB",
  },
});

interface IModalReadyCatalogsListItem {
  type: ListItemIconType;
  id: string;
  label: string;
  labelDate?: string;
  readOnly?: boolean;
  selected?: boolean;
  onClick: (id: string, selected: boolean) => void;
}

const ModalReadyCatalogsListItem = ({
  type,
  id,
  label,
  labelDate = "",
  readOnly = false,
  selected = false,
  onClick = emptyFn,
}: IModalReadyCatalogsListItem) => {
  const { iconCheck, iconUncheck, iconColor } = IconProps[type];
  const classes = useStyles({
    readOnly,
    selected,
    iconColor,
  });
  const cbOnClick = React.useCallback(() => {
    if (!readOnly) onClick(id, selected);
  }, [id, onClick, readOnly, selected]);

  return (
    <ButtonBase
      disableRipple={readOnly}
      className={classes.modalReadyCatalogsListItem}
      onClick={cbOnClick}
    >
      <Icon
        className={classnames({
          [classes.icon]: true,
          [classes.readOnly]: readOnly,
        })}
        children={selected ? iconCheck : iconUncheck}
      />
      <TypographyEllipsis
        className={classnames({
          [classes.readOnly]: readOnly,
        })}
        style={{ marginRight: 10 }}
        variant="body1"
        children={label}
      />
      <div className={classes.flex1} />
      <Typography className={classes.date} children={labelDate} />
      {!readOnly ? null : (
        <Tooltip
          placement="left"
          title={
            "You can't deselect this Catalog because another image is set Ready for this Catalog." +
            " For each view only one image can be set Ready"
          }
        >
          <Typography
            variant="body1"
            className={classes.cantDeselect}
            children="Can't deselect"
          />
        </Tooltip>
      )}
    </ButtonBase>
  );
};

export default ModalReadyCatalogsListItem;
