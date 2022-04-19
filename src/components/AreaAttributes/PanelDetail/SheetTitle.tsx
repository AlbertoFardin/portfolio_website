import Typography from "@material-ui/core/Typography";
import * as React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import LabelStatus from "../LabelStatus";
import { IAttribute } from "../../../interfaces";

interface ISheetTitle {
  assetData: IAttribute;
  loading: boolean;
}

const SheetTitle = ({ assetData, loading }: ISheetTitle) => {
  return (
    <>
      <Typography
        style={{ marginRight: 10 }}
        variant={"body2"}
        children="Detail"
      />
      <LabelStatus assetData={assetData} />
      {!loading ? null : (
        <CircularProgress size={20} style={{ marginLeft: 10 }} />
      )}
      <div style={{ flex: 1 }} />
    </>
  );
};

export default SheetTitle;
