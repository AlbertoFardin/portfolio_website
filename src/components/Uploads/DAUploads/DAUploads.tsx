import isEmpty from "lodash-es/isEmpty";
import * as React from "react";

import IFileStatus from "../IFileStatus";

import {
  ACTIONS,
  CURRENT_FOLDER_TO_UPLOAD,
  reducer,
  reducerInitState,
} from "./reducer";
import ModalUploads from "../ModalUploads";
import makeStyles from "@material-ui/core/styles/makeStyles";
import getMimeType, { OCTET_STREAM_MIMETYPE } from "../utils/getMimeType";
import { ACTION_MAIN } from "../../reducer";
import apiUrls from "../../../api/endpoints";

import {
  createFile,
  createFolder,
  getSignedUrl,
  mcrConfirm,
} from "../../../api/fetchesApi";
import IUploadsDA from "./IUploadsDA";
import { getParentId, getPathArray, SEPARATOR } from "./utils";
import { IUploadFile } from "..";
import { useLocation } from "react-router-dom";
import { getPathId } from "../../AreaFiles/getUpdatedPath";
import { FileSection, Service } from "../../../interfaces";
import { ROOT_MYFILE_ID } from "../../AreaFiles/constants";
import { ContextDispatchMain } from "../../contexts";

// TODO: verificare cosa fa.
const fixMimeType = (type: string, name: string) =>
  type && type !== OCTET_STREAM_MIMETYPE ? type : getMimeType(name);

const useStyles = makeStyles({
  multiUploads: {
    bottom: 75,
  },
});

const DAUploads = ({ uploadsDA }: { uploadsDA: IUploadsDA }) => {
  const classes = useStyles({});
  const dispatchMain = React.useContext(ContextDispatchMain);

  const location = useLocation();
  const { pathname } = location;
  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const {
    expanded,
    items,
    msgStopUpload,
    relativePathsFolderId,
    mapFileIdSaved,
  } = state;

  /**
   * Alla conclusione di tutti i file da caricare ricarico il content
   * solo se mi trovo in una cartella contenente almeno un file appena caricato.
   */
  const onFinish = React.useCallback(() => {
    const currentFolder = getPathId(pathname);
    const setFileFolderIds = new Set(
      relativePathsFolderId
        .filter((r) => r.folderId !== undefined)
        .map(({ folderId }) =>
          folderId === ROOT_MYFILE_ID ? FileSection.MY_FILES : folderId
        )
    );

    if (setFileFolderIds.has(currentFolder))
      dispatchMain({
        type: ACTION_MAIN.REFRESH_TIME,
        time: new Date().getTime(),
      });
  }, [dispatchMain, pathname, relativePathsFolderId]);

  /**
   * Alla conclusione del file caricato su S3,
   * se il suo (id+sessionUploadId) non è presente nella mappa mapFileIdSaved
   * dei file già caricati in DA, allora lo creo
   */
  const onPutS3File = React.useCallback(
    async (ifile: IUploadFile, data) => {
      const { fileId } = data;
      const { id, file, sessionUploadId } = ifile;
      const { type, name, webkitRelativePath } = file;

      if (!mapFileIdSaved[id + sessionUploadId]) {
        await mcrConfirm(fileId, Service.DIGITALASSETS, ifile);
        const mimeType = fixMimeType(type, name);

        const relPathFile =
          webkitRelativePath === ""
            ? CURRENT_FOLDER_TO_UPLOAD
            : getPathArray(webkitRelativePath).join(SEPARATOR);
        const { folderId } = relativePathsFolderId.find(
          ({ name: relFolder, sessionUploadId: sessFolder }) =>
            (relPathFile === CURRENT_FOLDER_TO_UPLOAD ||
              relFolder === relPathFile) &&
            sessFolder === sessionUploadId
        );

        await createFile({
          file,
          fileId,
          fileMimeType: mimeType,
          folderId,
        });
        dispatch({ type: ACTIONS.SAVED_IN_DA, id: id + sessionUploadId });
      }
    },
    [relativePathsFolderId, mapFileIdSaved]
  );

  const isUploading = !!items.find((el) => {
    const fSet = new Set([IFileStatus.Uploading, IFileStatus.Waiting]);
    return fSet.has(el.status);
  });
  const onStopUploads = React.useCallback(() => {
    dispatch({ type: ACTIONS.RESET });
    dispatchMain({
      type: ACTION_MAIN.REFRESH_TIME,
      time: new Date().getTime(),
    });
  }, [dispatchMain]);
  const onContinue = React.useCallback(() => {
    dispatch({ type: ACTIONS.MSG_CLOSE });
  }, []);
  const onUpdateFileStatus = React.useCallback(
    (index: number, ifile: IUploadFile) => {
      dispatch({
        type: ACTIONS.SET_ITEMS,
        ifile,
      });
    },
    []
  );
  const onCloseUploads = React.useCallback(() => {
    if (isUploading) {
      dispatch({ type: ACTIONS.MSG_OPEN });
    } else {
      dispatch({ type: ACTIONS.RESET });
    }
  }, [isUploading]);
  const toggleExpanded = React.useCallback(() => {
    dispatch({ type: ACTIONS.EXPANDED });
  }, []);

  // creazione delle sottocartelle
  React.useEffect(() => {
    (async () => {
      const sortFolderWithoutFolderIds = relativePathsFolderId
        .filter(({ folderId }) => folderId === undefined)
        .sort(
          (a, b) =>
            a.name.split(SEPARATOR).length - b.name.split(SEPARATOR).length
        );

      if (sortFolderWithoutFolderIds.length > 0) {
        // PER ORA CREO UNA CARTELLA ALLA VOLTA
        const {
          name: nameFolderToCreate,
          sessionUploadId: sessionUploadIdToCreate,
        } = sortFolderWithoutFolderIds[0];

        const aFirstF = nameFolderToCreate.split(SEPARATOR);
        const nameFolder = aFirstF[aFirstF.length - 1];

        const parentId = getParentId(
          aFirstF,
          sessionUploadIdToCreate,
          relativePathsFolderId
        );
        const { id } = await createFolder({ name: nameFolder, parentId });
        dispatch({
          type: ACTIONS.UPDATE_FOLDER_ID_AND_FILE_UPLOADING,
          nameFolderToCreate,
          folderId: id,
        });
      }
    })();
  }, [relativePathsFolderId]);

  // effetto per aggiungere ulteriori file da caricare
  React.useEffect(() => {
    if (uploadsDA.ifiles && !isEmpty(uploadsDA.ifiles)) {
      dispatch({
        type: ACTIONS.ADD_ITEMS,
        uploadsDA,
      });
    }
  }, [uploadsDA]);

  if (isEmpty(items)) return null;

  return (
    <ModalUploads
      className={classes.multiUploads}
      items={items}
      getSignedUrl={getSignedUrl(apiUrls.newUploadDA)}
      onPutS3File={onPutS3File}
      uploadRequestHeaders={{}}
      expanded={expanded}
      onCloseToolbar={onCloseUploads}
      onExpand={toggleExpanded}
      onUpdateFileStatus={onUpdateFileStatus}
      msgStopUpload={msgStopUpload}
      onContinue={onContinue}
      onStopUploads={onStopUploads}
      onFinish={onFinish}
    />
  );
};

export default DAUploads;
