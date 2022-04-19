import * as React from "react";
import FacetBase from "../utils/FacetBase";
import IFacetType from "../IFacetType";
import IFacetPercentage from "./IFacetPercentage";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import { emptyFn } from "../../utils/common";
import isEmpty from "lodash-es/isEmpty";

const type = IFacetType.PERCENTAGE;
const getLabel = (value: number) => (
  <Typography
    variant={"body1"}
    style={{ color: "#fff" }}
    children={`${value}%`}
  />
);
export const defaultValue = [0, 100];
const i18nDefault = {
  clear: "clear",
};
const prepareBadge = (value: number[]): number => {
  const isClear = value[0] === defaultValue[0] && value[1] === defaultValue[1];
  return isClear ? 0 : 1;
};

/**
 * **FacetPercentage** è una faccetta che gestisce un range tra 0 e 100.
 */
const FacetPercentage = ({
  className,
  disabled,
  disabledInfo,
  i18n: i18nCustom,
  id,
  initCollapse,
  label,
  subLabel,
  onChange = emptyFn,
  style,
  value = defaultValue,
  step = 10,
}: IFacetPercentage) => {
  const [valueTemp, setValueTemp] = React.useState(defaultValue);
  const onChangeDragging = React.useCallback((e, value: number[]) => {
    setValueTemp(value);
  }, []);
  const onChangeMouseUp = React.useCallback(
    (e, value: number[]) => {
      onChange({ id, type, value });
    },
    [id, onChange]
  );
  const i18n = {
    ...i18nDefault,
    ...i18nCustom,
  };

  React.useEffect(() => {
    if (!isEmpty(value)) setValueTemp(value);
  }, [value]);

  return (
    <FacetBase
      badgeCount={prepareBadge(value)}
      badgeLabel={i18n.clear}
      onClickBadge={onChange}
      id={id}
      type={type}
      label={label}
      subLabel={subLabel}
      initCollapse={initCollapse}
      className={className}
      style={style}
      disabled={disabled}
      disabledInfo={disabledInfo}
    >
      <div style={{ padding: "0 25px" }}>
        <Slider
          valueLabelFormat={getLabel}
          valueLabelDisplay="auto"
          step={step}
          marks
          defaultValue={defaultValue}
          value={valueTemp}
          track="normal"
          min={defaultValue[0]}
          max={defaultValue[1]}
          onChange={onChangeDragging}
          onChangeCommitted={onChangeMouseUp}
        />
      </div>
    </FacetBase>
  );
};

export default FacetPercentage;
