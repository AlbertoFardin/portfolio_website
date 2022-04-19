import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { SheetLayout, SheetStatus, IPermissionData } from "../../../interfaces";
import DrawerDetail from "../../DrawerDetail";
import { ContextDispatchViewport } from "../contexts";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { columns } from "../constants";
import FieldText from "./FieldText";

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
  content: {
    flex: 1,
    position: "relative",
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
    "overflow-x": "hidden",
    "overflow-y": "overlay",
  },
}));

interface IPanelDetail {
  onChangeLayout: (l: SheetLayout) => void;
  onResetLayout: () => void;
  detailSheet: SheetLayout;
  data: IPermissionData;
  inEditing?: boolean;
}

const PanelDetail = ({
  onChangeLayout,
  onResetLayout,
  detailSheet,
  data,
  inEditing,
}: IPanelDetail) => {
  const classes = useStyles({});
  const dispatchViewport = React.useContext(ContextDispatchViewport);

  const onBackdropClick = React.useCallback(() => {
    dispatchViewport({ type: "TODO" });
  }, [dispatchViewport]);

  return (
    <>
      {!inEditing ? null : (
        <div
          role="presentation"
          className={classes.dirtyBackdrop}
          onClick={onBackdropClick}
        />
      )}
      <DrawerDetail
        className={inEditing ? classes.dirtySheet : undefined}
        layout={detailSheet}
        onChange={onChangeLayout}
        onReset={onResetLayout}
        status={!data ? SheetStatus.PHOLDER : SheetStatus.VISIBLE}
        title={<Typography variant="body2" children="Permission Detail" />}
        content={
          !data ? null : (
            <>
              <Divider />
              <div className={classes.content}>
                {columns.map(({ id }) => (
                  <FieldText key={id} id={id} value={String(data[id])} />
                ))}
              </div>
            </>
          )
        }
      />
    </>
  );
};

export default PanelDetail;
