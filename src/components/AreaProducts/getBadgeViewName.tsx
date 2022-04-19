import * as React from "react";
import * as Colors from "../../componentsBase/style/Colors";
import { IViewDetail, ViewCheck, ViewType } from "../../interfaces";
import Typography from "@material-ui/core/Typography";
import { IBtn } from "../../componentsBase/Btn";

const getIcon = (check: ViewCheck): string => {
  switch (check) {
    case ViewCheck.CHECK:
    case ViewCheck.CHECK_TO_VERIFY:
      return "check_circle";
    default:
      return "";
  }
};

interface IGetBadgeViewName {
  viewDetail: IViewDetail;
  style?: React.CSSProperties;
}

const getBadgeViewName = ({ viewDetail, style }: IGetBadgeViewName): IBtn => {
  const { viewName, viewType, check } = viewDetail;
  const labelRequired = viewType === ViewType.MANDATORY;
  const color = check === ViewCheck.CHECK ? Colors.Purple : Colors.Gray2;

  return {
    color,
    icon: getIcon(check),
    label: viewName,
    labelRequired,
    style: {
      minWidth: 40,
      padding: "0 5px",
      ...style,
    },
    tooltip: (
      <Typography
        style={{ color: "#fff" }}
        variant="body1"
        children={
          <>
            <span children={`View ${viewName}`} />
            {!labelRequired ? null : (
              <span style={{ color: "#f00", marginLeft: 2 }} children={"*"} />
            )}
            {check !== ViewCheck.CHECK_TO_VERIFY ? null : (
              <>
                <br />
                <span children="New media unchecked" />
              </>
            )}
            {check !== ViewCheck.CHECK ? null : (
              <>
                <br />
                <span children="Checked" />
              </>
            )}
          </>
        }
      />
    ),
  };
};

export default getBadgeViewName;
