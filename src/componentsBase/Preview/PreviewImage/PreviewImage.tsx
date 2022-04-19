import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import IPreviewRender from "../IPreviewRender";

interface IStyles {
  style: React.CSSProperties;
  fixedSized: boolean;
}
const useStyles = makeStyles({
  image: {
    "user-select": "none",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: "auto",
    "max-height": ({ fixedSized }: IStyles) =>
      fixedSized ? "initial" : "100%",
    "max-width": ({ fixedSized }: IStyles) => (fixedSized ? "initial" : "100%"),
    height: ({ fixedSized, style }: IStyles) =>
      fixedSized ? style.height : "initial",
    width: ({ fixedSized, style }: IStyles) =>
      fixedSized ? style.width : "initial",
  },
});

const PreviewImage = ({
  onSrcLoad,
  onSrcError,
  srcUrl,
  thumbFixedSized,
  style,
}: IPreviewRender) => {
  const classes = useStyles({
    fixedSized: thumbFixedSized,
    style,
  });
  return (
    <img
      src={srcUrl}
      alt=""
      className={classes.image}
      onLoad={onSrcLoad}
      onError={onSrcError}
    />
  );
};

export default PreviewImage;
