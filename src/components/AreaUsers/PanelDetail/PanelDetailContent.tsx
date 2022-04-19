import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { IAdminUserProfile } from "../../../interfaces";
import FieldBoolean from "./Field/FieldBoolean";
import FieldRoles from "./Field/FieldRoles";
import FieldText from "./Field/FieldText";
import FieldDate from "./Field/FieldDate";
import FieldTenants from "./Field/FieldTenants";
import FieldApplications from "./Field/FieldApplications";
import FieldEmail from "./Field/FieldEmail";
import {
  CREATED_AT_KEY,
  FIRST_NAME_KEY,
  ID_KEY,
  LAST_NAME_KEY,
  UPDATED_AT_KEY,
  WARDA_KEY,
} from "../constants";
import Avatar from "./Avatar";
import { ContextPermissions } from "../../contexts";
import permissionsCheck from "../../../utils/permissionsCheck";
import PERMISSIONS from "../../../permissions";
import { ContextDispatchViewport } from "../contexts";
import { ACT_VPORT } from "../reducer";

const useStyles = makeStyles({
  content: {
    flex: 1,
    position: "relative",
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
    "overflow-x": "hidden",
    "overflow-y": "overlay",
  },
});

interface IPanelDetailContent {
  user: IAdminUserProfile;
  inEdit: boolean;
}

const PanelDetailContent = ({ user, inEdit }: IPanelDetailContent) => {
  const classes = useStyles({});
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const permissions = React.useContext(ContextPermissions);

  const isCreatingUser = !user.userId;
  const isWardEditable = permissionsCheck({
    keys: [PERMISSIONS.users_admin_manage_is_warda_flag],
    permissions,
  });

  const {
    userId,
    profileData: {
      firstName,
      lastName,
      picture,
      createdAt,
      updatedAt,
      email,
      isWarda,
      activated,
    },
    tenants,
    roles,
    applications,
  } = user;

  const onChangeDatas = React.useCallback(
    (key: string, value) => {
      dispatchViewport({ type: ACT_VPORT.USER_CHANGE_DATAS, key, value });
    },
    [dispatchViewport]
  );

  return (
    <div className={classes.content}>
      <Avatar src={picture} />
      <FieldText
        id={FIRST_NAME_KEY}
        value={firstName}
        onChange={onChangeDatas}
        readOnly={!inEdit}
      />
      <FieldText
        id={LAST_NAME_KEY}
        value={lastName}
        onChange={onChangeDatas}
        readOnly={!inEdit}
      />
      <FieldEmail
        onChange={onChangeDatas}
        email={email}
        emailVerified={activated}
        readOnly={!inEdit}
      />
      <FieldRoles value={roles} readOnly={!inEdit} />
      {isCreatingUser ? (
        <FieldApplications value={applications} />
      ) : (
        <>
          <FieldText id={ID_KEY} value={userId} readOnly />
          <FieldDate id={CREATED_AT_KEY} value={createdAt} />
          <FieldDate id={UPDATED_AT_KEY} value={updatedAt} />
          <FieldTenants value={tenants} />
        </>
      )}
      <FieldBoolean
        id={WARDA_KEY}
        onChange={onChangeDatas}
        value={isWarda}
        readOnly={!inEdit || !isWardEditable}
      />
    </div>
  );
};

export default PanelDetailContent;
