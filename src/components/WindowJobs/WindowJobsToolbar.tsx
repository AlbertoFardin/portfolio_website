import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import { ACTION } from "./reducer";
import Btn from "../../componentsBase/Btn";

interface IWindowJobsToolbar {
  dispatch: React.Dispatch<unknown>;
}

const WindowJobsToolbar = ({ dispatch }: IWindowJobsToolbar) => {
  const onDeleteAll = React.useCallback(() => {
    dispatch({ type: ACTION.CLICK_DELETE_ALL });
  }, [dispatch]);

  return (
    <Toolbar style={{ padding: "0 15px" }}>
      <Typography variant="body2" children="Edit requests of last 30 days" />
      <div style={{ flex: 1 }} />
      <Btn
        icon="more_vert"
        style={{ margin: 0 }}
        menu={{
          items: [
            {
              id: "delete_all",
              icon: "close",
              label: "Clear listing",
              onClick: onDeleteAll,
            },
          ],
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        }}
      />
    </Toolbar>
  );
};

export default WindowJobsToolbar;
