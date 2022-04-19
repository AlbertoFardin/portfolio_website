import * as React from "react";
import * as Colors from "../../componentsBase/style/Colors";
import Btn from "../../componentsBase/Btn";
import Modal from "../Modal";
import Typography from "@material-ui/core/Typography";
import { ACT_VPORT } from "./reducer";

interface IDialogUnsaved {
  dispatchPanel: React.Dispatch<unknown>;
  open: boolean;
  dirtyCount: number;
}

const DialogUnsaved = ({ dispatchPanel, open, dirtyCount }: IDialogUnsaved) => {
  const onCancel = React.useCallback(() => {
    dispatchPanel({ type: ACT_VPORT.DIALOG_UNSAVED });
  }, [dispatchPanel]);
  const onDiscard = React.useCallback(() => {
    dispatchPanel({ type: ACT_VPORT.DELETE_DIRTY });
  }, [dispatchPanel]);

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Unsaved Changes"
      content={
        <Typography
          variant="body1"
          children={
            <>
              <span>
                {dirtyCount > 1
                  ? `There are ${dirtyCount} unsaved changes`
                  : `There is ${dirtyCount} unsaved change`}
              </span>
              <br />
              <span>If you confirm this operation, changes will be lost.</span>
            </>
          }
        />
      }
      actions={
        <>
          <div style={{ flex: 1 }} />
          <Btn variant="bold" label="REVIEW" onClick={onCancel} />
          <Btn
            variant="bold"
            color={Colors.Red}
            label="DISCARD"
            onClick={onDiscard}
          />
        </>
      }
    />
  );
};

export default DialogUnsaved;
