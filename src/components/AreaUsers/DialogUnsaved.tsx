import * as React from "react";
import * as Colors from "../../componentsBase/style/Colors";
import Btn from "../../componentsBase/Btn";
import { ACT_VPORT } from "./reducer";
import Modal from "../Modal";
import Typography from "@material-ui/core/Typography";
import { ContextDispatchViewport } from "./contexts";

interface IDialogUnsaved {
  open: boolean;
}

const DialogUnsaved = ({ open }: IDialogUnsaved) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);

  const onCancel = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.DIALOG_UNSAVED });
  }, [dispatchViewport]);
  const onDiscard = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.DISCARD_CHANGES });
  }, [dispatchViewport]);

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
              There are unsaved changes.
              <br />
              If you confirm this operation, changes will be lost.
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
