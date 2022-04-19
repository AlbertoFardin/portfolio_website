import * as React from "react";
import * as Colors from "../../../../componentsBase/style/Colors";
import {
  INPayloadBulkEditing,
  RequestTypeBulkEditing,
} from "../../../../interfaces";
import ICard from "../ICard";
import CardTitle from "../CardTitle";
import CardAvatar from "../CardAvatar";
import useStyles from "../useStyles";
import Typography from "@material-ui/core/Typography";
import BtnCopy from "../BtnCopy";
import isEmpty from "lodash-es/isEmpty";

const titleMap = {
  [RequestTypeBulkEditing.ATTRIBUTE_EDITING]: "Bulk editing attributes",
  [RequestTypeBulkEditing.ASSIGNMENT]: "Bulk assignment",
  [RequestTypeBulkEditing.VIEW_EDITING]: "Bulk view editing",
  [RequestTypeBulkEditing.VIEW_RESET]: "Bulk view reset",
  [RequestTypeBulkEditing.READY]: "Bulk ready request",
  [RequestTypeBulkEditing.PUBLISHED]: "Bulk published",
};
const getName = (a: string[]): string =>
  `${a.length} ${a.length > 1 ? "products" : "product"}`;

const CardBulkEditing = ({ notification }: ICard) => {
  const classes = useStyles({});
  const { creation, markedAsRead, payload } = notification;
  const {
    hasErrors,
    success_keys,
    failure_keys,
    requestType,
  } = payload as INPayloadBulkEditing;
  return (
    <>
      <CardAvatar
        icon={hasErrors ? "warning" : "check"}
        color={hasErrors ? Colors.Orange : Colors.Green}
      />
      <div className={classes.cardContent}>
        <CardTitle
          title={titleMap[requestType] || "Bulk request"}
          creation={creation}
          markedAsRead={markedAsRead}
        />
        <Typography variant="body1" children="Request has been processed" />
        {isEmpty(success_keys) ? null : (
          <BtnCopy
            icon="check"
            label={`${getName(success_keys)} were updated`}
            tooltip={success_keys.join("\n")}
            copyToClipboard={success_keys.join("\n")}
          />
        )}
        {isEmpty(failure_keys) ? null : (
          <BtnCopy
            icon="close"
            label={`${getName(failure_keys)} were not updated`}
            tooltip={failure_keys.join("\n")}
            copyToClipboard={failure_keys.join("\n")}
          />
        )}
      </div>
    </>
  );
};

export default CardBulkEditing;
