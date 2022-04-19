import * as React from "react";
import * as Colors from "../../../../../componentsBase/style/Colors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { ContextDispatchDetail } from "../../../contexts";
import Typography from "@material-ui/core/Typography";
import { ACT_DETAIL } from "../../reducer";
import Link from "@material-ui/core/Link";
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

interface IItemEmptySelected {
  style: React.CSSProperties;
  family: AttributeFamily;
}

const ItemEmptySelected = ({ style, family }: IItemEmptySelected) => {
  const classes = useStyles({});
  const dispatchDetail = React.useContext(ContextDispatchDetail);

  const onManagerOpen = React.useCallback(() => {
    dispatchDetail({ type: ACT_DETAIL.MANAGER_OPEN, value: true });
  }, [dispatchDetail]);

  return (
    <div style={style}>
      <Typography
        className={classes.typo}
        children={`There are no ${family} attributes`}
      />
      <Typography className={classes.typo}>
        <span children="Select one or more attributes from " />
        <Link
          className={classes.typoLink}
          onClick={onManagerOpen}
          children="Attributes Sets"
        />
      </Typography>
    </div>
  );
};

export default ItemEmptySelected;
