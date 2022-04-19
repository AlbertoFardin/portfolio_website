import * as React from "react";
import { NotificationType } from "../../../interfaces";
import CardAssignment from "./CardAssignment";
import CardMentionImgSc from "./CardMentionImgSc";
import CardMentionImgDa from "./CardMentionImgDa";
import CardImport from "./CardImport";
import CardNoType from "./CardNoType";
import CardSharedFiles from "./CardSharedFiles";
import CardBulkEditing from "./CardBulkEditing";
import ICard from "./ICard";
import BtnMarkRead from "./BtnMarkRead";
import BtnDelete from "./BtnDelete";
import { emptyFn } from "../../../componentsBase/utils/common";
import useStyles from "./useStyles";

const Card = ({ dispatch, notification }: ICard) => {
  const classes = useStyles({});
  const { id, type, markedAsRead } = notification;
  const [mousehover, setMousehover] = React.useState(false);
  const onMouseHover = React.useCallback(() => setMousehover(true), []);
  const onMouseLeave = React.useCallback(() => setMousehover(false), []);
  const p: ICard = { dispatch, notification };
  return (
    <div
      role="presentation"
      className={classes.card}
      onMouseEnter={onMouseHover}
      onMouseLeave={onMouseLeave}
      onMouseOver={onMouseHover}
      onFocus={emptyFn}
    >
      <BtnDelete dispatch={dispatch} id={id} visibled={mousehover} />
      <BtnMarkRead dispatch={dispatch} id={id} markedAsRead={markedAsRead} />
      {(() => {
        switch (type) {
          case NotificationType.MENTION_IMG_SC:
            return <CardMentionImgSc {...p} />;
          case NotificationType.MENTION_IMG_DA:
            return <CardMentionImgDa {...p} />;
          case NotificationType.ASSIGNMENT:
            return <CardAssignment {...p} />;
          case NotificationType.IMPORT:
            return <CardImport {...p} />;
          case NotificationType.SHARED_FILES:
            return <CardSharedFiles {...p} />;
          case NotificationType.MULTI_PRODUCT_EDITING:
            return <CardBulkEditing {...p} />;
          default:
            return <CardNoType {...p} />;
        }
      })()}
    </div>
  );
};

export default Card;
