import Typography, { TypographyProps } from "@material-ui/core/Typography";
import omit from "lodash-es/omit";
import * as React from "react";
import Tooltip from "../Tooltip";

export interface ITypographyEllipsis extends TypographyProps {
  endLength?: number;
  tooltip?: boolean;
  tooltipLabel?: string;
  tooltipAlwaysVisible?: boolean;
  children?: string;
}

enum ACTION {
  TOOLTIP = "TOOLTIP",
  NEW_VALUE = "NEW_VALUE",
}

const reducer = (state, action) => {
  const newState = { ...state };
  switch (action.type) {
    case ACTION.TOOLTIP:
      newState.needTooltip = action.needTooltip;
      return newState;
    case ACTION.NEW_VALUE:
      newState.offsetWidth = action.offsetWidth;
      newState.scrollWidth = action.scrollWidth;
      return newState;
    default:
      return newState;
  }
};

const TypographyEllipsis = (props: ITypographyEllipsis) => {
  const {
    style,
    className,
    children,
    endLength,
    tooltip,
    tooltipLabel,
    tooltipAlwaysVisible,
  } = props;
  const typoRef = React.useRef(null);
  const [state, dispatch] = React.useReducer(reducer, {
    needTooltip: tooltipAlwaysVisible,
    offsetWidth: 0,
    scrollWidth: 0,
  });
  const { needTooltip, offsetWidth, scrollWidth } = state;
  const labelProps = {
    ...omit(props, [
      "tooltip",
      "tooltipLabel",
      "tooltipAlwaysVisible",
      "endLength",
    ]),
  };
  const labelStyle = {
    ...style,
    position: "initial" as const,
    margin: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    padding: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    textOverflow: "ellipsis",
    height: "initial",
    width: "initial",
    backgroundColor: "transparent",
    display: "block",
    top: "initial",
    right: "initial",
    bottom: "initial",
    left: "initial",
    lineHeight: "initial",
  };

  React.useEffect(() => {
    const newNeedTooltip = tooltip && offsetWidth < scrollWidth;
    dispatch({
      type: ACTION.TOOLTIP,
      needTooltip: tooltipAlwaysVisible || newNeedTooltip,
    });
  }, [offsetWidth, scrollWidth, tooltip, tooltipAlwaysVisible]);

  React.useEffect(() => {
    if (!!typoRef && !!typoRef.current && children) {
      dispatch({
        type: ACTION.NEW_VALUE,
        offsetWidth: typoRef.current.offsetWidth,
        scrollWidth: typoRef.current.scrollWidth,
      });
    }
  }, [children]);

  return (
    <Tooltip title={needTooltip ? tooltipLabel || children : ""}>
      <div
        className={className}
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          overflow: "hidden",
        }}
      >
        <Typography
          ref={typoRef}
          style={{ ...labelStyle, flex: 1 }}
          {...labelProps}
          children={children}
        />
        {!(needTooltip && !!endLength) ? null : (
          <Typography
            {...labelProps}
            style={{ ...labelStyle, flex: "none" }}
            children={children.substr(
              children.length - endLength,
              children.length
            )}
          />
        )}
      </div>
    </Tooltip>
  );
};

TypographyEllipsis.defaultProps = {
  endLength: 0,
  noWrap: true,
  align: "left",
  variant: "body1",
  tooltip: true,
  tooltipLabel: "",
  tooltipAlwaysVisible: false,
};

export default TypographyEllipsis;
