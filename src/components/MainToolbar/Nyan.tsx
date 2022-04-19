import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Slide from "@material-ui/core/Slide/Slide";

const rainbow =
  "linear-gradient( to top, #F44336 6.25%, #E91E63 6.25%, #E91E63 12.5%, #9C27B0 12.5%, #9C27B0 18.75%, #673AB7 18.75%, #673AB7 25%, #3F51B5 25%, #3F51B5 31.25%, #2196F3 31.25%, #2196F3 37.5%, #03A9F4 37.5%, #03A9F4 43.75%, #00BCD4 43.75%, #00BCD4 50%, #009688 50%, #009688 56.25%, #4CAF50 56.25%, #4CAF50 62.5%, #8BC34A 62.5%, #8BC34A 68.75%, #CDDC39 68.75%, #CDDC39 75%, #FFEB3B 75%, #FFEB3B 81.25%, #FFC107 81.25%, #FFC107 87.5%, #FF9800 87.5%, #FF9800 93.75%, #FF5722 93.75%, #FF5722 100%)";
const useStyles = makeStyles({
  nyan: {
    position: "relative",
    width: "100vw",
  },
  nyanRainbow: {
    flex: 1,
    height: 50,
    background: rainbow,
  },
  nyanTail: {
    width: 50,
    height: 50,
    position: "absolute",
    right: "-50px",
    top: 0,
    bottom: 0,
    margin: "auto",
    background: rainbow,
    "border-top-right-radius": 100,
    "border-bottom-right-radius": 100,
  },
  nyanCat: {
    width: 50,
    height: 50,
    zIndex: 2,
    position: "absolute",
    right: "-85px",
    top: 0,
    bottom: 0,
    margin: "auto",
    backgroundRepeat: "no-repeat",
    backgroundImage: "url(https://i.stack.imgur.com/0prji.gif)",
    backgroundSize: "contain",
    backgroundPosition: "center",
  },
});

interface INyan {
  open: boolean;
}

const Nyan = ({ open }: INyan) => {
  const classes = useStyles({});
  return (
    <Slide
      direction={open ? "right" : "left"}
      in={open}
      mountOnEnter
      unmountOnExit
      timeout={{
        enter: 8000,
        exit: 1500,
      }}
    >
      <div className={classes.nyan}>
        <div className={classes.nyanRainbow} />
        <div className={classes.nyanTail} />
        <div className={classes.nyanCat} />
      </div>
    </Slide>
  );
};

export default Nyan;
