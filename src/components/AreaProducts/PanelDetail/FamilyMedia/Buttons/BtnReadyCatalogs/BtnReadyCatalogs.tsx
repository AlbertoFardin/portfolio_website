import * as React from "react";
import isEmpty from "lodash-es/isEmpty";
import concat from "lodash-es/concat";
import sortByKey from "../../../../../../utils/sortByKey";
import {
  IProduct,
  IReady,
  IMedia,
  ContentType,
  Severity,
  IViewDetail,
} from "../../../../../../interfaces";
import { KEY_MEDIA, KEY_READY } from "../../../../../../constants";
import { setReady, deleteReady } from "../../../../../../api/fetchesApi";
import getMediaSelected from "../../getMediaSelected";
import ModalReadyCatalogs from "./ModalReadyCatalogs";
import IMediaCatalog from "./IMediaCatalog";
import Button from "./Button";
import reducer, { reducerInitState, ACTION } from "./reducer";
import {
  ContextPermissions,
  ContextSetSnackbar,
} from "../../../../../contexts";
import PERMISSIONS from "../../../../../../permissions";
import permissionsCheck from "../../../../../../utils/permissionsCheck";
import getCatalogLabel from "./getCatalogLabel";
import { ContextCatalogs } from "../../../../contexts";

interface IBtnReadyCatalogs {
  assetData: IProduct;
  imageId: string;
  historySelected: IMedia[];
  disabled?: boolean;
  viewDetail: IViewDetail;
}
const BtnReadyCatalogs = ({
  assetData,
  imageId,
  historySelected,
  disabled = false,
  viewDetail,
}: IBtnReadyCatalogs) => {
  const catalogsTenant = React.useContext(ContextCatalogs);
  const setSnackbar = React.useContext(ContextSetSnackbar);

  const mediaSelected = getMediaSelected({
    imageId,
    assetData,
  });
  const mediaSelectedId = !mediaSelected ? "" : mediaSelected.fileId;
  const mediaSelectedView = (mediaSelected && mediaSelected.view) || "";
  const readys = (assetData[KEY_READY] || []) as IReady[];
  const catalogsView = (viewDetail.catalog || []).filter((c: string) => {
    // check if the catalog still exists among the catalogs' tenant
    return !!catalogsTenant.find(({ id }) => id === c);
  });
  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const {
    menuAnchor,
    loading,
    fetching,
    catalogsPendingToAdd,
    catalogsPendingToRemove,
  } = state;
  const assetDataId = assetData.id;
  const assetDataVersion = assetData.version;
  const catalogsFormated: IMediaCatalog[] = sortByKey(
    catalogsView.map((catId: string) => {
      const cReady = readys.filter(
        (r: IReady) =>
          r.catalog === catId && r.contentType === ContentType.MEDIA
      );
      const cReadyMedia = cReady.reduce((acc: IMedia[], r: IReady) => {
        const medias = assetData[KEY_MEDIA] || [];
        const media = medias.find((m: IMedia) => r.contentId === m.fileId);
        if (media) acc.push(media);
        return acc;
      }, []);
      const label = getCatalogLabel({
        catalogsView: [catId],
        catalogsTenant,
      });

      return {
        id: catId,
        label: label,
        media: cReadyMedia,
      };
    }),
    "label"
  );
  const cbOnMenuOpen = React.useCallback((event: React.MouseEvent) => {
    dispatch({ type: ACTION.MENU_CHANGE_ANCHOR, value: event.target });
  }, []);
  const cbOnMenuClose = React.useCallback(() => {
    dispatch({ type: ACTION.MENU_CHANGE_ANCHOR, value: null });
  }, []);
  const cbOnMenuConfirm = React.useCallback(
    (toAdd: IMediaCatalog[], toRemove: IMediaCatalog[]) => {
      dispatch({ type: ACTION.MENU_SELECT_CATALOGS, toAdd, toRemove });
    },
    []
  );
  const permissions = React.useContext(ContextPermissions);
  const canEdit = permissionsCheck({
    keys: [PERMISSIONS.seecommerce_manage_media_ready],
    permissions,
  });

  React.useEffect(() => {
    if (assetData) {
      dispatch({ type: ACTION.RESET });
    }
  }, [assetData]);

  React.useEffect(() => {
    (async () => {
      const pendingCatalogIds = concat(
        catalogsPendingToAdd,
        catalogsPendingToRemove
      ).map(({ id }) => id);
      if (!isEmpty(pendingCatalogIds) && !fetching) {
        dispatch({ type: ACTION.FETCH });
        try {
          let snackbarText = "";
          const config = {
            idType: ContentType.MEDIA,
            entityId: assetDataId,
            id: mediaSelectedId,
            catalogs: pendingCatalogIds,
            version: assetDataVersion,
          };

          if (!isEmpty(catalogsPendingToRemove)) {
            const res = await deleteReady(config);
            if (res.error) {
              throw res.error;
            }
            snackbarText = `The media was set not Ready for ${catalogsPendingToRemove.length} catalogs`;
          }
          if (!isEmpty(catalogsPendingToAdd)) {
            const res = await setReady(config);
            if (res.error) throw res.error;
            snackbarText = `This media was set Ready for ${catalogsPendingToAdd.length} catalogs`;
          }

          setSnackbar(Severity.SUCCESS, snackbarText);
        } catch (err) {
          setSnackbar(
            Severity.WARNING,
            "Unable to apply Ready Status, please refresh and retry"
          );
        }
        dispatch({ type: ACTION.RESET });
      }
    })();
  }, [
    assetDataId,
    assetDataVersion,
    catalogsPendingToAdd,
    catalogsPendingToRemove,
    fetching,
    mediaSelectedId,
    setSnackbar,
  ]);

  if (!canEdit) return null;

  return (
    <>
      <Button
        onChange={cbOnMenuConfirm}
        onClick={cbOnMenuOpen}
        catalogsTenant={catalogsTenant}
        catalogsView={catalogsView}
        readys={readys}
        disabled={
          disabled ||
          loading ||
          !isEmpty(catalogsPendingToAdd) ||
          !isEmpty(catalogsPendingToRemove)
        }
        mediaIdSelected={mediaSelectedId}
      />
      <ModalReadyCatalogs
        open={!!menuAnchor}
        anchorEl={menuAnchor}
        mediaIds={historySelected.map((h) => h.fileId)}
        mediaIdSelected={mediaSelectedId}
        loading={loading}
        catalogs={catalogsFormated}
        viewId={mediaSelectedView}
        onClose={cbOnMenuClose}
        onConfirm={cbOnMenuConfirm}
      />
    </>
  );
};

export default BtnReadyCatalogs;
