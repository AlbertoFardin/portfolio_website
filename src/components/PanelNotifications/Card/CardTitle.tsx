import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import * as Colors from "../../../componentsBase/style/Colors";
import Typography from "@material-ui/core/Typography";
import getUser from "../../../utils/getUser";
import { ContextM2ms, ContextUsers } from "../../contexts";
import formatHoursMinutes from "../../../utils/formatHoursMinutes";

interface IStyles {
  markedAsRead: boolean;
}
const useStyles = makeStyles({
  typoTitle: {
    color: ({ markedAsRead }: IStyles) =>
      markedAsRead ? Colors.Gray2 : Colors.Gray1,
    "font-weight": ({ markedAsRead }: IStyles) => (markedAsRead ? 400 : 500),
    "margin-left": 5,
  },
  typoDate: {
    color: ({ markedAsRead }: IStyles) =>
      markedAsRead ? Colors.Gray2 : Colors.Gray1,
    padding: "2px 5px 0",
  },
});

interface ICardTitle {
  title: string | React.ReactNode | Element[];
  from?: string;
  creation: string;
  markedAsRead: boolean;
}

const CardTitle = ({ title, from, creation, markedAsRead }: ICardTitle) => {
  const classes = useStyles({ markedAsRead });
  const users = React.useContext(ContextUsers);
  const m2ms = React.useContext(ContextM2ms);
  const user = getUser(from, { users, m2ms });
  return (
    <>
      <Typography
        className={classes.typoTitle}
        variant="body1"
        children={user.name}
      />
      <Typography
        className={classes.typoTitle}
        variant="body1"
        children={title}
      />
      <Typography
        className={classes.typoDate}
        variant={"caption"}
        children={formatHoursMinutes(creation)}
      />
    </>
  );
};

export default CardTitle;
