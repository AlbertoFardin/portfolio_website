import Popover from "@material-ui/core/Popover";
import * as moment from "moment";
import * as React from "react";
import "react-dates/initialize";
import Btn from "../../Btn";
import DatePicker from "../../DatePicker";
import { emptyFn } from "../../utils/common";

interface IArgs {
  startDate: number;
  endDate: number;
}

interface IPopoverDatePicker {
  buttonLabel: string;
  disabled: boolean;
  endDate: number;
  onChange?: (args: IArgs) => void;
  onOutsideClick?: (args: IArgs) => void;
  onFocusInput?: (focusedInput: string) => void;
  startDate: number;
  singleDate?: boolean;
  dateFormat: string;
}

const PopoverDatePicker = ({
  buttonLabel = "Select a Date",
  disabled = false,
  endDate = null,
  onChange = emptyFn,
  onOutsideClick = emptyFn,
  onFocusInput = emptyFn,
  startDate = null,
  singleDate = false,
  dateFormat,
}: IPopoverDatePicker) => {
  const startMoment = startDate ? moment(startDate) : null;
  const endMoment = endDate ? moment(endDate) : null;
  const startFormat = startMoment ? startMoment.format(dateFormat) : null;
  const endFormat = endMoment ? endMoment.format(dateFormat) : null;
  const showOneDate = startFormat === endFormat || !endFormat;
  const label =
    !startDate && !endDate
      ? buttonLabel
      : showOneDate
      ? `${startFormat}`
      : `${startFormat} - ${endFormat}`;
  const [pickerStartDate, setPickerStartDate] = React.useState(startDate);
  const [pickerEndDate, setPickerEndDate] = React.useState(endDate);
  const [openPopover, setOpenPopover] = React.useState(false);
  const refBtn = React.useRef(null);
  const onClickShowPopover = React.useCallback(() => {
    setOpenPopover(true);
    setPickerStartDate(startDate);
    setPickerEndDate(endDate);
  }, [endDate, startDate]);
  const onDatesChangeMemoized = React.useCallback(
    ({ startDate: s, endDate: e }) => {
      setPickerStartDate(s);
      setPickerEndDate(e);
      if (singleDate || (s && e)) {
        setOpenPopover(false);
        setPickerStartDate(null);
        setPickerEndDate(null);
        onChange({ startDate: s, endDate: e });
      }
    },
    [onChange, singleDate]
  );
  const onOutsideClickMemoized = React.useCallback(() => {
    setOpenPopover(false);
    setPickerStartDate(null);
    setPickerEndDate(null);
    onOutsideClick({ startDate, endDate });
  }, [endDate, onOutsideClick, startDate]);
  const onFocusChange = React.useCallback(
    (focusedInput) => {
      onFocusInput(focusedInput);
    },
    [onFocusInput]
  );
  return (
    <>
      <div
        ref={refBtn}
        style={{
          position: "relative",
          display: "flex",
          flex: 1,
          flexDirection: "row",
          margin: "0 15px",
        }}
      >
        <Btn
          variant={!startDate && !endDate ? "bold" : "light"}
          onClick={onClickShowPopover}
          disabled={disabled}
          label={label}
          style={{ margin: 0, width: "100%", maxWidth: 999 }}
          selected={!!startDate || !!endDate}
        />
      </div>
      <Popover
        open={openPopover}
        anchorEl={refBtn.current}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <DatePicker
          startDate={pickerStartDate}
          endDate={pickerEndDate}
          singleDate={singleDate}
          onDatesChange={onDatesChangeMemoized}
          onFocusChange={onFocusChange}
          onOutsideClick={onOutsideClickMemoized}
        />
      </Popover>
    </>
  );
};

export default React.memo(PopoverDatePicker);
