/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { ILabel } from "../Label";
import { IActions } from "../../ActionsMenu";

interface IFieldText {
  /** If true, the input element will be focused during the first mount */
  autoFocus?: boolean;
  /** component CSS classes */
  className?: string;
  /** debounce dell'onChange in millisecond */
  debounce?: number;
  /** Label of the component. It must be a string or an ILabel[] */
  label?: string | ILabel[] | React.ReactElement;
  /** Pass a ref to the input element */
  inputRef?: React.MutableRefObject<any>;
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
  /** BtnMenu actions configs, if empty Btn isn't render */
  menu?: IActions[];
  /** BtnMenu disable */
  menuDisabled?: boolean;
  /** BtnMenu visible on mouse hover */
  menuOnHover?: boolean;
  /** BtnMenu callback on close menu */
  menuOnClose?: () => void;
  /** If true, a textarea element will be rendered instead of an input */
  multiline?: boolean;
  /** Callback fired when the input was blured */
  onBlur?: (s: string) => void;
  /** Callback fired when the input was focused */
  onFocus?: (s: string) => void;
  /** Callback fired when the value is changed */
  onChange?: (s: string) => void;
  /** Callback fired when a key is pressed */
  onKeyPress?: (key: string, s: string) => void;
  /** The short hint displayed in the input before the user enters a value */
  placeholder?: string;
  /** If true, the input element is in read only */
  readOnly?: boolean;
  /** component CSS style */
  style?: React.CSSProperties;
  /** input type, https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types */
  type?: string;
  /** input autoComplete, https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill */
  autoComplete?: string;
  /** The value of the input element */
  value?: string;
}

export default IFieldText;
