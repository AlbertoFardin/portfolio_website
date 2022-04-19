import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import * as React from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import TypographyEllipsis from "../../../componentsBase/TypographyEllipsis";
import mixColors from "../../../componentsBase/utils/mixColors";

interface IStyle {
  countMax: number;
}
const dashWidth = 8;
const dashMargin = 2;
const useStyle = makeStyles(({ palette }) => {
  const colorMain = palette.primary.main;
  return {
    stickyItem: {
      "background-color": "#fff",
      "border-radius": 20,
      display: "flex",
      "flex-direction": "row",
      "align-items": "center",
      transition: "all 250ms",
      padding: "3px 10px",
      margin: "0 5px 5px 5px",
      color: colorMain,
      border: "1px solid #dddddd",
      "&:hover": {
        "background-color": mixColors(0.2, "#ffffff", colorMain),
      },
    },
    stickyItemSelected: {
      "background-color": mixColors(0.2, "#ffffff", colorMain),
    },
    icon: {
      display: "flex",
      "flex-direction": "row",
      "align-items": "center",
      "margin-right": 5,
      flex: 1,
    },
    iconDash: {
      width: dashWidth,
      height: 1,
      "margin-right": dashMargin,
      "background-color": "#333",
    },
    iconDashTotal: {
      width: ({ countMax }: IStyle) => (dashWidth + dashMargin) * countMax,
    },
    iconDashSelected: {
      "background-color": colorMain,
      height: 2,
    },
    label: {
      flex: 1,
    },
    labelSelected: {
      color: colorMain,
    },
  };
});

interface ICmp {
  value: string;
  label: string;
  selected: boolean;
  sizeValue?: number;
  sizeTotal?: number;
  onClick: (value: string) => void;
  disabled?: boolean;
}

const FacetLevelsItem = ({
  disabled,
  value,
  label,
  selected,
  sizeValue = 0,
  sizeTotal = 0,
  onClick,
}: ICmp) => {
  const classes = useStyle({ countMax: sizeTotal });
  const onCbClick = React.useCallback(() => {
    onClick(value);
  }, [onClick, value]);

  return (
    <ButtonBase
      className={classnames({
        [classes.stickyItem]: true,
        [classes.stickyItemSelected]: selected,
      })}
      onClick={onCbClick}
      disabled={selected || disabled}
    >
      {!sizeTotal ? null : (
        <div className={classes.icon}>
          {sizeValue ? null : (
            <div
              className={classnames({
                [classes.iconDash]: true,
                [classes.iconDashTotal]: true,
                [classes.iconDashSelected]: selected,
              })}
            />
          )}
          {Array(sizeValue)
            .fill("")
            .map((a, i) => (
              <div
                key={`dash${i}`}
                className={classnames({
                  [classes.iconDash]: true,
                  [classes.iconDashSelected]: selected,
                })}
              />
            ))}
        </div>
      )}
      <TypographyEllipsis
        className={classnames({
          [classes.label]: true,
          [classes.labelSelected]: selected,
        })}
        variant={selected ? "body2" : "body1"}
        children={label}
      />
    </ButtonBase>
  );
};

export default FacetLevelsItem;
