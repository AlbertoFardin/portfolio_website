import * as React from "react";
import { ACT_MODAL } from "./reducer";
import Modal from "../../Modal";
import Typography from "@material-ui/core/Typography";
import Btn from "../../../componentsBase/Btn";
import * as Colors from "../../../componentsBase/style/Colors";

interface IModalDeleteTag {
  dispatchModal: React.Dispatch<unknown>;
  open: boolean;
}

const ModalDeleteTag = ({ dispatchModal, open }: IModalDeleteTag) => {
  const onDelete = React.useCallback(() => {
    dispatchModal({ type: ACT_MODAL.REMOVE_START });
  }, [dispatchModal]);
  const onCancel = React.useCallback(() => {
    dispatchModal({ type: ACT_MODAL.REMOVE_CONFIRM });
  }, [dispatchModal]);

  return (
    <Modal
      open={open}
      title="Delete tag"
      onClose={onCancel}
      content={
        <Typography
          variant="body1"
          children="Are you sure you want to delete this tag from the system?"
        />
      }
      actions={
        <>
          <div style={{ flex: 1 }} />
          <Btn variant="bold" label="CANCEL" onClick={onCancel} />
          <Btn
            variant="bold"
            color={Colors.Red}
            label="DELETE"
            onClick={onDelete}
          />
        </>
      }
    />
  );
};

export default ModalDeleteTag;
