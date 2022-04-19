import Paper from "@material-ui/core/Paper";
import classnames from "classnames";
import * as React from "react";
import List from "./parts/List";
import MsgStopUpload from "./parts/MsgStopUpload";
import Toolbar from "./parts/Toolbar";
import { v4 as uuidv4 } from "uuid";
import Draggable from "react-draggable";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { IUploadFile, IFileStatus } from ".";
import { emptyFn } from "../../componentsBase/utils/common";
import isEmpty from "lodash-es/isEmpty";
import Portal from "@material-ui/core/Portal";

const dragCls = `multiupload_drag_${uuidv4()}`;
const useStyles = makeStyles(({ zIndex }) => ({
  multiuploads: {
    position: "absolute" as const,
    "z-index": zIndex.modal,
    width: 410,
    bottom: 25,
    right: 25,
    overflow: "hidden",
  },
}));
const i18nDefault = {
  filesUploaded: "Files uploaded",
  filesProcessed: "Files processed",
  msgStopUploadsBtnInterrupt: "Interrupt",
  msgStopUploadsBtnContinue: "Continue",
  msgStopUploadsTitle: "Stop uploads?",
  msgStopUploadsContent:
    "There are some uploads in progress, do you want to interrupt your current uploads?",
};

const ModalUploads = ({
  className,
  items = [],
  getSignedUrl,
  i18n: i18nInit,
  expanded = false,
  onCloseToolbar,
  onPutS3File,
  onExpand,
  signingUrlMethod = "GET",
  style,
  uploadRequestHeaders = { "x-amz-acl": "public-read" },
  onUpdateFileStatus,
  msgStopUpload,
  onContinue,
  onFinish = emptyFn,
  onStopUploads,
}: {
  uploadRequestHeaders?: { [k: string]: string };
  className?: string;
  style?: React.CSSProperties;
  items?: IUploadFile[];
  getSignedUrl?: (ifile: IUploadFile) => Promise<unknown>;
  signingUrlMethod?: string;
  i18n?: {
    msgStopUploadsBtnInterrupt: string;
    msgStopUploadsBtnContinue: string;
    msgStopUploadsTitle: string;
    msgStopUploadsContent: string;
    filesUploaded: string;
    filesProcessed: string;
  };
  onCloseToolbar?: () => void;
  onExpand?: () => void;
  onPutS3File?: (file: IUploadFile, data) => Promise<unknown>;
  onUpdateFileStatus?: (index: number, ifile: IUploadFile) => void;
  expanded?: boolean;
  msgStopUpload: boolean;
  onContinue?: () => void;
  onFinish?: (summary: IUploadFile[]) => void;
  onStopUploads?: () => void;
}) => {
  const classes = useStyles({});
  const i18n = {
    ...i18nDefault,
    ...i18nInit,
  };

  React.useEffect(() => {
    const filesProcessing = !!items.find((el) => {
      const fSet = new Set([IFileStatus.Uploading, IFileStatus.Waiting]);
      return fSet.has(el.status);
    });
    if (!filesProcessing && !!onFinish && !isEmpty(items)) {
      onFinish(items);
    }
  }, [items, onFinish]);

  return (
    <Portal>
      <Draggable handle={`.${dragCls}`} bounds="parent">
        <Paper
          style={style}
          className={classnames({
            [classes.multiuploads]: true,
            [className]: !!className,
          })}
          elevation={13}
        >
          <Toolbar
            i18n={i18n}
            expanded={expanded}
            files={items}
            onExpand={onExpand}
            onClose={onCloseToolbar}
            className={dragCls}
          />
          <List
            expanded={expanded}
            uploadRequestHeaders={uploadRequestHeaders}
            files={items}
            getSignedUrl={getSignedUrl}
            signingUrlMethod={signingUrlMethod}
            onPutS3File={onPutS3File}
            onUpdateFileStatus={onUpdateFileStatus}
          />
        </Paper>
      </Draggable>
      <MsgStopUpload
        i18n={i18n}
        open={msgStopUpload}
        onContinue={onContinue}
        onStop={onStopUploads}
      />
    </Portal>
  );
};

export default ModalUploads;
