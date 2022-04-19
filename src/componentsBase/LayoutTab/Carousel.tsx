import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ReactResizeDetector from "react-resize-detector";
import classnames from "classnames";
import ILayoutTabPanel from "./ILayoutTabPanel";

const useStyles = makeStyles({
  carousel: {
    position: "relative",
    height: "100%",
    overflow: "hidden",
    display: "flex",
    "flex-direction": "row",
    "align-items": "stretch",
    flex: 1,
  },
  carouselItem: {
    position: "relative",
    "overflow-x": "hidden",
    "overflow-y": "auto",
    display: "inline-flex",
    "flex-direction": "column",
    "align-items": "stretch",
  },
});

interface ICarousel {
  panels: ILayoutTabPanel[];
  panelSelectedId: string;
}

const Carousel = ({ panels, panelSelectedId }: ICarousel) => {
  const classes = useStyles({});
  const carouselRef = React.useRef(null);
  const [ready, setReady] = React.useState(false);
  const [width, setWidth] = React.useState(0);
  const panelSelectedIndex = panels.findIndex(
    ({ id }: ILayoutTabPanel) => id === panelSelectedId
  );
  const panelSelectedIndexRef = React.useRef(panelSelectedIndex);
  const carouselWidth = carouselRef.current
    ? carouselRef.current.offsetWidth
    : 0;

  React.useEffect(() => {
    setReady(true);
  }, []);

  React.useEffect(() => {
    setWidth(carouselWidth);
  }, [carouselWidth]);

  React.useEffect(() => {
    carouselRef.current.scrollTo({
      top: 0,
      left: panelSelectedIndex * width,
      behavior:
        panelSelectedIndexRef.current === panelSelectedIndex
          ? "auto"
          : "smooth",
    });
    panelSelectedIndexRef.current = panelSelectedIndex;
  }, [panelSelectedIndex, width]);

  return (
    <div ref={carouselRef} className={classes.carousel}>
      {!ready
        ? null
        : panels.map((p: ILayoutTabPanel) => (
            <div
              key={p.id}
              className={classnames({
                [classes.carouselItem]: true,
                [p.className]: !!p.className,
              })}
              style={{
                ...p.style,
                minWidth: width,
                width,
              }}
              children={p.children}
            />
          ))}
      <ReactResizeDetector
        handleWidth
        handleHeight={false}
        skipOnMount
        onResize={setWidth}
      />
    </div>
  );
};

export default React.memo(Carousel);
