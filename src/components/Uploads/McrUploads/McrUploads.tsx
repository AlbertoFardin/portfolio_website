import isEmpty from "lodash-es/isEmpty";
import * as React from "react";

import IFileStatus from "../IFileStatus";
import { ACTIONS, reducer, reducerInitState } from "./reducer";
import ModalUploads from "../ModalUploads";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { getSignedUrl, mcrConfirm } from "../../../api/fetchesApi";
import IUploadFile from "../IUploadFile";
import apiUrls from "../../../api/endpoints";
import { Service } from "../../../interfaces";

const useStyles = makeStyles({
  multiUploads: {
    bottom: 75,
  },
});

const MultiUploads = ({ uploads }: { uploads: IUploadFile[] }) => {
  const classes = useStyles({});

  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const { expanded, items, msgStopUpload } = state;

  const onPutS3File = React.useCallback(async (file: IUploadFile, data) => {
    const { fileId } = data;
    await mcrConfirm(fileId, Service.SEECOMMERCE, file);
  }, []);

  const isUploading = !!items.find((el) => {
    const fSet = new Set([IFileStatus.Uploading, IFileStatus.Waiting]);
    return fSet.has(el.status);
  });
  const onStopUploads = React.useCallback(() => {
    dispatch({ type: ACTIONS.RESET });
  }, []);
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

  React.useEffect(() => {
    if (!isEmpty(uploads)) {
      dispatch({
        type: ACTIONS.ADD_ITEMS,
        uploads,
      });
    }
  }, [uploads]);

  if (isEmpty(items)) return null;

  return (
    <ModalUploads
      className={classes.multiUploads}
      items={items}
      getSignedUrl={getSignedUrl(apiUrls.newUploadSC)}
      onPutS3File={onPutS3File}
      uploadRequestHeaders={{}}
      expanded={expanded}
      onCloseToolbar={onCloseUploads}
      onExpand={toggleExpanded}
      onUpdateFileStatus={onUpdateFileStatus}
      msgStopUpload={msgStopUpload}
      onContinue={onContinue}
      onStopUploads={onStopUploads}
    />
  );
};

export default MultiUploads;
