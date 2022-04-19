import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import { IFileDetail, IShared, SharedRole } from "../../../interfaces";
import { ORGANIZATION_ID } from "../constants";
import BadgeSharedWith, { getLabel } from "../Content/BadgeSharedWith";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Btn from "../../../componentsBase/Btn";
import classnames from "classnames";
import * as Colors from "../../../componentsBase/style/Colors";
import hexToRgbA from "../../../componentsBase/utils/hexToRgbA";
import getRoleOrganizEdited from "./getRoleOrganizEdited";
import Paper from "@material-ui/core/Paper";
import concat from "lodash-es/concat";

const getMenuLabel = (roleId: SharedRole) => {
  switch (roleId) {
    case SharedRole.EDITOR:
      return "All users can find and edit";
    case SharedRole.VIEWER:
      return "All users can find and view";
    case SharedRole.TO_REMOVE_ORGANIZ:
      return "Restricted to specific users";
    default:
      return undefined;
  }
};
const getMenuIcon = (roleId: SharedRole) => {
  switch (roleId) {
    case SharedRole.EDITOR:
      return "edit";
    case SharedRole.VIEWER:
      return "remove_red_eye";
    case SharedRole.TO_REMOVE_ORGANIZ:
      return "lock";
    default:
      return undefined;
  }
};

interface IGetShareWith {
  assetDatas: IFileDetail[];
  roleOrganizUpdated: SharedRole;
  roleOrganizInitial: SharedRole;
  isEdited: boolean;
}
const getSharedWith = ({
  assetDatas,
  roleOrganizUpdated,
  roleOrganizInitial,
  isEdited,
}: IGetShareWith): IShared[] => {
  const sharesPrivate = assetDatas.reduce((acc, { sharedWith }) => {
    sharedWith.forEach((s) => {
      if (s.id !== ORGANIZATION_ID) acc.push(s);
    });
    return acc;
  }, []);
  const sharesOrganiz = [
    {
      id: ORGANIZATION_ID,
      role: isEdited ? roleOrganizUpdated : roleOrganizInitial,
    },
  ];

  return concat(sharesOrganiz, sharesPrivate);
};
const useStyles = makeStyles({
  flex1: {
    flex: 1,
  },
  selectOrganiz: {
    padding: "0 10px",
    "background-color": "#fff",
    border: `1px solid ${Colors.Gray4}`,
  },
  selectOrganizEdited: {
    "background-color": `${hexToRgbA(Colors.Blue, 0.1)} !important`,
  },
  toolbar: {
    padding: 0,
  },
  labelText: {
    "margin-left": 5,
  },
  labelInfo: {
    padding: "0 10px",
    "min-height": 100,
    display: "flex",
    "flex-direction": "column",
    "justify-content": "center",
  },
});

interface IShareOrganiz {
  assetDatas: IFileDetail[];
  sharesToEdited: IShared[];
  onChange: (userId: string, role: SharedRole) => void;
}

const ShareOrganiz = ({
  assetDatas,
  sharesToEdited,
  onChange,
}: IShareOrganiz) => {
  const classes = useStyles({});
  const {
    isEdited,
    roleOrganizUpdated,
    roleOrganizInitial,
  } = getRoleOrganizEdited({
    assetDatas,
    sharesToEdited,
  });
  const canEdit = !assetDatas.find(({ canEdit }) => !canEdit);
  const sharedWith = getSharedWith({
    assetDatas,
    roleOrganizUpdated,
    roleOrganizInitial,
    isEdited,
  });
  const onClick = React.useCallback(
    (event, btnId) => {
      onChange(ORGANIZATION_ID, JSON.parse(btnId));
    },
    [onChange]
  );

  return (
    <Paper
      className={classnames({
        [classes.selectOrganiz]: true,
        [classes.selectOrganizEdited]: isEdited,
      })}
    >
      <Toolbar className={classes.toolbar}>
        <BadgeSharedWith
          sharedWith={sharedWith}
          style={{
            minWidth: 35,
            minHeight: 35,
            position: "relative",
            marginRight: 5,
          }}
        />
        <Typography
          className={classes.labelText}
          variant="body2"
          children={getLabel(sharedWith)}
        />
        <div className={classes.flex1} />
        {!canEdit ? null : (
          <Btn
            color={Colors.Blue}
            variant={isEdited ? "bold" : "light"}
            icon="settings"
            menu={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "right",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "right",
              },
              items: [
                SharedRole.VIEWER,
                SharedRole.EDITOR,
                SharedRole.TO_REMOVE_ORGANIZ,
              ].map((s) => ({
                id: JSON.stringify(s),
                label: getMenuLabel(s),
                icon: getMenuIcon(s),
                active: roleOrganizUpdated === s,
                onClick,
              })),
            }}
          />
        )}
      </Toolbar>
    </Paper>
  );
};

export default ShareOrganiz;
