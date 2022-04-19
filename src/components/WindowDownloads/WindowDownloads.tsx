import * as Colors from "../../componentsBase/style/Colors";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import MultiDownloads, {
  IIMultiDownloadsItem,
} from "../../componentsBase/MultiDownloads";
import isEmpty from "lodash-es/isEmpty";
import { ACTION_MAIN } from "../reducer";
import Btn from "../../componentsBase/Btn";
import Modal from "../Modal";
import { ContextDispatchMain } from "../contexts";

const useStyles = makeStyles({
  multiDownload: {
    left: 25,
    bottom: 75,
    right: "auto",
  },
});

interface IWindowDownloads {
  downloads: IIMultiDownloadsItem[];
}

const WindowDownloads = ({ downloads }: IWindowDownloads) => {
  const classes = useStyles({});
  const dispatchMain = React.useContext(ContextDispatchMain);

  const [modalConfirmStop, setModalConfirmStop] = React.useState(false);
  const onModalClose = React.useCallback(() => {
    setModalConfirmStop(false);
  }, []);
  const onClose = React.useCallback(() => {
    dispatchMain({ type: ACTION_MAIN.DOWNLOADS__RESET });
    setModalConfirmStop(false);
  }, [dispatchMain]);
  const onCloseCheck = React.useCallback(() => {
    if (!isEmpty(downloads) && downloads.find((x) => x.loading === true)) {
      setModalConfirmStop(true);
    } else {
      onClose();
    }
  }, [downloads, onClose]);

  return (
    <>
      <MultiDownloads
        className={classes.multiDownload}
        items={downloads}
        open={!isEmpty(downloads)}
        onClose={onCloseCheck}
      />
      <Modal
        open={modalConfirmStop}
        onClose={onModalClose}
        title="Cancel Download"
        content={
          <Typography
            variant="body1"
            children="Are you sure you want to cancel download?"
          />
        }
        actions={
          <>
            <div style={{ flex: 1 }} />
            <Btn variant="bold" label="CONTINUE" onClick={onModalClose} />
            <Btn
              variant="bold"
              color={Colors.Red}
              label="STOP DOWNLOAD"
              onClick={onClose}
            />
          </>
        }
      />
    </>
  );
};

export default WindowDownloads;
