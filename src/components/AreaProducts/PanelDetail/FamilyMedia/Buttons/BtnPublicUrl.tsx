import Btn from "../../../../../componentsBase/Btn";
import * as Colors from "../../../../../componentsBase/style/Colors";
import * as React from "react";
import getCatalogsByContentId from "../../../../../utils/getCatalogsByContentId";
import { KEY_READY, KEY_MEDIA } from "../../../../../constants";
import {
  IProduct,
  IMedia,
  IReady,
  DistributionStatus,
  Severity,
} from "../../../../../interfaces";
import { setDistribution } from "../../../../../api/fetchesApi";
import isEmpty from "lodash-es/isEmpty";
import { ContextPermissions, ContextSetSnackbar } from "../../../../contexts";
import PERMISSIONS from "../../../../../permissions";
import permissionsCheck from "../../../../../utils/permissionsCheck";

enum ClickStatus {
  DONE = "DONE",
  RESTORE = "RESTORE",
  DISABLE = "DISABLE",
}

interface IBtnPublicUrl {
  assetData: IProduct;
  imageId: string;
}

const BtnPublicUrl = ({ assetData, imageId }: IBtnPublicUrl) => {
  const setSnackbar = React.useContext(ContextSetSnackbar);

  const [click, setClick] = React.useState(ClickStatus.DONE as ClickStatus);
  const readyCount = getCatalogsByContentId({
    catalogs: (assetData[KEY_READY] || []) as IReady[],
    contentId: imageId,
  }).length;
  const medias = (assetData[KEY_MEDIA] || []) as IMedia[];
  const media = medias.find(({ fileId }) => fileId === imageId);
  const { fileId, view, distribution, distributionStatus } = media || {};
  const onCopy = React.useCallback(() => {
    setSnackbar(Severity.INFO, "Public URL copied to the clipboard");
  }, [setSnackbar]);
  const onDisable = React.useCallback(() => {
    setClick(ClickStatus.DISABLE);
    setSnackbar(Severity.SUCCESS, "Public URL will be disabled");
  }, [setSnackbar]);
  const onRestore = React.useCallback(() => {
    setClick(ClickStatus.RESTORE);
    setSnackbar(Severity.SUCCESS, "Public URL will be restored");
  }, [setSnackbar]);
  const permissions = React.useContext(ContextPermissions);
  const canEdit = permissionsCheck({
    keys: [PERMISSIONS.seecommerce_manage_share_link],
    permissions,
  });

  React.useEffect(() => {
    (async () => {
      if (click !== ClickStatus.DONE) {
        try {
          const res = await setDistribution({
            fileId: fileId,
            viewName: view,
            entityId: assetData.id,
            version: assetData.version,
            disable: click === ClickStatus.DISABLE,
          });
          if (res.error) throw res.error;

          setClick(ClickStatus.DONE);
        } catch (err) {
          setSnackbar(Severity.WARNING, "Unable to set public Url");
          console.log("BtnPublicUrl ->", err);
        }
      }
    })();
  }, [assetData.id, assetData.version, click, fileId, setSnackbar, view]);

  if (!readyCount || isEmpty(media)) return null;

  const disabledBtn =
    distributionStatus !== DistributionStatus.DONE ||
    click !== ClickStatus.DONE;
  const disabledLink =
    distributionStatus === DistributionStatus.DONE && !distribution;
  let icon = "link_off";
  const menuItems = [];

  if (fileId) {
    if (disabledLink) {
      menuItems.push({
        id: "restore",
        label: "Enable file link",
        onClick: onRestore,
      });
    } else {
      icon = "link";
      menuItems.push({
        id: "copy",
        label: "Copy file link",
        onClick: onCopy,
        copyToClipboard: distribution && distribution.original,
      });
      menuItems.push({
        id: "disable",
        label: "Disable file link",
        onClick: onDisable,
      });
    }
  }

  return canEdit ? (
    <Btn
      icon={icon}
      iconStyle={{ transform: "rotate(-45deg)" }}
      color={Colors.Cyan}
      tooltip="File link"
      disabled={disabledBtn}
      menu={{
        items: menuItems,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
        transformOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      }}
    />
  ) : (
    <Btn
      icon={icon}
      iconStyle={{ transform: "rotate(-45deg)" }}
      color={Colors.Cyan}
      tooltip="Copy file link"
      disabled={disabledBtn}
      copyToClipboard={distribution && distribution.original}
      onClick={onCopy}
    />
  );
};

export default BtnPublicUrl;
