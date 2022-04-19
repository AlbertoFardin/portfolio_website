import * as React from "react";
import Btn from "../../../componentsBase/Btn";
import { v4 as uuidv4 } from "uuid";
import { IItemEs, IItemStagingArea, Severity } from "../../../interfaces";
import { colorTheme } from "../../../constants";
import { massiveDownloadRenamedSeecommerce } from "../../../api/fetchesApi";
import { ACTION_MAIN } from "../../reducer";
import { getWebSocketConnectionId } from "../../webSocket";
import {
  ContextDispatchMain,
  ContextPermissions,
  ContextSetSnackbar,
} from "../../contexts";
import PERMISSIONS from "../../../permissions";
import permissionsCheck from "../../../utils/permissionsCheck";
import searchES from "../searchES";
import isEmpty from "lodash-es/isEmpty";

const idDownloadMedia = "idDownloadMedia";

interface IGridActionsBar {
  itemsIdSelected: string[];
}

const GridActionsBar = ({ itemsIdSelected = [] }: IGridActionsBar) => {
  const dispatchMain = React.useContext(ContextDispatchMain);
  const setSnackbar = React.useContext(ContextSetSnackbar);

  const [clickId, setClickId] = React.useState("");
  const cbOnDownloadMedia = React.useCallback(
    () => setClickId(idDownloadMedia),
    []
  );
  const permissions = React.useContext(ContextPermissions);
  const canDownload = permissionsCheck({
    keys: [PERMISSIONS.seecommerce_download],
    permissions,
  });

  React.useEffect(() => {
    if (clickId === idDownloadMedia) {
      (async () => {
        // get media all updated
        const { items } = await searchES({
          query: { terms: { _id: itemsIdSelected } },
        });
        const mediaContents = items.map((i: IItemEs<IItemStagingArea>) => {
          const { fileId, filename } = i.data;
          return { fileId, path: [], customName: filename };
        });

        setClickId("");

        const correlationId = uuidv4();
        try {
          await massiveDownloadRenamedSeecommerce({
            correlationId,
            mediaContents,
            connectionId: getWebSocketConnectionId(),
          });

          // aggiungo al componente multiDownload l'elemento da mostrare
          dispatchMain({
            type: ACTION_MAIN.DOWNLOADS_TO_ADD,
            payload: {
              correlationId,
              filename: `${correlationId}.zip`,
            },
          });
        } catch (err) {
          setSnackbar(
            Severity.WARNING,
            "Unable to download media, please refresh and retry"
          );
        }
      })();
    }
  }, [clickId, dispatchMain, itemsIdSelected, setSnackbar]);

  if (!canDownload || isEmpty(itemsIdSelected)) return null;

  return (
    <Btn
      color={colorTheme}
      icon="file_download"
      tooltip="Download media"
      onClick={cbOnDownloadMedia}
    />
  );
};

export default React.memo(GridActionsBar);
