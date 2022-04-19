import * as React from "react";
import Paper from "@material-ui/core/Paper";
import * as Colors from "../../style/Colors";
import Btn from "../../Btn";

/*
const useStyles = makeStyles({
  button: {
    "background-color": "#fff",
    margin: "0 2px",
    padding: "0 5px",
    "min-width": 0,
    "min-height": 20,
  },
  selected: {
    "background-color": `${colors.green} !important`,
  },
  icon: {
    "font-size": 13,
    color: colors.black,
  },
  label: {
    "margin-left": 2,
    "font-size": 10,
    color: colors.black,
  },
  selectedChild: {
    color: "#fff",
  },
});
*/

interface IBtnMini {
  icon?: string;
  label?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
  selected?: boolean;
  tooltip: JSX.Element | string;
}

const BtnMini = ({
  icon,
  label,
  onClick,
  selected = false,
  tooltip,
}: IBtnMini) => {
  return (
    <Paper elevation={3} style={{ margin: "0 2px", borderRadius: 999 }}>
      <Btn
        color={selected ? Colors.Green : undefined}
        style={{ margin: 0 }}
        icon={icon}
        label={label}
        tooltip={tooltip}
        onClick={onClick}
      />
    </Paper>
  );

  /*
  // da mockup di daniela...
  return (
    <Tooltip title={tooltip}>
      <Button
        variant="contained"
        onClick={onClick}
        style={style}
        className={classnames({
          [classes.button]: true,
          [classes.selected]: selected,
          [className]: !!className
        })}
      >
        {!icon ? null : (
          <Icon
            className={classnames({
              [classes.icon]: true,
              [classes.selectedChild]: selected
            })}
            children={icon}
          />
        )}
        {!label ? null : (
          <Typography
            className={classnames({
              [classes.label]: true,
              [classes.selectedChild]: selected
            })}
            children={label}
          />
        )}
      </Button>
    </Tooltip>
  );
  */
};

export default React.memo(BtnMini);
