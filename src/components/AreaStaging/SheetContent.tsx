import * as React from "react";
import SheetReadOnly from "../SheetReadOnly";
import { TypeCell } from "../../componentsBase/StickyGrid";
import { IColumnSc, IItemEs, IItemStagingArea } from "../../interfaces";
import Divider from "@material-ui/core/Divider";
import { ContextColumns } from "./contexts";

const columnsNotShow = new Set([
  TypeCell.Thumbnail,
  TypeCell.MultipleThumbnail,
  TypeCell.Avatar,
  TypeCell.MultipleAvatar,
  TypeCell.User,
]);

interface ISheetContent {
  assetData: IItemEs<IItemStagingArea>;
}

const SheetContent = ({ assetData }: ISheetContent) => {
  const columns = React.useContext(ContextColumns);
  const columnsFixed: IColumnSc[] = React.useMemo(() => {
    return columns.filter((c) => !columnsNotShow.has(c.type));
  }, [columns]);

  return (
    <>
      <Divider />
      <SheetReadOnly
        assetData={assetData.data}
        columns={columnsFixed}
        fullscreen={false}
      />
    </>
  );
};

export default SheetContent;
