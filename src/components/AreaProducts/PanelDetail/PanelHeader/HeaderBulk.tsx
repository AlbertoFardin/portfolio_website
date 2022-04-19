import * as React from "react";
import Typography from "@material-ui/core/Typography";
import { IProduct } from "../../../../interfaces";
import Btn from "../../../../componentsBase/Btn";
import Tooltip from "../../../../componentsBase/Tooltip";

interface IHeaderBulk {
  assetDatas: IProduct[];
}

const HeaderBulk = ({ assetDatas }: IHeaderBulk) => {
  return (
    <>
      <Tooltip title={assetDatas.map((a) => a.id).join(", ")}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Btn icon="drive_file_rename_outline" />
          <Typography
            style={{ marginRight: 5 }}
            variant="subtitle2"
            children="Bulk Detail"
          />
          <Typography
            variant="body1"
            children={` (${assetDatas.length} products)`}
          />
        </div>
      </Tooltip>
    </>
  );
};

export default HeaderBulk;
