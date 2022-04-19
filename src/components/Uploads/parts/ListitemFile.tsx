import MUIListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import IconStatusFile from "./IconStatusFile";

interface IListitemFile {
  file: File;
  fileStatus: string;
  tooltip?: string;
  uploadProgress: number;
  puttingS3: boolean;
  style: React.CSSProperties;
}

const ListitemFile = ({
  file,
  fileStatus,
  tooltip,
  uploadProgress,
  puttingS3,
  style,
}: IListitemFile) => {
  return (
    <MUIListItem
      style={{
        height: 40,
        padding: "3px 15px 3px 20px",
        overflow: "hidden",
        ...style,
      }}
      dense
      button={false}
    >
      <Typography
        variant="subtitle1"
        style={{ flex: 1 }}
        noWrap
        children={file.name}
      />
      <IconStatusFile
        fileStatus={fileStatus}
        tooltip={tooltip}
        spinnerProgress={uploadProgress}
        spinner={puttingS3}
      />
    </MUIListItem>
  );
};

export default React.memo(ListitemFile);
