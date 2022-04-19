import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import IPreviewRender from "../IPreviewRender";
import VideoPlayerIcon from "./VideoPlayerIcon";

const useStyles = makeStyles({
  video: {
    "max-height": "100%",
    "max-width": "100%",
    "user-select": "none",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: "auto",
  },
});

const PreviewVideo = ({
  mousehover = false,
  onSrcLoad,
  onSrcError,
  srcLoaded,
  srcUrl,
  style,
}: IPreviewRender) => {
  const classes = useStyles({});
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (!!videoRef && !!videoRef.current) {
      const v = videoRef.current;
      if (mousehover && srcLoaded) {
        v.play();
      } else {
        v.pause();
        v.currentTime = 0;
      }
    }
  }, [mousehover, srcLoaded]);

  return (
    <>
      <video
        ref={videoRef}
        className={classes.video}
        style={{
          height: style.height,
          width: style.width,
        }}
        src={srcUrl}
        muted
        loop
        controls={false}
        onLoadedData={onSrcLoad}
        onError={onSrcError}
      />
      <VideoPlayerIcon
        open={srcLoaded && !mousehover}
        size={Math.min(Number(style.width), Number(style.height))}
      />
    </>
  );
};

export default PreviewVideo;
