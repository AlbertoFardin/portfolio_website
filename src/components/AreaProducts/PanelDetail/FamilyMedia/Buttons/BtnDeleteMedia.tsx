import * as React from "react";
import Btn from "../../../../../componentsBase/Btn";
import * as Colors from "../../../../../componentsBase/style/Colors";
import ModalDeleteMedia from "../../../../ModalMediasDelete";
import {
  IProduct,
  IMedia,
  IReady,
  MediaType,
  IPermission,
  Severity,
} from "../../../../../interfaces";
import { deleteMedias } from "../../../../../api/fetchesApi";
import { KEY_READY } from "../../../../../constants";
import getMediasGroupped from "../getMediasGroupped";
import { ContextPermissions, ContextSetSnackbar } from "../../../../contexts";
import permissionsCheck from "../../../../../utils/permissionsCheck";
import PERMISSIONS from "../../../../../permissions";

interface ICanDeleteThisMedia {
  media: IMedia;
  permissions: IPermission[];
}
const canDeleteThisMedia = ({
  media,
  permissions,
}: ICanDeleteThisMedia): boolean => {
  const { mediaType } = media;
  if (mediaType === MediaType.IMAGE_S) {
    const havePermission = permissionsCheck({
      keys: [PERMISSIONS.seecommerce_manage_shooting_media],
      permissions,
    });
    return havePermission;
  }
  if (mediaType === MediaType.IMAGE_P) {
    const havePermission = permissionsCheck({
      keys: [PERMISSIONS.seecommerce_manage_post_production_media],
      permissions,
    });
    return havePermission;
  }
  return true;
};

interface IBtnDeleteMedia {
  disabled?: boolean;
  assetData: IProduct;
  mediaSelected: IMedia;
  setImageId: (s: string) => void;
}

const BtnDeleteMedia = ({
  disabled,
  assetData,
  mediaSelected,
  setImageId,
}: IBtnDeleteMedia) => {
  const setSnackbar = React.useContext(ContextSetSnackbar);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const ready = (assetData[KEY_READY] || []) as IReady[];
  const imageIsReady = !!ready.find(
    ({ contentId }) => contentId === mediaSelected.fileId
  );
  const onModalOpen = React.useCallback(() => setModalOpen(true), []);
  const onConfirm = React.useCallback(() => setDeleting(true), []);
  const onCancel = React.useCallback(() => setModalOpen(false), []);
  const checks = [
    {
      id: "check2",
      label: "Media will be deleted from all associated products",
    },
  ];
  const permissions = React.useContext(ContextPermissions);
  const canDelete = canDeleteThisMedia({
    media: mediaSelected,
    permissions,
  });

  if (imageIsReady) {
    checks.push({
      id: "check1",
      label: "Ready status will be removed for this product view",
    });
  }

  React.useEffect(() => {
    (async () => {
      if (deleting) {
        let deleteSuccessful = false;
        try {
          await deleteMedias([
            { id: mediaSelected.fileId, mediatype: mediaSelected.mediaType },
          ]);
          setSnackbar(Severity.SUCCESS, "Deleted successfully");
          deleteSuccessful = true;
        } catch (err) {
          setSnackbar(
            Severity.WARNING,
            "Unable to delete media, please refresh and retry"
          );
          console.log("BtnDeleteMedia ->", err);
        }

        setModalOpen(false);
        setDeleting(false);

        // disable the deleted media and change selection
        if (deleteSuccessful) {
          const histories = getMediasGroupped(assetData);
          const historySelected = Array.from(
            histories.find((h) => h[0].view === mediaSelected.view)
          );
          const [mediaPlaceholder, media1, media2] = historySelected;
          const media1IsDeleted = media1.fileId === mediaSelected.fileId;
          let newEastPanelImage = mediaPlaceholder;

          if (media1 && !media1IsDeleted) newEastPanelImage = media1;
          if (media1 && media2 && media1IsDeleted) newEastPanelImage = media2;

          setImageId(newEastPanelImage.fileId);
        }
      }
    })();
  }, [
    assetData,
    deleting,
    mediaSelected.fileId,
    mediaSelected.mediaType,
    mediaSelected.view,
    setImageId,
    setSnackbar,
  ]);

  return (
    <>
      <Btn
        disabled={disabled || !canDelete}
        color={Colors.Red}
        icon="delete"
        tooltip={
          canDelete
            ? "Delete"
            : "You don’t have permission to delete this media type"
        }
        onClick={onModalOpen}
      />
      <ModalDeleteMedia
        open={modalOpen}
        loading={deleting}
        medias={[mediaSelected]}
        checks={checks}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </>
  );
};

export default BtnDeleteMedia;
