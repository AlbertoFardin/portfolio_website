/* eslint-disable */
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import classnames from "classnames";
import * as React from "react";
import Placeholder from "../Placeholder";
import { emptyFn } from "../utils/common";
import cls from "../style";
import * as Colors from "../style/Colors";
import ImageZoomSwitches from "./ImageZoomSwitches";
import {
  between,
  constrainImageXY,
  equalArrays,
  getDistanceBetweenPoints,
  getPointFromTouch,
  getTouchMidpoint,
  isSwiping,
} from "./utils";

export interface ImageZoomProps {
  className?: string;
  style?: React.CSSProperties;
  imageIndex: number;
  images: string[];
  onChangeImage?: (...key: any) => any;
  onSwipeLeft?: (...key: any) => any;
  onSwipeRight?: (...key: any) => any;
  placeholderIcon?: string;
  placeholderLabel?: string;
  showPercentage?: boolean;
  switchColor?: string;
  switchVisible?: boolean;
  zoomIdContainer?: string;
  zoomIdImage?: string;
  zoomMaxScale?: number;
}

interface State {
  containerHeight: number;
  containerWidth: number;
  dragging: boolean;
  imageIndex: number;
  imageLoad: boolean;
  imageLoading: boolean;
  imageX: number;
  imageY: number;
  imageScale: number;
  imageScaleMin: number;
  mouseX: number;
  mouseY: number;
  panPointX: number | null;
  panPointStartX: number | null;
  panPointY: number | null;
  panPointStartY: number | null;
  pinching: boolean;
  pinchDistance: number;
  transitionImage: boolean;
  transitionDuration: number;
  swipeDistance: number;
}

class ImageZoom extends React.Component<ImageZoomProps, State> {
  public static defaultProps = {
    imageIndex: 0,
    onChangeImage: emptyFn,
    onSwipeLeft: emptyFn,
    onSwipeRight: emptyFn,
    placeholderIcon: "zoom_in",
    placeholderLabel: "Unable zoom this image",
    showPercentage: false,
    switchColor: Colors.Blue,
    switchVisible: true,
    zoomIdContainer: "warda_zoomimage_container",
    zoomIdImage: "warda_zoomimage_img",
    zoomMaxScale: 10,
  };

  public refZoomContainer: any;

  public refZoomImage: any;

  constructor(p) {
    super(p);
    this.refZoomContainer = React.createRef();
    this.refZoomImage = React.createRef();
    this.state = {
      containerHeight: 0,
      containerWidth: 0,
      dragging: false,
      imageIndex: p.imageIndex,
      imageLoad: false,
      imageLoading: true,
      imageX: 0,
      imageY: 0,
      imageScale: 1,
      imageScaleMin: null,
      mouseX: null,
      mouseY: null,
      panPointX: null,
      panPointStartX: null,
      panPointY: null,
      panPointStartY: null,
      pinching: false,
      pinchDistance: 0,
      transitionImage: false,
      transitionDuration: 300,
      swipeDistance: 200,
    };
  }

  public componentDidMount() {
    const self = this;
    window.addEventListener("resize", self.setInitialSize);
  }

  public setInitialSize = () => {
    const imageWidth = this.getDomZoomImage().width;
    const imageHeight = this.getDomZoomImage().height;
    const containerWidth = this.getDomZoomContainer().width;
    const containerHeight = this.getDomZoomContainer().height;
    let minScale = Math.min(
      containerWidth / imageWidth,
      containerHeight / imageHeight
    );
    minScale =
      minScale < 0 || minScale > this.props.zoomMaxScale ? 1 : minScale;
    this.setState(
      {
        containerWidth,
        containerHeight,
        imageX: 0.5 * (containerWidth - imageWidth * minScale),
        imageY: 0.5 * (containerHeight - imageHeight * minScale),
        imageScale: minScale,
        imageScaleMin: minScale,
      },
      () => {
        // fix Safari
        window.setTimeout(() => {
          this.forceUpdate();
        }, 500);
      }
    );
  };

  public UNSAFE_componentWillReceiveProps(nextProps) {
    const self = this;
    const prevProps = self.props;
    const isChangedIndex =
      Number.isInteger(nextProps.imageIndex) &&
      prevProps.imageIndex !== nextProps.imageIndex;
    if (!equalArrays(prevProps.images, nextProps.images) || isChangedIndex) {
      self.setState({
        imageIndex: nextProps.imageIndex || 0,
        imageLoad: false,
        imageLoading: true,
      });
    }
  }

  public componentDidUpdate(prevProps, prevState) {
    const self = this;
    const containerSize = self.getDomZoomContainer();
    if (
      containerSize.width !== prevState.containerWidth ||
      containerSize.height !== prevState.containerHeight
    ) {
      self.setInitialSize();
    }
  }

  public componentWillUnmount() {
    const self = this;
    window.removeEventListener("resize", self.setInitialSize);
  }

  public getDomZoomContainer() {
    const el = this.refZoomContainer.current;
    return {
      element: el,
      width: el.clientWidth,
      height: el.clientHeight,
    };
  }

  public getDomZoomImage() {
    const el = this.refZoomImage.current;
    return {
      element: el,
      width: el.width,
      height: el.height,
    };
  }

  public getPlaceholder() {
    const self = this;
    const s = self.state;
    const p = self.props;
    return !s.imageLoading && !s.imageLoad ? (
      <Placeholder icon={p.placeholderIcon} label={p.placeholderLabel} />
    ) : null;
  }

  public getImage() {
    const self = this;
    const p = self.props;
    const s = self.state;
    const imageUrl = p.images[s.imageIndex];
    return (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      // eslint-disable-next-line jsx-a11y/alt-text
      <img
        ref={this.refZoomImage}
        src={imageUrl}
        className={cls.Image}
        style={{
          transition:
            s.transitionImage &&
            `left ${s.transitionDuration}ms, top ${s.transitionDuration}ms`,
          display: (s.imageLoading || !s.imageLoad) && "none",
          top: s.imageY,
          left: s.imageX,
          transform: `scale(${s.imageScale})`,
        }}
        draggable={false}
        onLoad={this.onImageLoad}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        onWheel={this.onWheel}
        onError={this.onError}
      />
    );
  }

  public getSwitchImage() {
    const self = this;
    const p = self.props;
    const s = self.state;
    const { length } = p.images;
    if (length === 0 || length === 1 || !p.switchVisible) return null;
    return (
      <ImageZoomSwitches
        length={p.images.length}
        index={s.imageIndex}
        color={p.switchColor}
        onClick={(i) => this.onSwitchImage(i)}
      />
    );
  }

  public getPercentage = () => {
    const { showPercentage } = this.props;
    const { imageScale, imageScaleMin } = this.state;
    const perc = Math.trunc((imageScale * 100) / imageScaleMin);
    if (!showPercentage) return null;
    return <Typography className={cls.Percentage} children={`${perc}%`} />;
  };

  public onTouchStart = (event) => {
    const self = this;
    const containerDom = self.getDomZoomContainer().element;
    if (event.touches.length === 2) {
      const pointA = getPointFromTouch(event.touches[0], containerDom);
      const pointB = getPointFromTouch(event.touches[1], containerDom);
      self.setState({
        pinching: true,
        pinchDistance: getDistanceBetweenPoints(pointA, pointB),
      });
    }

    if (event.touches.length === 1) {
      const point = getPointFromTouch(event.touches[0], containerDom);
      self.setState({
        panPointX: point.x,
        panPointStartX: point.x,
        panPointY: point.y,
        panPointStartY: point.y,
      });
    }
  };

  public onTouchMove = (event) => {
    const self = this;
    const p = self.props;
    const s = self.state;
    event.preventDefault();

    const containerDom = self.getDomZoomContainer().element;
    if (event.touches.length === 2) {
      const pointA = getPointFromTouch(event.touches[0], containerDom);
      const pointB = getPointFromTouch(event.touches[1], containerDom);
      const distance = getDistanceBetweenPoints(pointA, pointB);
      const midpoint = getTouchMidpoint(pointA, pointB);
      const scale = between({
        min: s.imageScaleMin,
        max: p.zoomMaxScale,
        value: s.imageScale * (distance / s.pinchDistance),
      });
      self.setState({
        pinchDistance: distance,
      });
      this.setZoom(midpoint, scale);
    }

    if (event.touches.length === 1) {
      const point = getPointFromTouch(event.touches[0], containerDom);
      const nextX = s.imageX + point.x - s.panPointX;
      const nextY = s.imageY + point.y - s.panPointY;

      self.setState({
        imageX: nextX,
        imageY: nextY,
        panPointX: point.x,
        panPointY: point.y,
      });
    }
  };

  public onTouchEnd = (event) => {
    if (event.touches.length > 0) {
      return null;
    }
    if (isSwiping(this)) {
      this.swipeImage(event);
    } else {
      this.moveImage();
    }
  };

  public onMouseDown = (event) => {
    this.setState({
      dragging: true,
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  };

  public onMouseUp = (event) => {
    this.moveImage();
  };

  public onMouseMove = (event) => {
    const self = this;
    const s = self.state;
    event.preventDefault();

    if (s.dragging) {
      const nextX = s.imageX + event.clientX - s.mouseX;
      const nextY = s.imageY + event.clientY - s.mouseY;
      self.setState({
        imageX: nextX,
        imageY: nextY,
        mouseX: event.clientX,
        mouseY: event.clientY,
      });
    }
  };

  public onWheel = (event) => {
    const self = this;
    const s = self.state;
    event.preventDefault();
    const wheelStep = 0.15;
    const scaleOld = s.imageScale;
    const scaleNew =
      event.deltaY < 0
        ? scaleOld + wheelStep
        : Math.max(scaleOld - wheelStep, s.imageScaleMin);
    this.setZoom({ x: event.clientX, y: event.clientY }, scaleNew);
  };

  public onError = () => {
    const self = this;
    self.setState({
      imageLoad: false,
      imageLoading: false,
    });
  };

  public onSwitchImage = (index) => {
    const self = this;
    const p = self.props;

    self.setState(
      {
        imageIndex: index,
        imageLoad: false,
        imageLoading: true,
      },
      () => {
        if (p.onChangeImage) p.onChangeImage(index);
      }
    );
  };

  public onImageLoad = () => {
    const self = this;
    self.setState({
      imageLoad: true,
      imageLoading: false,
    });
    self.setInitialSize();
  };

  public moveImage = () => {
    const self = this;
    const s = self.state;
    const constrainPosition = constrainImageXY({
      point: {
        x: s.imageX,
        y: s.imageY,
      },
      containerSize: self.getDomZoomContainer(),
      imageSize: self.getDomZoomImage(),
      imageScale: s.imageScale,
    });
    const needFixPosition =
      s.imageX !== constrainPosition.x || s.imageY !== constrainPosition.y;
    self.setState({
      pinching: false,
      pinchDistance: 0,
      panPointX: null,
      panPointStartX: null,
      panPointY: null,
      panPointStartY: null,
      dragging: false,
      mouseX: null,
      mouseY: null,
      imageX: constrainPosition.x,
      imageY: constrainPosition.y,
      transitionImage: needFixPosition,
    });

    if (needFixPosition) {
      setTimeout(() => {
        self.setState({ transitionImage: false });
      }, s.transitionDuration);
    }
  };

  public swipeImage = (event) => {
    const self = this;
    const p = self.props;
    const s = self.state;
    const xDiff = s.panPointX - s.panPointStartX;
    const xDiffAbs = Math.abs(xDiff);
    const yDiff = s.panPointY - s.panPointStartY;
    const yDiffAbs = Math.abs(yDiff);

    event.preventDefault();

    if (
      !event ||
      s.transitionImage ||
      xDiffAbs < yDiffAbs * 1.5 ||
      xDiffAbs < s.swipeDistance
    ) {
      return this.moveImage();
    }

    if (xDiff > 0) {
      if (p.onSwipeRight) {
        return p.onSwipeRight();
      }
      if (!p.onSwipeRight && p.images.length > 1 && s.imageIndex !== 0) {
        return this.onSwitchImage(s.imageIndex - 1);
      }
      return this.moveImage();
    }

    if (xDiff < 0) {
      if (p.onSwipeLeft) {
        return p.onSwipeLeft();
      }
      if (
        !p.onSwipeLeft &&
        p.images.length > 1 &&
        s.imageIndex !== p.images.length
      ) {
        return this.onSwitchImage(s.imageIndex + 1);
      }
      return this.moveImage();
    }
  };

  public setZoom = (pointToZoom, scaleNew) => {
    const s = this.state;
    // Absolute size in pixels of the image file
    const imageWidth = this.getDomZoomImage().width;
    const imageHeight = this.getDomZoomImage().height;

    // Size of the containing "window"
    const containerWidth = this.getDomZoomContainer().width;
    const containerHeight = this.getDomZoomContainer().height;

    // Previous zoom factor of image
    const scaleOld = s.imageScale;

    // Minimum zoom factor (to avoid underzooming to a tiny image)
    const scaleMin = s.imageScaleMin;

    // New size of image by the end of the zoom
    const imageWidthNew = imageWidth * scaleNew;
    const imageHeightNew = imageHeight * scaleNew;

    // Pixel coords of UL corner of image when centered on "window" container at its minimum size.
    // Helper coords used to zoom image while respecting a pivot point.
    const centeredX = 0.5 * (containerWidth - imageWidth * scaleMin);
    const centeredY = 0.5 * (containerHeight - imageHeight * scaleMin);

    // Zoom center (pivot point), which is the mouse position or the middle point of the user's fingers.
    const pointToZoomX = pointToZoom.x;
    const pointToZoomY = pointToZoom.y;

    // Percentage (%) coords relative to image W/H that mark where pointToZoom is located within the image.
    // This defines a pivot in the image from which we can zoom.
    const pX = (pointToZoomX - s.imageX + centeredX) / (imageWidth * scaleOld);
    const pY = (pointToZoomY - s.imageY + centeredY) / (imageHeight * scaleOld);

    // Scale using the pivot pX/Y, and reconvert from % coords back to pixel coords.
    // We now have the new absolute position of the UL corner of the image in pixels.
    const nextX = centeredX + pointToZoomX - pX * imageWidthNew;
    const nextY = centeredY + pointToZoomY - pY * imageHeightNew;

    // If while zooming down the image some empty space remains between image and "window",
    // constrain X/Y of image so that it always touches at least two sides of the "window".
    const constrainPosition = constrainImageXY({
      point: {
        x: nextX,
        y: nextY,
      },
      containerSize: this.getDomZoomContainer(),
      imageSize: this.getDomZoomImage(),
      imageScale: scaleNew,
    });
    this.setState({
      imageX: constrainPosition.x,
      imageY: constrainPosition.y,
      imageScale: scaleNew,
    });
  };

  public render() {
    const self = this;
    const p = self.props;

    return (
      <div
        ref={this.refZoomContainer}
        style={p.style}
        className={classnames({
          [cls.ImageZoom]: true,
          [p.className]: !!p.className,
        })}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
      >
        {self.getPercentage()}
        {self.getImage()}
        {self.getPlaceholder()}
        {self.getSwitchImage()}
      </div>
    );
  }
}

export default ImageZoom;
