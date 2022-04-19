import * as React from "react";
import IFacetType from "../IFacetType";
import FacetBase from "../utils/FacetBase";
import PopoverDatePicker from "./PopoverDatePicker";
import IFacetDatePicker from "./IFacetDatePicker";
import { emptyFn } from "../../utils/common";

const valueDefault = {
  startDate: null,
  endDate: null,
};
const i18nDefault = {
  clear: "clear",
  buttonLabel: "Select a Date",
};
const type = IFacetType.DATEPICKER;

/**
 * **DatePicker** è una faccetta che gestisce un oggetto con start date e end date.
 *
 * Questo componente usa il date-picker fornito dalla libreria esterna [react-dates](http://airbnb.io/react-dates), opportunamente stilizzata.
 */
const FacetDatePicker = ({
  className,
  disabled,
  disabledInfo,
  i18n: i18nCustom,
  id,
  initCollapse,
  label,
  subLabel,
  onChange = emptyFn,
  singleDate,
  style,
  value: valueInit = valueDefault,
  dateFormat,
}: IFacetDatePicker) => {
  const i18n = {
    ...i18nDefault,
    ...i18nCustom,
  };
  const value = {
    ...valueDefault,
    ...valueInit,
  };
  const { startDate, endDate } = value;
  const onCbChange = React.useCallback(
    ({ startDate: s, endDate: e }) => {
      onChange({
        id,
        type,
        value: {
          startDate: s,
          endDate: e,
        },
      });
    },
    [id, onChange]
  );
  return (
    <FacetBase
      badgeCount={startDate ? 1 : 0}
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
      <div
        key={`${startDate}_${endDate}`}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          flex: 1,
        }}
      >
        <PopoverDatePicker
          disabled={disabled}
          endDate={endDate}
          onChange={onCbChange}
          startDate={startDate}
          buttonLabel={i18n.buttonLabel}
          singleDate={singleDate}
          onOutsideClick={onCbChange}
          dateFormat={dateFormat}
        />
      </div>
    </FacetBase>
  );
};

export default FacetDatePicker;
