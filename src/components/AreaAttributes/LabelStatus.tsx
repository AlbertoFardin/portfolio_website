import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Btn from "../../componentsBase/Btn";
import Tooltip from "../../componentsBase/Tooltip";
import * as Colors from "../../componentsBase/style/Colors";
import { IAttribute } from "../../interfaces";
import hasRequired from "./hasRequired";

const useStyles = makeStyles({
  labelStatus: {
    "border-radius": 3,
    display: "inline-flex",
    "flex-direction": "row",
    "align-items": "center",
    position: "relative",
    padding: "0 10px 0 0",
  },
});

interface ILabelStatus {
  assetData: IAttribute;
}

const LabelStatus = ({ assetData }: ILabelStatus) => {
  const classes = useStyles({});
  const ok = hasRequired(assetData);

  let label = "";
  if (!ok) label = "Error";
  if (assetData.isEdited) label = "Edited";
  if (assetData.isDraft) label = "New";

  let color = "";
  if (!ok) color = Colors.Red;
  if (ok && assetData.isEdited) color = Colors.Orange;
  if (ok && assetData.isDraft) color = Colors.Green;

  return !label ? null : (
    <Tooltip title={ok ? undefined : "Check all required fields"}>
      <div className={classes.labelStatus} style={{ backgroundColor: color }}>
        <Btn
          variant={"bold"}
          color={color}
          style={{ margin: 0, transition: "none" }}
          icon={ok ? "edit" : "warning"}
        />
        <Typography
          variant="body1"
          children={label}
          style={{ color: "#fff" }}
        />
      </div>
    </Tooltip>
  );
};

export default LabelStatus;
