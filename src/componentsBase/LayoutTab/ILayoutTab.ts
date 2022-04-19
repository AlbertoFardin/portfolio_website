import ILayoutTabPanel from "./ILayoutTabPanel";
interface ILayoutTab {
  /** Component CSS classes */
  className?: string;
  /** component CSS style */
  style?: React.CSSProperties;
  /** Callback fired when the value changes */
  onChange?: (tabId: string) => void;
  /** Array of panels config (see ILayoutTabPanel) */
  panels: ILayoutTabPanel[];
  /** Id of selected panel (see "panels") */
  panelSelectedId: string;
  /** Component to render to the right of Tabs */
  tabsContentRight?: JSX.Element | React.ReactNode;
  /** Component to render to the left of Tabs */
  tabsContentLeft?: JSX.Element | React.ReactNode;
  /** hidden Tabs if set false */
  tabsVisible?: boolean;
}

export default ILayoutTab;
