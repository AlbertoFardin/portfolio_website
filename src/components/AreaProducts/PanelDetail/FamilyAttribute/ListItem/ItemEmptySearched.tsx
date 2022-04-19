import * as React from "react";
import * as Colors from "../../../../../componentsBase/style/Colors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import { AttributeFamily } from "../../../../../interfaces";

const useStyles = makeStyles(({ typography }) => ({
  typo: {
    ...typography.body1,
    color: Colors.Gray2,
    "font-style": "italic",
    "text-align": "center",
  },
  typoLink: {
    cursor: "pointer",
    "font-weight": "bold",
  },
}));

interface IItemEmptySearched {
  style: React.CSSProperties;
  family: AttributeFamily;
}

const ItemEmptySearched = ({ style, family }: IItemEmptySearched) => {
  const classes = useStyles({});

  return (
    <div style={style}>
      <Typography
        className={classes.typo}
        children={`No ${family} attributes found`}
      />
    </div>
  );
};

export default ItemEmptySearched;
