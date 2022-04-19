import * as React from "react";
import * as Colors from "../../../../componentsBase/style/Colors";
import Typography from "@material-ui/core/Typography";
import Modal from "../../../Modal";
import { ACT_DETAIL } from "../reducer";
import Btn from "../../../../componentsBase/Btn";
import { ContextDispatchDetail } from "../../contexts";

interface IDialogConflict {
  open: boolean;
}

const DialogConflict = ({ open }: IDialogConflict) => {
  const dispatchDetail = React.useContext(ContextDispatchDetail);

  const onCancel = React.useCallback(() => {
    dispatchDetail({
      type: ACT_DETAIL.SHOW_DIALOG_CONFLICT,
      value: false,
    });
  }, [dispatchDetail]);

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Product data conflict"
      content={
        <Typography
          variant="body1"
          children={
            <>
              <span>Unable to save: a data conflict occurred.</span>
              <br />
              <span>We suggest to save your data changes elsewhere.</span>
            </>
          }
        />
      }
      actions={
        <>
          <div style={{ flex: 1 }} />
          <Btn
            variant="bold"
            label="OK, I UNDERSTAND"
            color={Colors.Green}
            onClick={onCancel}
          />
        </>
      }
    />
  );
};

export default DialogConflict;
