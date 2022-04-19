import * as React from "react";
import * as Colors from "../../../../componentsBase/style/Colors";
import Btn from "../../../../componentsBase/Btn";
import { ACT_DETAIL } from "../reducer";
import Modal from "../../../Modal";
import Typography from "@material-ui/core/Typography";
import { ContextDispatchDetail } from "../../contexts";

interface IDialogUnsaved {
  open: boolean;
  assetdataDirty;
}

const DialogUnsaved = ({ open, assetdataDirty }: IDialogUnsaved) => {
  const dispatchDetail = React.useContext(ContextDispatchDetail);

  const countDirty = Object.keys(assetdataDirty).length;
  const onCancel = React.useCallback(() => {
    dispatchDetail({
      type: ACT_DETAIL.SHOW_DIALOG_UNSAVED,
      value: false,
    });
  }, [dispatchDetail]);
  const onDiscard = React.useCallback(() => {
    dispatchDetail({ type: ACT_DETAIL.EDITING_DISCARDED });
  }, [dispatchDetail]);

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
                {countDirty > 1
                  ? `There are ${countDirty} unsaved changes`
                  : `There is ${countDirty} unsaved change`}
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
