import * as React from "react";
import LayoutDefault from "./LayoutDefault";
import LayoutFullscreen from "./LayoutFullscreen";
import ISheetContent from "./ISheetContent";

const SheetContent = (p: ISheetContent) => {
  return p.fullscreen ? <LayoutFullscreen {...p} /> : <LayoutDefault {...p} />;
};

export default SheetContent;
