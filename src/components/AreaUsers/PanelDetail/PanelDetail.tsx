import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  SheetLayout,
  SheetStatus,
  IAdminUserProfile,
} from "../../../interfaces";
import DrawerDetail from "../../DrawerDetail";
import PanelDetailContent from "./PanelDetailContent";
import { ContextDispatchViewport } from "../contexts";
import { ACT_VPORT } from "../reducer";
import LoadingMask from "../../../componentsBase/LoadingMask";
import Actionbar from "./Actionbar";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

const loadingColor = "rgba(250,250,250,0.75)";
const useStyles = makeStyles(({ zIndex }) => ({
  dirtySheet: {
    "z-index": zIndex.drawer + 5,
  },
  dirtyBackdrop: {
    "z-index": zIndex.drawer + 5,
    "background-color": "transparent",
    position: "fixed",
    right: 0,
    bottom: 0,
    top: 0,
    left: 0,
  },
}));

interface IPanelDetail {
  onChangeLayout: (l: SheetLayout) => void;
  onResetLayout: () => void;
  detailSheet: SheetLayout;
  user: IAdminUserProfile;
  inEdit: boolean;
  loading: boolean;
}

const PanelDetail = ({
  onChangeLayout,
  onResetLayout,
  detailSheet,
  user,
  inEdit,
  loading,
}: IPanelDetail) => {
  const classes = useStyles({});
  const dispatchViewport = React.useContext(ContextDispatchViewport);

  const onBackdropClick = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.DIALOG_UNSAVED });
  }, [dispatchViewport]);

  return (
    <>
      {!inEdit ? null : (
        <div
          role="presentation"
          className={classes.dirtyBackdrop}
          onClick={onBackdropClick}
        />
      )}
      <DrawerDetail
        className={inEdit ? classes.dirtySheet : undefined}
        layout={detailSheet}
        onChange={onChangeLayout}
        onReset={onResetLayout}
        status={!user ? SheetStatus.PHOLDER : SheetStatus.VISIBLE}
        title={<Typography variant="body2" children="User Detail" />}
        content={
          <>
            <Divider />
            <LoadingMask open={loading} backgroundColor={loadingColor} />
            <PanelDetailContent user={user} inEdit={inEdit} />
            <Actionbar inEdit={inEdit} user={user} />
          </>
        }
      />
    </>
  );
};

export default PanelDetail;
