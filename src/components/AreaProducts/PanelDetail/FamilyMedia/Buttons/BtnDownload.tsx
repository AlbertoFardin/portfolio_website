import Btn from "../../../../../componentsBase/Btn";
import * as React from "react";
import { ContextPermissions } from "../../../../contexts";
import { IMedia } from "../../../../../interfaces";
import PERMISSIONS from "../../../../../permissions";
import downloadMedia from "../../../../../utils/downloadMedia";
import permissionsCheck from "../../../../../utils/permissionsCheck";
import apiUrls from "../../../../../api/endpoints";

interface IBtnDownload {
  disabled?: boolean;
  mediaSelected: IMedia;
}
const BtnDownload = ({ disabled = false, mediaSelected }: IBtnDownload) => {
  const onCbClick = React.useCallback(() => {
    const srcUrl = apiUrls.getDownloadProductMedia.url(mediaSelected.fileId);
    downloadMedia(mediaSelected.filename, srcUrl);
  }, [mediaSelected.fileId, mediaSelected.filename]);
  const permissions = React.useContext(ContextPermissions);
  const canDownload = permissionsCheck({
    keys: [PERMISSIONS.seecommerce_download],
    permissions,
  });

  if (!canDownload) return null;

  return (
    <Btn
      disabled={disabled}
      tooltip="Download"
      icon="file_download"
      onClick={onCbClick}
    />
  );
};

export default BtnDownload;
