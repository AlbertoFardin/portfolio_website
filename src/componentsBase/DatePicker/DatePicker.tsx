/* eslint-disable */
import * as moment from "moment";
import * as React from "react";
import { DayPickerRangeController } from "react-dates";
import "react-dates/initialize";
import { emptyFn } from "../utils/common";

export interface DatePickerProps {
  daySize?: number;
  enableOutsideDays?: boolean;
  endDate?: number;
  isDayBlocked?: (a: any) => boolean;
  hideKeyboardShortcutsPanel?: boolean;
  minimumNights?: number;
  navPrev?: React.ReactNode;
  navNext?: React.ReactNode;
  noBorder?: boolean;
  numberOfMonths?: number;
  onDatesChange?: (...key: any) => any;
  onFocusChange?: (...key: any) => any;
  onOutsideClick?: (...key: any) => any;
  singleDate?: boolean;
  startDate?: number;
}

interface State {
  focusedInput: string;
}

class DatePicker extends React.Component<DatePickerProps, State> {
  public static defaultProps = {
    daySize: 20,
    enableOutsideDays: true,
    endDate: null,
    isDayBlocked: () => false,
    hideKeyboardShortcutsPanel: true,
    minimumNights: 0,
    navNext: (
      <div
        style={{
          color: "#484848",
          left: 308,
          position: "absolute",
          top: -3,
          zIndex: 1,
        }}
        className="material-icons"
        children="keyboard_arrow_right"
      />
    ),
    navPrev: (
      <div
        style={{
          color: "#484848",
          left: 22,
          position: "absolute",
          top: -3,
          zIndex: 1,
        }}
        className="material-icons"
        children="keyboard_arrow_left"
      />
    ),
    noBorder: true,
    numberOfMonths: 2,
    onDatesChange: emptyFn,
    onFocusChange: emptyFn,
    onOutsideClick: emptyFn,
    singleDate: false,
    startDate: null,
  };

  constructor(p) {
    super(p);
    this.state = {
      focusedInput: "startDate",
    };
  }

  public onFocusChange = (focusedInput) => {
    const { onFocusChange, singleDate } = this.props;
    this.setState(
      {
        focusedInput: !focusedInput || singleDate ? "startDate" : focusedInput,
      },
      () => onFocusChange(focusedInput)
    );
  };

  public onOutsideClick = (event) => {
    const { onOutsideClick } = this.props;
    this.setState(
      {
        focusedInput: "startDate",
      },
      () => onOutsideClick(event)
    );
  };

  public onDatesChange = ({ startDate, endDate }) => {
    const { onDatesChange, singleDate } = this.props;
    let startTime = 0;
    let endTime = 0;

    if (startDate) {
      // fix startDate to 00:00
      const date = startDate.toDate();
      date.setHours(0);
      date.setMinutes(0);
      startTime = date.getTime();
    }
    if (endDate) {
      // fix endDate to 23:59
      const date =
        startDate === endDate ? startDate.toDate() : endDate.toDate();
      date.setHours(23);
      date.setMinutes(59);
      endTime = date.getTime();
    }

    if (singleDate) {
      // fix endDate to 23:59 of same day
      const date = startDate.toDate();
      date.setHours(23);
      date.setMinutes(59);
      endTime = date.getTime();
    }

    if (!startTime && !endDate) return null;

    return onDatesChange({
      startDate: startTime || null,
      endDate: endTime || null,
    });
  };

  getNavPrev = () => (
    <div
      style={{
        color: "#484848",
        left: 22,
        position: "absolute",
        top: -3,
        zIndex: 1,
      }}
      className="material-icons"
      children="keyboard_arrow_left"
    />
  );

  getNavNext = (numberOfMonths: number) => (
    <div
      style={{
        color: "#484848",
        left: numberOfMonths === 1 ? 140 : 143 * numberOfMonths + 22,
        position: "absolute",
        top: -3,
        zIndex: 1,
      }}
      className="material-icons"
      children="keyboard_arrow_right"
    />
  );

  public render() {
    const {
      startDate,
      endDate,
      isDayBlocked,
      numberOfMonths,
      noBorder,
      minimumNights,
      hideKeyboardShortcutsPanel,
      daySize,
      enableOutsideDays,
    } = this.props;
    const { focusedInput } = this.state;
    return (
      <DayPickerRangeController
        numberOfMonths={numberOfMonths}
        noBorder={noBorder}
        minimumNights={minimumNights}
        hideKeyboardShortcutsPanel={hideKeyboardShortcutsPanel}
        daySize={daySize}
        enableOutsideDays={enableOutsideDays}
        navPrev={this.getNavPrev()}
        navNext={this.getNavNext(numberOfMonths)}
        focusedInput={focusedInput}
        isDayBlocked={isDayBlocked}
        startDate={startDate ? moment(startDate) : null}
        endDate={endDate ? moment(endDate) : null}
        onDatesChange={this.onDatesChange}
        onFocusChange={this.onFocusChange}
        onOutsideClick={this.onOutsideClick}
      />
    );
  }
}

export default DatePicker;
