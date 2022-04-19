import * as React from "react";
import BtnBadge from "../../../componentsBase/BtnBadge";
import { IFile, Service } from "../../../interfaces";
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
      window.open(
        apiUrls.getRendition.url(documentRepoId, Service.DIGITALASSETS),
        "_blanck"
      );
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
