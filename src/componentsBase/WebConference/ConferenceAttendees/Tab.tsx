import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";

const useStyles = makeStyles(({ palette }) => ({
  tab: {
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    "min-width": 100,
    "justify-content": "center",
  },
  icon: {
    "font-size": 18,
    margin: "0 5px",
  },
  label: {
    //
  },
  selected: {
    color: palette.primary.main,
  },
}));

interface ITab {
  icon: string;
  label: string;
  selected?: boolean;
}

const Tab = ({ icon, label, selected = false }: ITab) => {
  const classes = useStyles();
  return (
    <div className={classes.tab}>
      <Icon
        className={classnames({
          [classes.icon]: true,
          [classes.selected]: selected,
        })}
        children={icon}
      />
      <Typography
        variant="body2"
        className={classnames({
          [classes.label]: true,
          [classes.selected]: selected,
        })}
        children={label}
      />
    </div>
  );
};

export default Tab;
