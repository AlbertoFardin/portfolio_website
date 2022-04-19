import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { IFileDetail, IShared, SharedRole } from "../../../../interfaces";
import isEmpty from "lodash-es/isEmpty";
import getUser from "../../../../utils/getUser";
import { ContextM2ms, ContextUsers } from "../../../contexts";
import Toolbar from "@material-ui/core/Toolbar";
import * as Colors from "../../../../componentsBase/style/Colors";
import Btn from "../../../../componentsBase/Btn";
import { ORGANIZATION_ID } from "../../constants";
import BadgeSharedWith, { getLabel } from "../../Content/BadgeSharedWith";

const getUserLabel = (role: SharedRole): string => {
  switch (role) {
    case SharedRole.EDITOR:
      return "can edit";
    case SharedRole.VIEWER:
      return "can read";
    default:
      return "";
  }
};

const useStyles = makeStyles({
  toolbar: {
    padding: "0 10px",
  },
  divider: {
    height: 20,
    width: 1,
    background: Colors.Gray2,
    margin: "0 10px",
  },
  badge: {
    position: "relative",
    width: 28,
    height: 28,
    margin: "0 5px 0 1px",
  },
  avatar: {
    margin: 1,
  },
});

const SharedUsers = ({ shares }: { shares: IShared[] }) => {
  const classes = useStyles({});
  const users = React.useContext(ContextUsers);
  const m2ms = React.useContext(ContextM2ms);

  const sharesVisibled: IShared[] = [];
  const sharesHided: IShared[] = [];

  shares.forEach((s, index) => {
    if (index > 7) {
      sharesHided.push(s);
    } else {
      sharesVisibled.push(s);
    }
  });

  return (
    <>
      {sharesVisibled.map(({ id, role }) => {
        const userShared = getUser(id, { users, m2ms });
        return (
          <Btn
            key={id}
            variant="bold"
            className={classes.avatar}
            tooltip={`${userShared.name} ${getUserLabel(role)}`}
            avatar={userShared.picture}
          />
        );
      })}
      {isEmpty(sharesHided) ? null : (
        <Btn
          variant="bold"
          className={classes.avatar}
          label={`+${sharesHided.length}`}
          menu={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            items: sharesHided.map(({ id, role }) => {
              const userShared = getUser(id, { users, m2ms });
              return {
                id,
                label: userShared.name,
                avatar: userShared.picture,
                subLabel: getUserLabel(role),
              };
            }),
          }}
        />
      )}
    </>
  );
};

interface IInfoShare {
  assetData: IFileDetail;
}

const InfoShare = ({ assetData }: IInfoShare) => {
  const classes = useStyles({});
  const users = React.useContext(ContextUsers);
  const m2ms = React.useContext(ContextM2ms);

  const userOwner = getUser(assetData.owner, { users, m2ms });
  const { sharedWith } = assetData;
  const sharesPrivate = sharedWith.filter((f) => f.id !== ORGANIZATION_ID);

  return (
    <Toolbar className={classes.toolbar}>
      <BadgeSharedWith
        className={classes.badge}
        sharedWith={sharedWith}
        tooltip={getLabel(sharedWith)}
      />
      <Btn
        variant="bold"
        className={classes.avatar}
        tooltip={`${userOwner.name} is the owner`}
        avatar={userOwner.picture}
      />
      {isEmpty(sharesPrivate) ? null : (
        <>
          <div className={classes.divider} />
          <SharedUsers shares={sharesPrivate} />
        </>
      )}
    </Toolbar>
  );
};

export default InfoShare;
