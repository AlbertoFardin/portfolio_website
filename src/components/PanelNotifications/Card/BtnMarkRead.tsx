import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ButtonBase from "@material-ui/core/ButtonBase";
import { ACTION } from "../reducer";
import { markNotificationRead } from "../../../api/fetchesApi";
import * as Colors from "../../../componentsBase/style/Colors";
import Tooltip from "../../../componentsBase/Tooltip";

const color = Colors.Blue;
interface IStyles {
  markedAsRead: boolean;
}
const useStyles = makeStyles({
  markread: {
    position: "absolute",
    top: 6,
    right: 6,
    margin: 2,
    width: 12,
    height: 12,
    "box-sizing": "border-box",
    "background-color": ({ markedAsRead }: IStyles) =>
      markedAsRead ? "transparent" : color,
    "border-radius": 50,
    border: ({ markedAsRead }: IStyles) =>
      `1px solid ${markedAsRead ? Colors.Gray2 : color}`,
  },
});

interface IBtnMarkRead {
  dispatch: React.Dispatch<unknown>;
  id: string;
  markedAsRead: boolean;
}

const BtnMarkRead = ({ dispatch, id, markedAsRead }: IBtnMarkRead) => {
  const classes = useStyles({ markedAsRead });
  const [clicked, setClicked] = React.useState(false);
  const onClick = React.useCallback(() => {
    setClicked(true);
  }, []);

  React.useEffect(() => {
    if (clicked) {
      (async () => {
        const mark = !markedAsRead;
        setClicked(false);
        dispatch({ type: ACTION.MARK_READ_ITEM, id, mark });
        await markNotificationRead({ id, mark });
      })();
    }
  }, [clicked, dispatch, markedAsRead, id]);

  return (
    <Tooltip title={markedAsRead ? "Mark as unread" : "Mark as read"}>
      <ButtonBase className={classes.markread} onClick={onClick} />
    </Tooltip>
  );
};

export default BtnMarkRead;
