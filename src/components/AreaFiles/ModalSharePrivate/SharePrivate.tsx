import * as React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import * as Colors from "../../../componentsBase/style/Colors";
import hexToRgbA from "../../../componentsBase/utils/hexToRgbA";
import ActionsMenu from "../../../componentsBase/ActionsMenu";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import { IFileDetail, IShared, SharedRole } from "../../../interfaces";
import { ContextCurrentUser, ContextM2ms, ContextUsers } from "../../contexts";
import getRoleUpdated from "./getRoleUpdated";
import { getMenuLabel, getMenuIcon } from "./getMenuPrivate";
import Avatar from "@material-ui/core/Avatar";
import getUser from "../../../utils/getUser";

const backgroundDefault = "#ffffff";
const backgroundEnabled = "#f1f1f1";
const useStylesItem = makeStyles({
  flex1: {
    flex: 1,
  },
  item: {
    padding: "0 10px",
    "border-radius": 100,
    "background-color": backgroundDefault,
    transition: "all 250ms",
  },
  itemEditable: {
    cursor: "pointer",
    "&:hover": {
      "background-color": backgroundEnabled,
    },
  },
  itemSelected: {
    "background-color": backgroundEnabled,
  },
  itemUpdated: {
    "background-color": hexToRgbA(Colors.Blue, 0.1),
  },
  itemRemoved: {
    "background-color": hexToRgbA(Colors.Red, 0.1),
  },
  text: {
    "margin-left": 5,
  },
  role: {
    "border-radius": 100,
    padding: "5px 10px",
    opacity: 0.5,
    "background-color": "transparent",
  },
  roleEditable: {
    opacity: 1,
    "background-color": backgroundEnabled,
  },
  roleUpdated: {
    "background-color": Colors.Blue,
    color: "#fff",
  },
  roleRemoved: {
    "background-color": Colors.Red,
    color: "#fff",
  },
  avatar: {
    position: "relative",
    display: "inline-block",
    "vertical-align": "middle",
    "margin-right": 5,
    "background-color": "#ddd",
    height: 35,
    width: 35,
  },
});

interface ISharePrivate {
  userId: string;
  userRole: SharedRole;
  assetDatas: IFileDetail[];
  sharesToEdited: IShared[];
  onChange: (userId: string, role: SharedRole) => void;
}

const SharePrivate = ({
  userId,
  userRole,
  assetDatas,
  sharesToEdited,
  onChange,
}: ISharePrivate) => {
  const classes = useStylesItem({});

  const userProfile = React.useContext(ContextCurrentUser);
  const userIdCur = userProfile.id;
  const users = React.useContext(ContextUsers);
  const m2ms = React.useContext(ContextM2ms);
  const user = getUser(userId, { users, m2ms });

  const [menuOpen, setMenuOpen] = React.useState(false);
  const buttonRef = React.useRef(null);

  const y = userId === userIdCur ? " (you)" : "";
  const roleIdUpdated = getRoleUpdated(userId, userRole, sharesToEdited);
  const roleIsEdited = userRole !== roleIdUpdated;
  const roleIsRemove = roleIdUpdated === SharedRole.TO_REMOVE_PRIVATE;
  const ownersId = new Set(assetDatas.map(({ owner }) => owner));
  const canEdit =
    !ownersId.has(userId) && !assetDatas.find(({ canEdit }) => !canEdit);
  const onOpenMenu = React.useCallback(() => setMenuOpen(true), []);
  const onCloseMenu = React.useCallback(() => setMenuOpen(false), []);
  const onClick = React.useCallback(
    (event, btnId) => {
      onChange(userId, JSON.parse(btnId));
    },
    [userId, onChange]
  );

  return (
    <>
      <Toolbar
        ref={buttonRef}
        onClick={canEdit ? onOpenMenu : undefined}
        className={classnames({
          [classes.item]: true,
          [classes.itemEditable]: canEdit,
          [classes.itemSelected]: menuOpen,
          [classes.itemUpdated]: roleIsEdited && !roleIsRemove,
          [classes.itemRemoved]: roleIsEdited && roleIsRemove,
        })}
      >
        <Avatar className={classes.avatar} src={user.picture} />
        <Typography
          className={classes.text}
          variant="body2"
          children={user.name + y}
        />
        <div className={classes.flex1} />
        <Typography
          className={classnames({
            [classes.role]: true,
            [classes.roleEditable]: canEdit,
            [classes.roleUpdated]: roleIsEdited && !roleIsRemove,
            [classes.roleRemoved]: roleIsEdited && roleIsRemove,
          })}
          variant="body2"
          children={getMenuLabel(roleIdUpdated)}
        />
      </Toolbar>
      <ActionsMenu
        open={menuOpen}
        anchorEl={buttonRef.current}
        actions={[
          SharedRole.VIEWER,
          SharedRole.EDITOR,
          SharedRole.TO_REMOVE_PRIVATE,
        ].map((s) => ({
          id: JSON.stringify(s),
          label: getMenuLabel(s),
          icon: getMenuIcon(s),
          active: roleIdUpdated === s,
          onClick,
        }))}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClose={onCloseMenu}
      />
    </>
  );
};

export default SharePrivate;
