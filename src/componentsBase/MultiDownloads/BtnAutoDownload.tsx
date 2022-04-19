import * as React from "react";
import Btn from "../Btn";
import * as Colors from "../style/Colors";

interface IBtnAutoDownload {
  url: string;
  name: string;
}

const BtnAutoDownload = ({ url, name }: IBtnAutoDownload) => {
  const linkRef = React.useRef(null);
  const [mousehover, setMousehover] = React.useState(false);
  const [downloaded, setDownloaded] = React.useState(false);
  const onCbMouseEnter = React.useCallback(() => {
    setMousehover(true);
  }, []);
  const onCbMouseLeave = React.useCallback(() => {
    setMousehover(false);
  }, []);
  const cbOnClick = React.useCallback(() => {
    linkRef.current.click();
  }, []);

  React.useEffect(() => {
    setDownloaded(false);
    setMousehover(false);
  }, [name]);

  React.useEffect(() => {
    if (!downloaded) {
      linkRef.current.click();
      setDownloaded(true);
    }
  }, [downloaded]);

  return (
    <a
      ref={linkRef}
      href={url}
      download={name}
      style={{ textDecoration: "none" }}
      children={
        <Btn
          variant={downloaded ? "bold" : "light"}
          color={downloaded ? Colors.Green : undefined}
          icon={mousehover ? "file_download" : "check"}
          onClick={cbOnClick}
          onMouseEnter={onCbMouseEnter}
          onMouseLeave={onCbMouseLeave}
        />
      }
    />
  );
};

export default BtnAutoDownload;
