import * as React from "react";
import * as OpenSeadragon from "openseadragon";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import { IReactSeadragon } from ".";

export const DEFAULT_OPTIONS_SEADRAGON: OpenSeadragon.Options = {
  ajaxWithCredentials: false,
  crossOriginPolicy: "Anonymous",
  defaultZoomLevel: 0,
  gestureSettingsMouse: {
    scrollToZoom: true,
    clickToZoom: true,
    dblClickToZoom: true,
    pinchToZoom: true,
  },
  minZoomImageRatio: 1,
  maxZoomPixelRatio: 1,
  loadTilesWithAjax: true,
  navigatorPosition: "TOP_RIGHT",
  navigatorHeight: "100px",
  navigatorWidth: "130px",
  preserveViewport: true,
  referenceStripScroll: "vertical",
  sequenceMode: false,
  showFullPageControl: true,
  showNavigator: true,
  showNavigationControl: false,
  showHomeControl: true,
  showReferenceStrip: false,
  visibilityRatio: 1,
};

const useStyles = makeStyles({
  divSeadragon: {
    position: "relative",
    display: "inline-block",
    background: "black",
    width: "inherit",
    height: 500,
  },
});

/**
 * **ReactSeadragon** is a react component that wraps [OpenSeadragon](http://openseadragon.github.io/) component.
 */
const ReactSeadragon = ({
  optionsSeadragon,
  className,
  style,
}: IReactSeadragon) => {
  const classes = useStyles({});
  const refViewerSeadragon = React.useRef<OpenSeadragon.Viewer>(null);
  const divSeadragon = React.useRef(null);

  React.useEffect(() => {
    refViewerSeadragon.current = OpenSeadragon({
      ...DEFAULT_OPTIONS_SEADRAGON,
      ...optionsSeadragon,
      element: divSeadragon.current,
    });
    return () => {
      refViewerSeadragon.current.destroy();
      refViewerSeadragon.current = null;
    };
  }, [optionsSeadragon]);

  return (
    <div
      ref={divSeadragon}
      className={classnames({
        [classes.divSeadragon]: true,
        [className]: !!className,
      })}
      style={style}
    />
  );
};

export default ReactSeadragon;
