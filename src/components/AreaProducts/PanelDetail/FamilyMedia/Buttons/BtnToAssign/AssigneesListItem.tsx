import * as React from "react";
import * as Colors from "../../../../../../componentsBase/style/Colors";
import TypographyEllipsis from "../../../../../../componentsBase/TypographyEllipsis";
import boldSearchText from "../../../../../../componentsBase/utils/boldSearchText";
import { colorTheme } from "../../../../../../constants";
import makeStyles from "@material-ui/core/styles/makeStyles";
import getUser from "../../../../../../utils/getUser";
import { ContextM2ms, ContextUsers } from "../../../../../contexts";
import ButtonBase from "@material-ui/core/ButtonBase";
import Icon from "@material-ui/core/Icon";
import Avatar from "@material-ui/core/Avatar";

interface IStyles {
  selected: boolean;
}
const useStyles = makeStyles({
  buttonbase: {
    color: colorTheme,
    width: "-webkit-fill-available",
    display: "flex",
    padding: 5,
    "border-radius": 5,
    margin: "0 3px",
  },
  icon: {
    "font-size": "16px !important",
    margin: "0 10px",
    color: ({ selected }: IStyles) => (selected ? colorTheme : Colors.Gray2),
  },
  label: {
    width: "-webkit-fill-available",
  },
  avatar: {
    position: "relative",
    display: "inline-block",
    "vertical-align": "middle",
    "margin-right": 5,
    "background-color": "#ddd",
    height: 24,
    width: 24,
  },
});

interface IAssigneesListItem {
  userId: string;
  inputSearch: string;
  selectedIds: string[];
  onClick: (userId: string) => void;
}

const AssigneesListItem = ({
  userId,
  inputSearch,
  selectedIds,
  onClick,
}: IAssigneesListItem) => {
  const selected = !!selectedIds.find((id) => id === userId);
  const classes = useStyles({ selected });

  const users = React.useContext(ContextUsers);
  const m2ms = React.useContext(ContextM2ms);

  const { name, picture } = getUser(userId, { users, m2ms });
  const cbOnClick = React.useCallback(() => {
    onClick(userId);
  }, [onClick, userId]);

  return (
    <ButtonBase className={classes.buttonbase} onClick={cbOnClick}>
      <Icon
        className={classes.icon}
        children={selected ? "check_box" : "check_box_outline_blank"}
      />
      <Avatar className={classes.avatar} src={picture} />
      <TypographyEllipsis
        className={classes.label}
        variant={selected ? "subtitle2" : "subtitle1"}
        children={boldSearchText(inputSearch, name)}
      />
    </ButtonBase>
  );
};

export default AssigneesListItem;
