import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import Collapse from "@material-ui/core/Collapse";
import TypographyEllipsis from "../../TypographyEllipsis";
import IconCollapse from "../../IconCollapse";
import BtnClear from "./BtnClear";
import IFacetType from "../IFacetType";
import * as Colors from "../../style/Colors";
import Btn from "../../Btn";
import Zoom from "@material-ui/core/Zoom";
import { emptyFn } from "../../utils/common";

const useStyle = makeStyles({
  facet: {
    position: "relative",
  },
  facetHeader: {
    position: "relative",
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    flex: 1,
    height: 40,
    cursor: "pointer",
  },
  label1: {
    flex: 1,
  },
  label2: {
    margin: "-10px 0 10px 25px",
    color: Colors.Gray2,
  },
});

interface IChanges {
  id: string;
  type: IFacetType;
  value: undefined;
}

interface IFacetBase {
  children: JSX.Element | React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  badgeCount?: number;
  badgeLabel?: string;
  onClickBadge?: (v: IChanges) => void;
  initCollapse?: boolean;
  label: string;
  subLabel?: string;
  id: string;
  type: IFacetType;
  disabled?: boolean;
  disabledInfo?: string;
}

const FacetBase = ({
  children,
  className,
  style,
  id,
  type,
  badgeCount = 0,
  badgeLabel = "",
  onClickBadge = emptyFn,
  initCollapse,
  label,
  subLabel,
  disabled,
  disabledInfo,
}: IFacetBase) => {
  const classes = useStyle({});
  const [collapse, setCollapse] = React.useState(initCollapse || disabled);
  const onCollapse = React.useCallback(() => {
    if (!disabled) setCollapse(!collapse);
  }, [collapse, disabled]);
  const onClear = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      onClickBadge({ id, type, value: undefined });
    },
    [id, type, onClickBadge]
  );

  React.useEffect(() => {
    setCollapse(disabled);
  }, [disabled]);

  return (
    <div
      style={style}
      className={classnames({
        [classes.facet]: true,
        [className]: !!className,
      })}
    >
      <div
        role="presentation"
        className={classes.facetHeader}
        onClick={onCollapse}
      >
        <IconCollapse collapse={collapse} />
        {!label ? null : (
          <TypographyEllipsis
            className={classes.label1}
            variant="subtitle2"
            children={label}
          />
        )}
        <BtnClear
          open={!disabled && !!badgeCount}
          label={badgeLabel}
          count={badgeCount}
          onClick={onClear}
        />
        <Zoom in={disabled && !!disabledInfo} mountOnEnter unmountOnExit>
          <Btn
            disabled
            style={{ margin: 0 }}
            icon="help_center"
            tooltip={disabledInfo}
          />
        </Zoom>
      </div>
      {!subLabel || collapse ? null : (
        <TypographyEllipsis
          className={classes.label2}
          variant="body2"
          children={subLabel}
        />
      )}
      <Collapse
        in={!collapse}
        timeout="auto"
        unmountOnExit
        children={children}
      />
    </div>
  );
};

export default FacetBase;
