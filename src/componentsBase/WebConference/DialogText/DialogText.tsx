import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";

const padding = 20;
const useStyles = makeStyles({
  modalHeader: {
    padding,
    "padding-bottom": 0,
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
  },
  modalContent: {
    padding,
    "padding-top": 5,
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
  },
  modalFooter: {
    padding,
    "padding-top": 0,
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    "justify-content": "center",
  },
  button: {
    margin: "0 5px !important",
    padding: "0 35px !important",
  },
});

export interface IDialogText {
  text: string;
  onClose: () => void;
}

const DialogText = ({ text, onClose }: IDialogText) => {
  const classes = useStyles();
  return (
    <Dialog open={!!text} onClose={onClose}>
      <DialogContent className={classes.modalContent}>
        <Typography variant="body1" children={text} />
      </DialogContent>
    </Dialog>
  );
};

export default DialogText;
