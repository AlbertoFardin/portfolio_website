import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import * as React from "react";
import IUploadFile from "../IUploadFile";
import ListitemFile from "./ListitemFile";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { IFileStatus } from "..";
import S3Upload from "../utils/S3Upload";
import getMimeType, { OCTET_STREAM_MIMETYPE } from "../utils/getMimeType";

interface IList {
  expanded: boolean;
  files: IUploadFile[];
  uploadRequestHeaders: { [k: string]: string };
  signingUrlMethod?: string;
  getSignedUrl?: (ifile: IUploadFile) => Promise<unknown>;
  onPutS3File?: (ifile: IUploadFile, data) => Promise<unknown>;
  onUpdateFileStatus: (index: number, ifile: IUploadFile) => void;
}

const renderRow = (props: ListChildComponentProps) => {
  const { files, fileState } = props.data;

  const { index, style } = props;
  const obj = files[index];

  const { uploadProgress, puttingS3 } = fileState[props.index] || {
    uploadProgress: 0,
    puttingS3: false,
  };

  return (
    <ListitemFile
      style={style}
      file={obj.file}
      fileStatus={obj.status}
      tooltip={obj.tooltip}
      uploadProgress={uploadProgress}
      puttingS3={puttingS3}
    />
  );
};

interface IFileState {
  puttingS3: boolean;
  uploadProgress: number;
}

const initialState: { fileState: IFileState[] } = { fileState: [] };

const reducer = (state, action): { fileState: IFileState[] } => {
  const newState = { fileState: state.fileState.map((f) => f) };

  switch (action.type) {
    case "update_uploadProgress": {
      const { index, uploadProgress } = action;
      const { puttingS3 } = newState.fileState[index] || {
        puttingS3: false,
      };
      const { uploadProgress: prevUploadProgress } = newState.fileState[
        index
      ] || {
        uploadProgress: 0,
      };
      newState.fileState[index] = {
        puttingS3,
        uploadProgress: Math.max(prevUploadProgress, uploadProgress),
      };

      return newState;
    }
    case "update_puttingS3": {
      const { index, puttingS3 } = action;
      const { uploadProgress } = newState.fileState[index] || {
        uploadProgress: 0,
      };

      newState.fileState[index] = {
        puttingS3,
        uploadProgress,
      };

      return newState;
    }
    default:
      throw new Error();
  }
};

const List = ({
  expanded,
  files,
  getSignedUrl,
  signingUrlMethod,
  onPutS3File,
  onUpdateFileStatus,
  uploadRequestHeaders,
}: IList) => {
  const [{ fileState }, dispatch] = React.useReducer(reducer, initialState);

  const S3UploadRef = React.useRef([]);
  const onUpdate = React.useCallback(
    (index: number, ifile: IUploadFile) => {
      onUpdateFileStatus(index, ifile);
      S3UploadRef.current[index] = undefined;
    },
    [onUpdateFileStatus]
  );
  const getSignedUrlCb = React.useCallback(
    (index: number, ifile: IUploadFile) => async (item, callback) => {
      try {
        const res = await getSignedUrl(ifile);
        callback(res);
      } catch {
        const ifileUpdate = {
          ...ifile,
          status: IFileStatus.Error,
        };
        onUpdate(index, ifileUpdate);
      }
    },
    [getSignedUrl, onUpdate]
  );

  const onUploadFinishS3Put = React.useCallback(
    (index: number, ifile: IUploadFile) => async (data) => {
      let errorInUpload = false;
      if (onPutS3File) {
        dispatch({ type: "update_puttingS3", puttingS3: true, index });
        try {
          await onPutS3File(ifile, data);
        } catch (err) {
          errorInUpload = true;
        }
        dispatch({ type: "update_puttingS3", puttingS3: false, index });
      }

      if (errorInUpload) {
        const ifileUpdate = {
          ...ifile,
          status: IFileStatus.Error,
        };
        onUpdate(index, ifileUpdate);
      } else {
        const ifileUpdate = {
          ...ifile,
          status: IFileStatus.Completed,
        };
        onUpdate(index, ifileUpdate);
      }
    },
    [onPutS3File, onUpdate]
  );
  const onUploadError = React.useCallback(
    (index: number, ifile: IUploadFile) => (error) => {
      const ifileUpdate = {
        ...ifile,
        status: IFileStatus.Error,
        tooltip: error,
      };
      onUpdate(index, ifileUpdate);
    },
    [onUpdate]
  );
  const onUploadAbort = React.useCallback(
    (index: number, ifile: IUploadFile) => () => {
      const ifileUpdate = {
        ...ifile,
        status: IFileStatus.Abort,
        tooltip: "Upload canceled",
      };
      onUpdate(index, ifileUpdate);
    },
    [onUpdate]
  );
  const onUploadProgress = React.useCallback(
    (index: number) => (uploadProgress: number) => {
      dispatch({ type: "update_uploadProgress", uploadProgress, index });
    },
    []
  );

  React.useEffect(() => {
    for (let i = 0; i < files.length; i++) {
      const cF = files[i];
      const { status: fileStatus, file } = cF;

      if (fileStatus === IFileStatus.Uploading && !S3UploadRef.current[i]) {
        const { type, name } = file;
        const noTypeStrem = type !== OCTET_STREAM_MIMETYPE;
        const mimeType = noTypeStrem ? type : getMimeType(name);
        S3UploadRef.current[i] = new S3Upload({
          file,
          mimeType,
          getSignedUrl: getSignedUrlCb(i, cF),
          server: undefined,
          onFinishS3Put: onUploadFinishS3Put(i, cF),
          onProgress: onUploadProgress(i),
          onError: onUploadError(i, cF),
          onAbort: onUploadAbort(i, cF),
          signingUrlMethod: signingUrlMethod,
          uploadRequestHeaders: uploadRequestHeaders,
          contentDisposition: "auto",
        });
      }
    }
  }, [
    files,
    getSignedUrlCb,
    onUploadFinishS3Put,
    onUploadProgress,
    onUploadError,
    onUploadAbort,
    signingUrlMethod,
    uploadRequestHeaders,
  ]);

  React.useEffect(() => {
    return () => {
      if (!!S3UploadRef && S3UploadRef.current.length !== 0) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        for (const uploader of S3UploadRef.current) uploader?.abortUpload();
      }
    };
  }, []);

  return (
    <Collapse in={expanded} timeout="auto">
      <Divider />
      <FixedSizeList
        itemSize={40}
        height={140}
        itemCount={files.length}
        itemData={{
          files,
          fileState,
        }}
        width={"100%"}
        children={renderRow}
      />
    </Collapse>
  );
};

export default List;
