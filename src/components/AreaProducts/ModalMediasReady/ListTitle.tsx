import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";

const useStyles = makeStyles(() => ({
  columnTitle: {
    height: 80,
  },
  title: {
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    "margin-top": 10,
  },
  icon: {
    "font-size": "18px !important",
    margin: "0 5px 0 0",
  },
}));

interface IListTitle {
  icon: string;
  title: string;
  subTitle: string;
}

const ListTitle = ({ icon, title, subTitle }: IListTitle) => {
  const classes = useStyles({});
  return (
    <div className={classes.columnTitle}>
      <div className={classes.title}>
        <Icon className={classes.icon} children={icon} />
        <Typography
          variant="body2"
          children={`SELECT ${title.toLocaleUpperCase()}`}
        />
      </div>
      <Typography variant="body1" children={subTitle} />
    </div>
  );
};

export default ListTitle;
