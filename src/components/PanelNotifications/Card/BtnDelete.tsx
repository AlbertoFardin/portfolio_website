import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Zoom from "@material-ui/core/Zoom";
import ButtonBase from "@material-ui/core/ButtonBase";
import Icon from "@material-ui/core/Icon";
import { colorTheme } from "../../../constants";
import * as Colors from "../../../componentsBase/style/Colors";
import Tooltip from "../../../componentsBase/Tooltip";
import { deleteNotification } from "../../../api/fetchesApi";
import { ACTION } from "../reducer";
import hexToRgbA from "../../../componentsBase/utils/hexToRgbA";

interface IStyles {
  mousehover: boolean;
}
const useStyles = makeStyles({
  btnDelete: {
    position: "absolute",
    top: 6,
    right: 25,
    "border-radius": 10,
    padding: 2,
    color: colorTheme,
    "background-color": ({ mousehover }: IStyles) =>
      mousehover ? hexToRgbA(colorTheme, 0.15) : "transparent",
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
  const [mousehover, setMousehover] = React.useState(false);
  const [clicked, setClicked] = React.useState(false);
  const classes = useStyles({ mousehover });
  const onMouseEnter = React.useCallback(() => {
    setMousehover(true);
  }, []);
  const onMouseLeave = React.useCallback(() => {
    setMousehover(false);
  }, []);
  const onClick = React.useCallback(() => {
    setClicked(true);
  }, []);

  React.useEffect(() => {
    if (clicked) {
      (async () => {
        dispatch({ type: ACTION.ITEM_REMOVE, id });
        await deleteNotification(id);
      })();
    }
  }, [clicked, dispatch, id]);

  return (
    <Zoom in={visibled}>
      <Tooltip title="Remove this notification">
        <ButtonBase
          className={classes.btnDelete}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <Icon className={classes.icon} children="close" />
        </ButtonBase>
      </Tooltip>
    </Zoom>
  );
};

export default BtnDelete;
