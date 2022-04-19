import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import * as Colors from "../../../../componentsBase/style/Colors";
import classnames from "classnames";
import { colorTheme } from "../../../../constants";
import { AttributeFamily } from "../../../../interfaces";
import { HEADER_COLOR_BULK } from "../constants";
import { useHistory, useLocation } from "react-router-dom";
import getSearchString from "../../getSearchString";

const useStyles = makeStyles({
  btn: {
    "&:hover": {
      "background-color": Colors.Gray4,
    },
    "background-color": "transparent",
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    padding: "10px 20px",
    "border-radius": "0 50px 50px 0",
    color: colorTheme,
    width: "-webkit-fill-available",
    margin: "5px 20px 0 0",
  },
  btnIcon: {
    color: Colors.Gray2,
    margin: "0 10px 0 0px",
    "font-size": "18px !important",
  },
  btnLabel: {
    color: Colors.Gray1,
    "font-weight": "normal",
  },
  selectedBackground: {
    "background-color": `${HEADER_COLOR_BULK} !important`,
  },
  selectedColor: {
    color: colorTheme,
    "font-weight": "bold",
  },
  flex1: {
    flex: 1,
  },
});

interface IPanelFamilyBtn {
  family: AttributeFamily;
  selected: boolean;
  icon: string;
  label: string;
}

const PanelFamilyBtn = ({ family, selected, icon, label }: IPanelFamilyBtn) => {
  const classes = useStyles({});
  const history = useHistory();
  const searchString = useLocation().search;

  const onClick = React.useCallback(() => {
    history.push(getSearchString({ detailTabId: family }, searchString));
  }, [history, family, searchString]);

  return (
    <ButtonBase
      className={classnames({
        [classes.btn]: true,
        [classes.selectedBackground]: selected,
      })}
      onClick={onClick}
    >
      {!icon ? null : (
        <Icon
          className={classnames({
            [classes.btnIcon]: true,
            [classes.selectedColor]: selected,
          })}
          children={icon}
        />
      )}
      <Typography
        className={classnames({
          [classes.btnLabel]: true,
          [classes.selectedColor]: selected,
        })}
        variant="body1"
        children={label}
      />
      <div className={classes.flex1} />
    </ButtonBase>
  );
};

export default PanelFamilyBtn;
