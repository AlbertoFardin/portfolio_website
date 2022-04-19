import * as React from "react";
import * as Colors from "../../../componentsBase/style/Colors";
import Btn from "../../../componentsBase/Btn";
import Modal from "../../Modal";
import Typography from "@material-ui/core/Typography";
import { ICopyright } from "../../../interfaces";
import { ACT_PANEL } from "./reducer";

interface IDialogUnsaved {
  dispatchPanel: React.Dispatch<unknown>;
  open: boolean;
  dirtyCopyright: ICopyright;
}

const DialogUnsaved = ({
  dispatchPanel,
  open,
  dirtyCopyright,
}: IDialogUnsaved) => {
  const dirtyCount = Object.keys(dirtyCopyright || {}).length;
  const onCancel = React.useCallback(() => {
    dispatchPanel({ type: ACT_PANEL.DIALOG_UNSAVED });
  }, [dispatchPanel]);
  const onDiscard = React.useCallback(() => {
    dispatchPanel({ type: ACT_PANEL.DELETE_COPYRIGHT_DIRTY });
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
