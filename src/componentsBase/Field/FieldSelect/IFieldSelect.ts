import * as React from "react";
import { PopoverOrigin } from "@material-ui/core";
import { ILabel } from "../Label";
import { IActions } from "../../ActionsMenu";
import IFieldSelectItem from "./IFieldSelectItem";

interface IFieldSelect {
  /** component CSS classes */
  className?: string;
  /** menu options CSS classes */
  classNameMenu?: string;
  /** Function to render chip  */
  getChipLabel?: (item: IFieldSelectItem) => string;
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
  /** Max items you can selected */
  itemsSelectedMaxLength?: number;
  /** If true, the items in menu options was sorted and grouped by key "title" */
  itemsGroupedByTitle?: boolean;
  /** Fallback title of group without one. see "itemsGroupedByTitle" */
  itemsGroupedByTitleNoLabel?: string;
  /** Label of the component. It must be a string or an ILabel[] */
  label?: string | ILabel[] | React.ReactElement;
  /** Show loading spinner */
  loading?: boolean;
  /** Callback fired when close menu options */
  onClose?: () => void;
  /** Callback fired when value change */
  onChange?: (item: IFieldSelectItem, array: IFieldSelectItem[]) => void;
  /** Callback fired when search input */
  onSearch?: (text: string) => void;
  /** BtnMenu actions configs, if empty Btn isn't render */
  menu?: IActions[];
  /** BtnMenu disable */
  menuDisabled?: boolean;
  /** BtnMenu visible on mouse hover */
  menuOnHover?: boolean;
  /** BtnMenu callback on close menu */
  menuOnClose?: () => void;
  /** Array of ITEMS render inside the menu options if "onSearch" is valorise. Interface:
   *
   * - **id**: string; // identifier
   * - **title**?: string; // title items grouped
   * - **label**: string; // label
   * - **subLabel**?: string; // second label render under label
   * - **selected**?: boolean; // selected
   * - **avatar**?: string; // avatar url
   * - **onClick**?: ()=>void; // callback fire on click
   */
  options?: IFieldSelectItem[];
  /** The short hint displayed in the input before the user enters a value */
  placeholder?: string;
  /** This is the point on the anchor where the popover's anchorEl will attach to.
   * This is not used when the anchorReference is 'anchorPosition'.
   * Options: vertical: [top, center, bottom]; horizontal: [left, center, right]
   */
  popoverAnchorOrigin?: PopoverOrigin;
  /** This is the point on the popover which will attach to the anchor's origin.
   * Options: vertical: [top, center, bottom, x(px)]; horizontal: [left, center, right, x(px)].
   */
  popoverTransformOrigin?: PopoverOrigin;
  /** If true, the input element is in read only */
  readOnly?: boolean;
  /** If true, the menu options render a search input */
  searchable?: boolean;
  /** component CSS style */
  style?: React.CSSProperties;
  /** Array of CHIPS render inside the fieldset. Interface:
   *
   * - **id**: string; // identifier
   * - **title**?: string; // title items grouped
   * - **label**: string; // label
   * - **subLabel**?: string; // second label render under label
   * - **selected**?: boolean; // selected
   * - **avatar**?: string; // avatar url
   * - **onClick**?: ()=>void; // callback fire on click
   */
  value?: IFieldSelectItem[];
  /** input autoComplete, https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill */
  autoComplete?: string;
}

export default IFieldSelect;
