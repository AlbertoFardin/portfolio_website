import * as React from "react";

interface IPreviewRender {
  mousehover: boolean;
  onSrcLoad: () => void;
  onSrcError: () => void;
  srcLoaded: boolean;
  srcUrl: string;
  style?: React.CSSProperties;
  thumbFixedSized?: boolean;
}

export default IPreviewRender;
