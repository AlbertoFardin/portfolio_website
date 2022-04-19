import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Icon from "@material-ui/core/Icon";
import classnames from "classnames";

interface IStyle {
  size: number;
}
const useStyles = makeStyles({
  center: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: "auto",
  },
  videoplayericon: {
    "border-radius": 1000,
    "z-index": 1,
    "background-color": "rgba(0,0,0,0.5)",
    height: ({ size }: IStyle) => size / 3.5,
    width: ({ size }: IStyle) => size / 3.5,
    "text-align": "center",
  },
  icon: {
    color: "#fff",
    "font-size": ({ size }: IStyle) => `${size / 6}px !important`,
  },
});

interface IVideoPlayerIcon {
  open: boolean;
  size: number;
}

const VideoPlayerIcon = ({ open, size }: IVideoPlayerIcon) => {
  const classes = useStyles({ size });
  if (!open) return null;
  return (
    <div
      className={classnames([classes.center, classes.videoplayericon])}
      children={
        <Icon
          className={classnames([classes.center, classes.icon])}
          children="play_arrow"
        />
      }
    />
  );
};

export default VideoPlayerIcon;
