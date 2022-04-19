import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { colorTheme } from "../../../../constants";
import Tooltip from "../../../../componentsBase/Tooltip";
import FieldMentions from "../../../../componentsBase/Field/FieldMentions";
import { emptyFn } from "../../../../componentsBase/utils/common";
import classnames from "classnames";
import * as Colors from "../../../../componentsBase/style/Colors";
import ButtonBase from "@material-ui/core/ButtonBase";
import Icon from "@material-ui/core/Icon";
import { ContextUsers } from "../../../contexts";

const maxHeight = 33;
const useStyles = makeStyles({
  fieldContainer: {
    position: "relative",
    display: "flex",
  },
  field: {
    flex: 1,
    padding: "2px 5px",
    transition: "250ms all",
    "box-sizing": "border-box",
    "max-height": maxHeight,
    "overflow-y": "hidden",
  },
  fieldOpen: {
    "max-height": 300,
    "overflow-y": "overlay",
  },
  btnOpen: {
    position: "absolute",
    top: "-10px",
    right: 10,
    "border-radius": 10,
    padding: 2,
    color: colorTheme,
    "background-color": "#fff",
    border: `1px solid ${Colors.Gray2}`,
  },
  icon: {
    "font-size": "13px !important",
    color: Colors.Gray1,
  },
});

interface IFieldAnnotation {
  value: string;
}

const FieldAnnotation = ({ value }: IFieldAnnotation) => {
  const users = React.useContext(ContextUsers);
  const refDiv = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [isLongValue, setIsLongValue] = React.useState(false);
  const classes = useStyles({});
  const onClick = React.useCallback(() => {
    setOpen(!open);
  }, [open]);

  React.useEffect(() => {
    if (refDiv.current && refDiv.current.clientHeight >= maxHeight) {
      setIsLongValue(true);
    }
  }, []);

  return (
    <div ref={refDiv} role="presentation" className={classes.fieldContainer}>
      <FieldMentions
        className={classnames({
          [classes.field]: true,
          [classes.fieldOpen]: open,
        })}
        readOnly={true}
        value={value}
        users={users}
        onChange={emptyFn}
      />
      {!isLongValue ? null : (
        <Tooltip title={open ? "Show less" : "Show more"}>
          <ButtonBase className={classes.btnOpen} onClick={onClick}>
            <Icon
              className={classes.icon}
              children={open ? "keyboard_arrow_up" : "keyboard_arrow_down"}
            />
          </ButtonBase>
        </Tooltip>
      )}
    </div>
  );
};

export default FieldAnnotation;
