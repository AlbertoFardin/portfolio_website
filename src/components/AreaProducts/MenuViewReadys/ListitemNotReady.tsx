import * as React from "react";
import ListItem from "@material-ui/core/ListItem";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import styles from "./styles";

const useStyles = makeStyles(styles);

interface IListitemNotReady {
  label: string;
}

const ListitemNotReady = ({ label }: IListitemNotReady) => {
  const classes = useStyles({});
  return (
    <ListItem className={classes.listItem}>
      <Typography
        style={{ marginLeft: 34 }}
        className={classes.typogaphy}
        variant="body1"
        children={label}
      />
      <div className={classes.flex1} />
      <Typography
        className={classes.typogaphy}
        variant="body2"
        children="No media ready yet"
      />
    </ListItem>
  );
};

export default ListitemNotReady;
