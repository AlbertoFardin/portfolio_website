import * as React from "react";
import * as Colors from "../../../componentsBase/style/Colors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import { AttributeFamily } from "../../../interfaces";

const useStyles = makeStyles({
  placeholder: {
    color: Colors.Gray2,
    padding: 10,
    "font-style": "italic",
    "text-align": "center",
  },
});

interface IPlaceholderText {
  family: AttributeFamily;
  attributesCount: number;
  assetdataCount: number;
}

const PlaceholderText = ({
  family,
  attributesCount,
  assetdataCount,
}: IPlaceholderText) => {
  const classes = useStyles({});

  if (attributesCount) return null;

  return (
    <Typography
      variant="body1"
      className={classes.placeholder}
      children={`There are no ${family} for ${
        assetdataCount > 1 ? "these items" : "this item"
      } `}
    />
  );
};

export default PlaceholderText;
