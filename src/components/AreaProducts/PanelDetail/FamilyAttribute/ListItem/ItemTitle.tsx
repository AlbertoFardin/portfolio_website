import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { AttributeFamily } from "../../../../../interfaces";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

const color = "#9e9d9d";
const useStyles = makeStyles(({ typography }) => ({
  item: {
    display: "flex",
    "flex-direction": "column",
  },
  flex1: {
    flex: 1,
  },
  typo: {
    ...typography.body2,
    color,
    margin: "0 35px",
  },
  divider: {
    "background-color": color,
    margin: "0 30px 10px",
    height: 1,
  },
}));

interface IItemTitle {
  style: React.CSSProperties;
  family: AttributeFamily;
}

const ItemTitle = ({ style, family }: IItemTitle) => {
  const classes = useStyles({});

  return (
    <div style={style} className={classes.item}>
      <div className={classes.flex1} />
      <Typography className={classes.typo} children={family} />
      <Divider className={classes.divider} />
    </div>
  );
};

export default ItemTitle;
