/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { ILabel } from "../Label";
import { IActions } from "../../ActionsMenu";

interface IFieldDate {
  /** component CSS classes */
  className?: string;
  /** date format passed to [moment.format()](https://momentjs.com/docs/#/displaying/format/) function*/
  dateFormat: string;
  /** Label of the component. It must be a string or an ILabel[] */
  label?: string | ILabel[] | React.ReactElement;
  /** Icon render in InputAdornment position START */
  adornmentIcon?: string;
  /** adornmentIcon's tooltip  */
  adornmentIconTooltip?: string;
  /** adornmentIcon's color  */
  adornmentIconColor?: string;
  /** Avatar render in InputAdornment position START */
  adornmentAvatar?: string;
  /** adornmentAvatar's tooltip */
  adornmentAvatarTooltip?: string;
  /** Elements render in InputAdornment position START */
  adornmentElement?: JSX.Element;
  /** Function to known if a date in calendar is disabled */
  isDayBlocked?: (n: number) => boolean;
  /** BtnMenu actions configs, if empty Btn isn't render */
  menu?: IActions[];
  /** BtnMenu disable */
  menuDisabled?: boolean;
  /** BtnMenu visible on mouse hover */
  menuOnHover?: boolean;
  /** BtnMenu callback on close menu */
  menuOnClose?: () => void;
  /** Callback fired when the value is changed */
  onChange?: (n: number | null) => void;
  /** The short hint displayed in the input before the user enters a value */
  placeholder?: string;
  /** If true, the input element is in read only */
  readOnly?: boolean;
  /** component CSS style */
  style?: React.CSSProperties;
  /** Timestamp of date render in input element */
  value?: number;
}

export default IFieldDate;
