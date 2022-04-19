import * as React from "react";

interface ILayoutTabPanel {
  id: string;
  title?: string | JSX.Element;
  tooltip?: string | React.ReactNode | Element[];
  children: JSX.Element;
  className?: string;
  style?: React.CSSProperties;
}

export default ILayoutTabPanel;
