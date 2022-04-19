import * as React from "react";
import { PANEL_DETAIL_WIDTH } from "../../constants";
import BtnExpand from "./BtnExpand";
import DrawerLateral from "./PanelLateral";
import DrawerFullscreen from "./PanelFullscreen";
import SheetContent, { ISheetContent } from "./SheetContent";
import { SheetLayout } from "../../interfaces";

const onDefaultError = (error, info) => {
  console.log("⚠️ react-error-boundary", { error, info });
};

interface IDrawerDetail extends ISheetContent {
  className?: string;
  width?: number;
  widthCollapsed?: number;
  layout: SheetLayout;
  onChange: (l: SheetLayout) => void;
}

const DrawerDetail = ({
  className,
  classNameTitle,
  classNameContent,
  width = PANEL_DETAIL_WIDTH,
  widthCollapsed = 27,
  layout,
  title,
  content,
  status,
  onChange,
  onError = onDefaultError,
  onReset,
}: IDrawerDetail) => {
  const contentMemo = React.useMemo(
    () => (
      <SheetContent
        classNameTitle={classNameTitle}
        classNameContent={classNameContent}
        title={title}
        content={content}
        status={status}
        onError={onError}
        onReset={onReset}
      />
    ),
    [classNameTitle, classNameContent, content, status, onError, onReset, title]
  );

  return (
    <>
      <BtnExpand layout={layout} onChange={onChange} />
      <DrawerLateral
        layout={layout}
        content={contentMemo}
        className={className}
        width={width}
        widthCollapsed={widthCollapsed}
      />
      <DrawerFullscreen
        layout={layout}
        content={contentMemo}
        className={className}
      />
    </>
  );
};

export default DrawerDetail;
