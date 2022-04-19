import * as React from "react";
import { INPayloadAssignment } from "../../../../interfaces";
import ICard from "../ICard";
import CardTitle from "../CardTitle";
import BtnCopy from "../BtnCopy";
import CardAvatar from "../CardAvatar";
import useStyles from "../useStyles";

const CardAssignment = ({ notification }: ICard) => {
  const classes = useStyles({});
  const { from, creation, markedAsRead, payload } = notification;
  const { assignedViews } = payload as INPayloadAssignment;
  const entityIds = [];
  const viewNames = [];
  assignedViews.forEach(({ entityId, viewName }) => {
    if (!new Set(entityIds).has(entityId)) entityIds.push(entityId);
    viewNames.push(viewName);
  });
  return (
    <>
      <CardAvatar userId={from} />
      <div className={classes.cardContent}>
        <CardTitle
          title={
            viewNames.length === 1
              ? `assigned you view ${viewNames[0]}`
              : `assigned you ${viewNames.length} views`
          }
          from={from}
          creation={creation}
          markedAsRead={markedAsRead}
        />
        <BtnCopy
          label={
            entityIds.length === 1
              ? "Copy Product Key"
              : `Copy ${entityIds.length} Products Key`
          }
          tooltip={entityIds.join("\n")}
          copyToClipboard={entityIds.join("\n")}
        />
      </div>
    </>
  );
};

export default CardAssignment;
