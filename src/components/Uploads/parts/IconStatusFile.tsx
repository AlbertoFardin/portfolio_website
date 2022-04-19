import * as React from "react";
import Btn, { IBtn } from "../../../componentsBase/Btn";
import IFileStatus from "../IFileStatus";
import Spinner from "./Spinner";
import * as Colors from "../../../componentsBase/style/Colors";

interface IIconStatusFile {
  fileStatus: string;
  tooltip?: string;
  spinnerProgress?: number;
  spinner?: boolean;
}

const IconStatusFile = ({
  fileStatus,
  tooltip,
  spinnerProgress = 0,
  spinner = false,
}: IIconStatusFile) => {
  const i: IBtn = {
    variant: "light",
    selected: true,
    tooltip,
  };

  if (spinner) return <Spinner />;

  switch (fileStatus) {
    case IFileStatus.Uploading:
      return <Spinner value={spinnerProgress} />;
    case IFileStatus.Completed:
      i.color = Colors.Green;
      i.iconStyle = { color: i.color };
      return <Btn {...i} icon="check_circle" />;
    case IFileStatus.Error:
      i.color = Colors.Red;
      i.iconStyle = { color: i.color };
      return <Btn {...i} icon="warning" />;
    case IFileStatus.Abort:
      return <Btn {...i} icon="cancel" />;
    case IFileStatus.Waiting:
      return <Btn {...i} icon="radio_button_unchecked" />;
    default:
      return null;
  }
};

export default IconStatusFile;
