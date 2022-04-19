import * as React from "react";
import Divider from "@material-ui/core/Divider";
import Toolbar from "@material-ui/core/Toolbar";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import Content from "./Content";
import makeStyles from "@material-ui/core/styles/makeStyles";
import reducer, { reducerInitState, ACT_VPORT } from "./reducer";
import { Severity, IArea, FileSection } from "../../interfaces";
import useSearchFiles from "./useSearchFiles";
import ToolbarHeader from "./ToolbarHeader";
import isEmpty from "lodash-es/isEmpty";
import { useHistory, useLocation } from "react-router-dom";
import { TYPE_FOLDER } from "../../constants";
import ModalCreateFolder from "./ModalCreateFolder";
import ModalDelete from "./ModalDelete";
import ModalRename from "./ModalRename";
import ModalShareLink from "./ModalShareLink";
import ModalSharePrivate from "./ModalSharePrivate";
import ModalCopyright from "./ModalCopyright";
import ModalTag from "./ModalTag";
import last from "lodash-es/last";
import { massiveDownloadFromDA, moveItems } from "../../api/fetchesApi";
import {
  getWebSocketConnectionId,
  registerWebSocketCallback,
  unregisterWebSocketCallback,
} from "../webSocket";
import { v4 as uuidv4 } from "uuid";
import { ACTION_MAIN } from "../reducer";
import websocketCallbacks from "./webSocketCallbacks";
import ModalTagManagement from "./ModalTagManagement";
import {
  ContextCurrentUser,
  ContextDispatchMain,
  ContextSetSnackbar,
} from "../contexts";
import PanelDetail from "./PanelDetail";
import PanelOption from "./PanelOption";
import { getPathId, getUpdatedPath } from "./getUpdatedPath";
import isFiltered from "../FiltersChips/isFiltered";
import { ROOT_MYFILE_ID } from "./constants";
import { ContextDispatchViewport } from "./contexts";

const useStyles = makeStyles({
  viewport: {
    flex: 1,
    position: "relative",
    display: "flex",
    "flex-direction": "column",
  },
  fallback: {
    position: "relative",
    flex: 1,
    display: "flex",
    "flex-direction": "column",
    "align-items": "center",
    "justify-content": "center",
  },
  fallbackEmoji: {
    height: 80,
    "font-size": "60px !important",
  },
});

const Area = (p: IArea) => {
  const dispatchMain = React.useContext(ContextDispatchMain);
  const setSnackbar = React.useContext(ContextSetSnackbar);
  const userProfile = React.useContext(ContextCurrentUser);

  const userId = userProfile.id;

  const classes = useStyles({});
  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const {
    refreshTime,
    items,
    itemsIdSelected,
    itemsTotal,
    downloadItems,
    cuttedFile,
    cuttedPath,
    pastingItems,
    filters,
    filtersConditions,
    filtersThisFolder,
    path,
    sort,
    paginationSize,
    paginationValue,
    modalCreateFolder,
    modalDelete,
    modalRename,
    modalShareLink,
    modalSharePrivate,
    modalCopyright,
    modalTag,
    modalTagManagement,
    detailSheet,
  } = state;
  const assetDataId = last(itemsIdSelected);

  const history = useHistory();
  const location = useLocation();
  const { pathname } = location;
  const pathId = getPathId(pathname);
  const { setSearchTime, searchRes } = useSearchFiles({
    userId,
    pathId,
    filters,
    filtersConditions,
    filtersThisFolder,
    paginationValue,
    paginationSize,
    sort,
  });
  const serializedFilterValues = JSON.stringify(
    filters.map(({ id, label, value }) => ({ id, label, value }))
  );
  const filtered: boolean = React.useMemo(() => isFiltered(filters), [filters]);
  const loading = searchRes.status === "loading";
  const folderNotExist = !!searchRes.result && !searchRes.result.success;

  // torna a casa Lassie!
  React.useEffect(() => {
    if (!pathId) {
      const sectionId = Object.values(FileSection)[0];
      history.push(getUpdatedPath(sectionId));
    }
  }, [pathId, history]);

  // refresh content on refreshTime changed
  React.useEffect(() => {
    if (p.refreshTime) setSearchTime(p.refreshTime);
  }, [p.refreshTime, setSearchTime]);
  React.useEffect(() => {
    if (refreshTime) setSearchTime(refreshTime);
  }, [refreshTime, setSearchTime]);

  // get items on change filters
  React.useEffect(() => {
    if (serializedFilterValues) setSearchTime(new Date().getTime());
  }, [serializedFilterValues, setSearchTime]);

  // get items in initialization or change condition
  React.useEffect(() => {
    if (
      filtersConditions ||
      filtersThisFolder ||
      paginationSize ||
      paginationValue ||
      sort
    ) {
      setSearchTime(new Date().getTime());
    }
  }, [
    filtersConditions,
    filtersThisFolder,
    paginationSize,
    paginationValue,
    setSearchTime,
    sort,
  ]);

  // get items durin nagivation or change url
  React.useEffect(() => {
    if (pathname) {
      dispatch({ type: ACT_VPORT.FOLDER_NAVIGATE });
    }
  }, [pathname, setSearchTime]);

  // save new items in reducer after fetch
  React.useEffect(() => {
    if (searchRes.result && searchRes.result.success) {
      dispatch({ type: ACT_VPORT.SET, data: searchRes.result });
    }
  }, [userId, searchRes.result]);

  // manage paste items
  React.useEffect(() => {
    (async () => {
      if (pastingItems) {
        const pathId = last(path).id;
        const newParentFolder = pathId === ROOT_MYFILE_ID ? undefined : pathId;

        if (cuttedPath !== newParentFolder) {
          await moveItems({
            oldParentFolder: cuttedPath,
            newParentFolder,
            idsFileAndFolder: cuttedFile.map(({ id, mimeType }) => ({
              id,
              isFolder: mimeType === TYPE_FOLDER,
            })),
          });
        }
        dispatch({
          type: ACT_VPORT.PASTED,
          ids: cuttedFile.map(({ id }) => id),
        });
      }
    })();
  }, [cuttedFile, cuttedPath, pastingItems, path]);

  // manage archiver downloads
  React.useEffect(() => {
    (async () => {
      if (!isEmpty(downloadItems)) {
        const correlationId = uuidv4();
        try {
          await massiveDownloadFromDA({
            correlationId,
            downloadItems,
            connectionId: getWebSocketConnectionId(),
            currentFolders: path,
          });
          dispatch({ type: ACT_VPORT.DOWNLOAD_RESET });
          dispatchMain({
            type: ACTION_MAIN.DOWNLOADS_TO_ADD,
            payload: {
              correlationId,
              filename: `${correlationId}.zip`,
            },
          });
        } catch (err) {
          if (err.status === 400) {
            const resText = await err.response.json();
            setSnackbar(Severity.ERROR, resText);
          } else {
            console.error(err);
          }
          dispatch({ type: ACT_VPORT.DOWNLOAD_RESET });
        }
      }
    })();
  }, [dispatchMain, downloadItems, path, setSnackbar]);

  // add websocket listener
  React.useEffect(() => {
    websocketCallbacks.forEach((x) => {
      registerWebSocketCallback({
        id: x.id,
        callback: x.callback,
        dispatch,
      });
    });

    return () => {
      websocketCallbacks.forEach((x) => {
        unregisterWebSocketCallback(x.id);
      });
    };
  }, []);

  return (
    <ContextDispatchViewport.Provider value={dispatch}>
      <PanelOption
        path={path}
        filters={filters}
        filtersConditions={filtersConditions}
        filtersThisFolder={filtersThisFolder}
        filtersVisibled={!folderNotExist}
      />
      {folderNotExist ? (
        <div className={classes.viewport}>
          <Toolbar />
          <Divider />
          <div className={classes.fallback}>
            <Icon className={classes.fallbackEmoji} children="🤭" />
            <Typography
              variant="body1"
              children="The requested URL could not be found on this server"
            />
            <Typography
              variant="caption"
              children="No other information available"
            />
          </div>
          <Divider />
          <Toolbar />
        </div>
      ) : (
        <div className={classes.viewport}>
          <ToolbarHeader
            filters={filters}
            path={path}
            detailSheet={detailSheet}
            items={items}
            itemsIdSelected={itemsIdSelected}
            itemsTotal={itemsTotal}
            cuttedFile={cuttedFile}
            cuttedPath={cuttedPath}
            filtered={filtered}
            paginationSize={paginationSize}
            paginationValue={paginationValue}
            assetDataId={assetDataId}
          />
          <Content
            items={items}
            itemsTotal={itemsTotal}
            itemsIdSelected={itemsIdSelected}
            cuttedFile={cuttedFile}
            cuttedPath={cuttedPath}
            sort={sort}
            path={path}
            filters={filters}
            assetDataId={assetDataId}
            detailSheet={detailSheet}
            loading={loading}
          />
        </div>
      )}
      <PanelDetail
        detailSheet={detailSheet}
        assetDataId={assetDataId}
        items={items}
        path={path}
      />
      <ModalCreateFolder open={modalCreateFolder} folders={path} />
      <ModalDelete
        open={modalDelete}
        items={items}
        itemsIdSelected={itemsIdSelected}
      />
      <ModalRename open={modalRename} assetDataId={assetDataId} />
      <ModalShareLink
        open={modalShareLink}
        items={items}
        assetDataId={assetDataId}
      />
      <ModalSharePrivate
        open={modalSharePrivate}
        itemsIdSelected={itemsIdSelected}
      />
      <ModalCopyright open={modalCopyright} itemsIdSelected={itemsIdSelected} />
      <ModalTag open={modalTag} itemsIdSelected={itemsIdSelected} />
      <ModalTagManagement open={modalTagManagement} />
    </ContextDispatchViewport.Provider>
  );
};

export default Area;
