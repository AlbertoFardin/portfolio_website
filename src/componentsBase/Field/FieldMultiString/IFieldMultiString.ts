import * as React from "react";
import { ILabel } from "../Label";
import { IActions } from "../../ActionsMenu";

export interface IItem {
  id: string;
  label: string;
}

interface IRenderChip {
  id: string;
  label: string;
  readOnly: boolean;
  onClick: (id: string) => void;
}

interface IFieldMultiString {
  /** component CSS classes */
  className?: string;
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
  /** Function to return the component to render as chips */
  renderChip?: (r: IRenderChip) => JSX.Element | React.ReactNode;
  /** Max chips you can insert */
  itemsSelectedMaxLength?: number;
  /** Label of the component. It must be a string or an ILabel[] */
  label?: string | ILabel[] | React.ReactElement;
  /** Callback fired when value change */
  onChange?: (item: IItem, array: IItem[]) => void;
  /** Callback fired when input click */
  onClick?: () => void;
  /** BtnMenu actions configs, if empty Btn isn't render */
  menu?: IActions[];
  /** BtnMenu disable */
  menuDisabled?: boolean;
  /** BtnMenu visible on mouse hover */
  menuOnHover?: boolean;
  /** BtnMenu callback on close menu */
  menuOnClose?: () => void;
  /** The short hint displayed in the input before the user enters a value */
  placeholder?: string;
  /** If true, the input element is in read only */
  readOnly?: boolean;
  /** If true, the inner text input element is in read only */
  readOnlyInput?: boolean;
  /** component CSS style */
  style?: React.CSSProperties;
  /** Array of item to render inside the input */
  value?: IItem[];
}

export default IFieldMultiString;
