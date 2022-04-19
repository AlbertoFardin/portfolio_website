import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import * as Colors from "../../style/Colors";

const useStyles = makeStyles({
  placeholder: {
    margin: "auto",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 200,
    height: 100,
    "text-align": "center",
  },
  icon: {
    "font-size": "50px !important",
    color: Colors.Gray2,
  },
  label: {
    color: Colors.Gray2,
  },
});

interface IPlaceholder {
  open: boolean;
  icon: string;
  label1?: string;
  label2?: string;
}

const Placeholder = ({ open, icon, label1, label2 }: IPlaceholder) => {
  const classes = useStyles({});
  if (!open) return null;
  return (
    <div className={classes.placeholder}>
      <Icon className={classes.icon} children={icon} />
      {!label1 ? null : (
        <Typography
          variant="body1"
          className={classes.label}
          children={label1}
        />
      )}
      {!label2 ? null : (
        <Typography
          variant="body1"
          className={classes.label}
          children={label2}
        />
      )}
    </div>
  );
};

export default Placeholder;
