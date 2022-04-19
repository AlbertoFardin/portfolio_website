import makeStyles from "@material-ui/core/styles/makeStyles";
import TypographyEllipsis from "../../../../../componentsBase/TypographyEllipsis";
import PaperFold from "../../../../../componentsBase/PaperFold";
import * as React from "react";
import classnames from "classnames";
import * as Colors from "../../../../../componentsBase/style/Colors";

const borderRadius = 5;
const useStyles = makeStyles({
  typeLabel: {
    "background-color": "#fff",
    display: "flex",
    "flex-direction": "row",
    "justify-content": "center",
    "align-items": "center",
    position: "absolute",
    "z-index": 1,
    bottom: 6,
    right: 6,
    width: 150,
    borderRadius,
    padding: 6,
    border: `1px solid ${Colors.Gray2}`,
  },
});

interface IImageTypeLabel {
  className?: string;
  original: boolean;
  style?: React.CSSProperties;
}

const ImageTypeLabel = ({
  className,
  original = false,
  style,
}: IImageTypeLabel) => {
  const classes = useStyles({});
  return (
    <div
      style={style}
      className={classnames({
        [classes.typeLabel]: true,
        [className]: !!className,
      })}
    >
      <TypographyEllipsis
        variant="body2"
        children={original ? "Shooting" : "Post Production"}
      />
      <PaperFold
        open={original}
        anchorHorizontal="right"
        anchorVertical="bottom"
        size={borderRadius + 1}
      />
    </div>
  );
};

export default ImageTypeLabel;
