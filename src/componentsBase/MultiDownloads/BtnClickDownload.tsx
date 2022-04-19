import * as React from "react";
import Btn from "../Btn";

interface IBtnClickDownload {
  url: string;
  name: string;
  onClick: () => void;
}

const BtnClickDownload = ({ url, name, onClick }: IBtnClickDownload) => {
  const linkRef = React.useRef(null);
  const cbOnClick = React.useCallback(() => {
    linkRef.current.click();
    onClick();
  }, [onClick]);
  return (
    <a
      ref={linkRef}
      href={url}
      download={name}
      style={{ textDecoration: "none" }}
      children={<Btn icon="file_download" onClick={cbOnClick} />}
    />
  );
};

export default BtnClickDownload;
