import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import LoadingMask from "../../../../../componentsBase/LoadingMask";
import apiUrls from "../../../../../api/endpoints";
import { IMedia, Service } from "../../../../../interfaces";

interface IStyles {
  height: number;
  width: number;
}
const useStyles = makeStyles({
  previewVideo: {
    position: "relative",
    overflow: "hidden",
    flex: 1,
    display: "flex",
    "align-items": "center",
    "background-color": "#000",
  },
  video: {
    "user-select": "none",
    margin: "auto",
    outline: "none",
    "max-width": ({ width }: IStyles) => width,
    "max-height": ({ height }: IStyles) => height,
  },
});

interface IPreviewVideo {
  media: IMedia;
}

const PreviewVideo = ({ media }: IPreviewVideo) => {
  const divRef = React.useRef(null);
  const [loading, setLoading] = React.useState(false);
  const width = divRef && divRef.current ? divRef.current.clientWidth : 0;
  const height = divRef && divRef.current ? divRef.current.clientHeight : 0;
  const classes = useStyles({ width, height });
  const { fileId } = media;
  const cbLoadingStop = React.useCallback(() => setLoading(false), []);

  React.useEffect(() => {
    if (fileId) setLoading(true);
  }, [fileId]);

  return (
    <div ref={divRef} className={classes.previewVideo}>
      <LoadingMask open={loading} spinnerColor="#fff" backgroundColor="#000" />
      <video
        className={classes.video}
        src={apiUrls.getRendition.url(fileId, Service.SEECOMMERCE, "HQ")}
        onLoadedData={cbLoadingStop}
        onError={cbLoadingStop}
        muted
        controls
      />
    </div>
  );
};

export default PreviewVideo;
