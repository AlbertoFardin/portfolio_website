import * as React from "react";
import * as Colors from "../../componentsBase/style/Colors";
import Modal from "./Modal";
import Btn from "../../componentsBase/Btn";
import Typography from "@material-ui/core/Typography";

interface IModalLogout {
  open?: boolean;
  title?: string;
  content?: string;
  btnLogoutLabel?: string;
  btnLogoutOnClick: () => void;
  btnCancelLabel?: string;
  btnCancelOnClick: () => void;
}

const ModalLogout = ({
  open,
  title = "👋 Logout",
  content = "Are you sure to logout?",
  btnLogoutLabel = "LOGOUT",
  btnLogoutOnClick,
  btnCancelLabel = "CANCEL",
  btnCancelOnClick,
}: IModalLogout) => (
  <Modal
    open={open}
    onClose={btnCancelOnClick}
    title={title}
    content={<Typography variant="body1" children={content} />}
    actions={
      <>
        <div style={{ flex: 1 }} />
        <Btn variant="bold" label={btnCancelLabel} onClick={btnCancelOnClick} />
        <Btn
          variant="bold"
          label={btnLogoutLabel}
          onClick={btnLogoutOnClick}
          color={Colors.Red}
        />
      </>
    }
  />
);

export default ModalLogout;
