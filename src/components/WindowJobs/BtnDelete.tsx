import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Zoom from "@material-ui/core/Zoom";
import ButtonBase from "@material-ui/core/ButtonBase";
import Icon from "@material-ui/core/Icon";
import { colorTheme } from "../../constants";
import * as Colors from "../../componentsBase/style/Colors";
import Tooltip from "../../componentsBase/Tooltip";
import { deleteJobId } from "../../api/fetchesApi";
import { ACTION } from "./reducer";
import hexToRgbA from "../../componentsBase/utils/hexToRgbA";

const useStyles = makeStyles({
  btnDelete: {
    "border-radius": 10,
    padding: 2,
    color: colorTheme,
    "margin-left": 10,
    "background-color": "transparent",
    "&:hover": {
      "background-color": hexToRgbA(colorTheme, 0.15),
    },
  },
  icon: {
    "font-size": "12px !important",
    color: Colors.Gray1,
  },
});

interface IBtnDelete {
  dispatch: React.Dispatch<unknown>;
  id: string;
  visibled: boolean;
}

const BtnDelete = ({ dispatch, id, visibled }: IBtnDelete) => {
  const classes = useStyles({});

  const [clicked, setClicked] = React.useState(false);
  const onClick = React.useCallback(() => {
    setClicked(true);
  }, []);

  React.useEffect(() => {
    if (clicked) {
      (async () => {
        await deleteJobId(id);
        dispatch({ type: ACTION.DELETED_SINGLE, id });
      })();
    }
  }, [clicked, dispatch, id]);

  return (
    <Zoom in={visibled}>
      <Tooltip title="Remove from listing">
        <ButtonBase className={classes.btnDelete} onClick={onClick}>
          <Icon className={classes.icon} children="close" />
        </ButtonBase>
      </Tooltip>
    </Zoom>
  );
};

export default BtnDelete;
