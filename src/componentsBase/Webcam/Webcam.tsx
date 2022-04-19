/* eslint-disable */
/**
 * file estratto dalla libreria https://github.com/mozmorris/react-webcam
 * https://github.com/mozmorris/react-webcam/blob/master/src/react-webcam.tsx
 *
 * abbiamo estratto questo file a causa di un conflitto del tslint utilizzato da react-webcam
 * che ci costringeva a cambiare il setup su library-ui
 */

import * as React from "react";
import { WebcamProps } from ".";

function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

interface WebcamState {
  hasUserMedia: boolean;
  src?: string;
}

export default class Webcam extends React.Component<WebcamProps, WebcamState> {
  static defaultProps = {
    audio: true,
    forceScreenshotSourceSize: false,
    imageSmoothing: true,
    mirrored: false,
    onUserMedia: () => {},
    onUserMediaError: () => {},
    screenshotFormat: "image/webp",
    screenshotQuality: 0.92,
  };

  private canvas: HTMLCanvasElement | null = null;

  private ctx: CanvasRenderingContext2D | null = null;

  stream: MediaStream | null;

  video: HTMLVideoElement | null;

  constructor(props) {
    super(props);
    this.state = {
      hasUserMedia: false,
    };
  }

  componentDidMount() {
    const { state, props } = this;

    if (!hasGetUserMedia()) {
      props.onUserMediaError("getUserMedia not supported");

      return;
    }

    if (!state.hasUserMedia) {
      this.requestUserMedia();
    }
  }

  componentDidUpdate(nextProps) {
    const { props } = this;

    if (!hasGetUserMedia()) {
      props.onUserMediaError("getUserMedia not supported");

      return;
    }

    const audioConstraintsChanged =
      JSON.stringify(nextProps.audioConstraints) !==
      JSON.stringify(props.audioConstraints);
    const videoConstraintsChanged =
      JSON.stringify(nextProps.videoConstraints) !==
      JSON.stringify(props.videoConstraints);
    const minScreenshotWidthChanged =
      nextProps.minScreenshotWidth !== props.minScreenshotWidth;
    const minScreenshotHeightChanged =
      nextProps.minScreenshotHeight !== props.minScreenshotHeight;
    if (
      videoConstraintsChanged ||
      minScreenshotWidthChanged ||
      minScreenshotHeightChanged
    ) {
      this.canvas = null;
      this.ctx = null;
    }
    if (audioConstraintsChanged || videoConstraintsChanged) {
      this.stopAndCleanup();
      this.requestUserMedia();
    }
  }

  componentWillUnmount() {
    this.stopAndCleanup();
  }

  private stopAndCleanup() {
    const { state } = this;

    if (state.hasUserMedia) {
      if (this.stream) {
        if (this.stream.getVideoTracks && this.stream.getAudioTracks) {
          this.stream.getVideoTracks().map((track) => track.stop());
          this.stream.getAudioTracks().map((track) => track.stop());
        } else {
          ((this.stream as unknown) as MediaStreamTrack).stop();
        }
      }

      if (state.src) {
        window.URL.revokeObjectURL(state.src);
      }
    }
  }

  getScreenshot() {
    const { state, props } = this;

    if (!state.hasUserMedia) return null;

    const canvas = this.getCanvas();
    return (
      canvas &&
      canvas.toDataURL(props.screenshotFormat, props.screenshotQuality)
    );
  }

  getCanvas() {
    const { state, props } = this;

    if (!this.video) {
      return null;
    }

    if (!state.hasUserMedia || !this.video.videoHeight) return null;

    if (!this.ctx) {
      let canvasWidth = this.video.videoWidth;
      let canvasHeight = this.video.videoHeight;
      if (!this.props.forceScreenshotSourceSize) {
        const aspectRatio = canvasWidth / canvasHeight;

        canvasWidth = props.minScreenshotWidth || this.video.clientWidth;
        canvasHeight = canvasWidth / aspectRatio;

        if (
          props.minScreenshotHeight &&
          canvasHeight < props.minScreenshotHeight
        ) {
          canvasHeight = props.minScreenshotHeight;
          canvasWidth = canvasHeight * aspectRatio;
        }
      }

      this.canvas = document.createElement("canvas");
      this.canvas.width = canvasWidth;
      this.canvas.height = canvasHeight;
      this.ctx = this.canvas.getContext("2d");
    }

    const { ctx, canvas } = this;

    if (ctx && canvas) {
      // mirror the screenshot
      if (props.mirrored) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.imageSmoothingEnabled = props.imageSmoothing;
      ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);

      // invert mirroring
      if (props.mirrored) {
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
      }
    }

    return canvas;
  }

  private requestUserMedia() {
    const { props } = this;

    const sourceSelected = (audioConstraints, videoConstraints) => {
      const constraints: MediaStreamConstraints = {
        video:
          typeof videoConstraints !== "undefined" ? videoConstraints : true,
      };

      if (props.audio) {
        constraints.audio =
          typeof audioConstraints !== "undefined" ? audioConstraints : true;
      }

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.handleUserMedia(null, stream);
        })
        .catch((e) => {
          this.handleUserMedia(e);
        });
    };

    if ("mediaDevices" in navigator) {
      sourceSelected(props.audioConstraints, props.videoConstraints);
    } else {
      const optionalSource = (id) => ({ optional: [{ sourceId: id }] });

      const constraintToSourceId = (constraint) => {
        const { deviceId } = constraint;

        if (typeof deviceId === "string") {
          return deviceId;
        }

        if (Array.isArray(deviceId) && deviceId.length > 0) {
          return deviceId[0];
        }

        if (typeof deviceId === "object" && deviceId.ideal) {
          return deviceId.ideal;
        }

        return null;
      };

      // @ts-ignore: deprecated api
      MediaStreamTrack.getSources((sources) => {
        let audioSource = null;
        let videoSource = null;

        sources.forEach((source) => {
          if (source.kind === "audio") {
            audioSource = source.id;
          } else if (source.kind === "video") {
            videoSource = source.id;
          }
        });

        const audioSourceId = constraintToSourceId(props.audioConstraints);
        if (audioSourceId) {
          audioSource = audioSourceId;
        }

        const videoSourceId = constraintToSourceId(props.videoConstraints);
        if (videoSourceId) {
          videoSource = videoSourceId;
        }

        sourceSelected(
          optionalSource(audioSource),
          optionalSource(videoSource)
        );
      });
    }
  }

  private handleUserMedia(err, stream?: MediaStream) {
    const { props } = this;

    if (err || !stream) {
      this.setState({ hasUserMedia: false });
      props.onUserMediaError(err);

      return;
    }

    this.stream = stream;

    try {
      if (this.video) {
        this.video.srcObject = stream;
      }
      this.setState({ hasUserMedia: true });
    } catch (error) {
      this.setState({
        hasUserMedia: true,
        src: window.URL.createObjectURL(stream as any),
      });
    }

    props.onUserMedia(stream);
  }

  render() {
    const { state, props } = this;

    const {
      audio,
      forceScreenshotSourceSize,
      onUserMedia,
      onUserMediaError,
      screenshotFormat,
      screenshotQuality,
      minScreenshotWidth,
      minScreenshotHeight,
      audioConstraints,
      videoConstraints,
      imageSmoothing,
      mirrored,
      style = {},
      ...rest
    } = props;

    const videoStyle = mirrored
      ? { ...style, transform: `${style.transform || ""} scaleX(-1)` }
      : style;

    return (
      <video
        autoPlay
        src={state.src}
        muted={audio}
        playsInline
        ref={(ref) => {
          this.video = ref;
        }}
        style={videoStyle}
        {...rest}
      />
    );
  }
}