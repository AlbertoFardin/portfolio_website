import * as React from "react";
import BtnBadge from "../../../componentsBase/BtnBadge";
import { IFile } from "../../../interfaces";
import apiUrls from "../../../api/endpoints";
import { colorTheme } from "../../../constants";

interface IBadgeOpenMedia {
  data: IFile;
  className?: string;
  style?: React.CSSProperties;
}

const BadgeOpenMedia = ({ data, className, style }: IBadgeOpenMedia) => {
  const { mimeType, documentRepoId } = data;
  const onClick = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      const srcUrl = apiUrls.getRenditionPublic.url(
        location.search.replace("?link=", ""),
        documentRepoId
      );

      window.open(srcUrl, "_blanck");
    },
    [documentRepoId]
  );

  if (mimeType !== "application/pdf") return null;

  return (
    <BtnBadge
      color={colorTheme}
      icon="open_in_new"
      tooltip="Open PDF in new tab"
      onClick={onClick}
      className={className}
      style={style}
    />
  );
};

export default BadgeOpenMedia;
