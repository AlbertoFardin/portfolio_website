import * as React from "react";
import * as Colors from "../../../componentsBase/style/Colors";
import Btn from "../../../componentsBase/Btn";
import Modal from "../../Modal";
import Typography from "@material-ui/core/Typography";

interface IMsgStopUpload {
  i18n: {
    msgStopUploadsBtnInterrupt: string;
    msgStopUploadsBtnContinue: string;
    msgStopUploadsTitle: string;
    msgStopUploadsContent: string;
  };
  onStop: () => void;
  onContinue: () => void;
  open: boolean;
}

const MsgStopUpload = ({ i18n, onStop, onContinue, open }: IMsgStopUpload) => {
  return (
    <Modal
      open={open}
      onClose={onContinue}
      title={"⚠️ " + i18n.msgStopUploadsTitle}
      content={
        <Typography variant="body1" children={i18n.msgStopUploadsContent} />
      }
      actions={
        <>
          <div style={{ flex: 1 }} />
          <Btn
            variant="bold"
            label={i18n.msgStopUploadsBtnContinue.toLocaleUpperCase()}
            onClick={onContinue}
          />
          <Btn
            variant="bold"
            label={i18n.msgStopUploadsBtnInterrupt.toLocaleUpperCase()}
            onClick={onStop}
            color={Colors.Red}
          />
        </>
      }
    />
  );
};

export default MsgStopUpload;
