import * as React from "react";
import * as Colors from "../../../componentsBase/style/Colors";
import BtnBadge from "../../../componentsBase/BtnBadge";
import { CdnPublishedStatus, IFile } from "../../../interfaces";
import { ContextDispatchViewport } from "../contexts";
import { ACT_VPORT } from "../reducer";

interface IBadgeShareUrls {
  data: IFile;
  className?: string;
  style?: React.CSSProperties;
}

const BadgeShareUrls = ({ data, className, style }: IBadgeShareUrls) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const { id, publicshares, cdnPublishedStatus } = data;
  const onClick = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.MODAL_SHARE_LINK, ids: [id] });
  }, [dispatchViewport, id]);

  if (
    !publicshares?.find((p) => p.root) &&
    cdnPublishedStatus !== CdnPublishedStatus.PUBLISHED
  )
    return null;

  return (
    <BtnBadge
      color={Colors.Cyan}
      className={className}
      style={style}
      tooltip="Get link"
      icon="link"
      iconStyle={{ transform: "rotate(-45deg)" }}
      onClick={onClick}
    />
  );
};

export default BadgeShareUrls;
