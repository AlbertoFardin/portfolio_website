import * as React from "react";
import * as Colors from "../../../../componentsBase/style/Colors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  placeholder: {
    color: Colors.Gray2,
    padding: 10,
    "font-style": "italic",
    "text-align": "center",
    width: "-webkit-fill-available",
    height: "fit-content",
  },
});

const PlaceholderText = () => {
  const classes = useStyles({});

  return (
    <Typography
      variant="body1"
      className={classes.placeholder}
      children="There are no media data for this item"
    />
  );
};

export default PlaceholderText;
