import Typography from "@material-ui/core/Typography";
import Btn from "../../../componentsBase/Btn";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import IconCollapse from "../../../componentsBase/IconCollapse";
import Collapse from "@material-ui/core/Collapse";
import Zoom from "@material-ui/core/Zoom";

const useStyles = makeStyles({
  facetToggle: {
    margin: "5px 0",
    "border-radius": 10,
    "align-items": "stretch",
    display: "flex",
    "flex-direction": "column",
  },
  facetHeader: {
    flex: 1,
    cursor: "pointer",
    "min-height": 40,
    display: "flex",
    position: "relative",
    "align-items": "center",
    "flex-direction": "row",
  },
  facetHeaderLabel: {
    "margin-right": 5,
    cursor: "pointer",
  },
  btn: {
    "border-radius": 0,
    flex: 1,
    "min-height": 25,
    margin: 0,
  },
  btnLabel: {
    margin: 0,
  },
  buttons: {
    display: "flex",
    "background-color": "#fff",
    border: "1px solid #dddddd",
    "border-radius": 20,
    overflow: "hidden",
    margin: "0px 15px 10px",
  },
});

interface IAction {
  id: string;
  selected: boolean;
  label: string;
}

interface IBtnToogle extends IAction {
  onClick: (id: string) => void;
}
const BtnToogle = ({ id, selected, label, onClick }: IBtnToogle) => {
  const classes = useStyles();
  const cbOnClick = React.useCallback(() => onClick(id), [id, onClick]);
  return (
    <Btn
      className={classes.btn}
      onClick={cbOnClick}
      selected={selected}
      label={label}
      labelClassName={classes.btnLabel}
    />
  );
};

interface IBoxToggle {
  help?: string;
  label: string;
  actions: IAction[];
  onChange: (id: string) => void;
  backgroundColor?: string;
}
const BoxToggle = ({
  help,
  label,
  actions,
  onChange,
  backgroundColor,
}: IBoxToggle) => {
  const classes = useStyles();
  const [close, setClose] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const onClose = React.useCallback(() => setClose(!close), [close]);
  const onMouseEnter = React.useCallback(() => setHover(true), []);
  const onMouseLeave = React.useCallback(() => setHover(false), []);

  return (
    <div
      className={classes.facetToggle}
      style={{ backgroundColor }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        role="presentation"
        className={classes.facetHeader}
        onClick={onClose}
      >
        <IconCollapse collapse={close} />
        <Typography
          className={classes.facetHeaderLabel}
          variant="subtitle2"
          children={label}
        />
        <div style={{ flex: 1 }} />
        {!help ? null : (
          <Zoom in={hover}>
            <Btn disabled icon="help_center" tooltip={help} />
          </Zoom>
        )}
      </div>
      <Collapse in={!close} timeout="auto" unmountOnExit>
        <div className={classes.buttons}>
          {actions.map((a) => (
            <BtnToogle key={a.id} onClick={onChange} {...a} />
          ))}
        </div>
      </Collapse>
    </div>
  );
};

export default BoxToggle;
