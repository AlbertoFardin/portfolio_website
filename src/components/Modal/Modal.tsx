import * as React from "react";
import Dialog from "@material-ui/core/Dialog";
import makeStyles from "@material-ui/core/styles/makeStyles";
import LoadingMask from "../../componentsBase/LoadingMask";
import Typography from "@material-ui/core/Typography";

const size = 100;
const useStyles = makeStyles(() => ({
  modal: {
    width: "fit-content",
    "min-width": size,
    "min-height": size,
    "max-width": 9999999,
    margin: 0,
    padding: 0,
    position: "relative",
  },
  contentLoading: {
    width: size,
    "min-width": size,
    "max-width": size,
    height: size,
    "min-height": size,
    margin: 0,
    position: "relative",
    overflow: "hidden",
  },
  content: {
    "min-width": 350,
    padding: "0 20px",
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
  },
  toolbar: {
    padding: "5px 20px",
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    "min-height": 50,
  },
  toolbarTitles: {
    display: "flex",
    "flex-direction": "column",
    "align-items": "flex-start",
  },
}));

interface IModal {
  open: boolean;
  loading?: boolean;
  title?: React.ReactNode;
  titleSub?: React.ReactNode;
  onClose: () => void;
  content?: JSX.Element | React.ReactNode;
  actions?: JSX.Element | React.ReactNode;
}

const Modal = ({
  open,
  loading,
  title,
  titleSub,
  onClose,
  content,
  actions,
}: IModal) => {
  const classes = useStyles({});
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ className: classes.modal }}
    >
      {loading ? (
        <div className={classes.contentLoading}>
          <LoadingMask open backgroundColor="rgba(250,250,250,0.75)" />
        </div>
      ) : (
        <>
          {!title ? null : (
            <div className={classes.toolbar}>
              <div className={classes.toolbarTitles}>
                <Typography variant="subtitle2" children={title} />
                <Typography variant="body1" children={titleSub} />
              </div>
            </div>
          )}
          {!content ? null : (
            <div className={classes.content} children={content} />
          )}
          {!actions ? null : (
            <div className={classes.toolbar} children={actions} />
          )}
        </>
      )}
    </Dialog>
  );
};

export default Modal;
