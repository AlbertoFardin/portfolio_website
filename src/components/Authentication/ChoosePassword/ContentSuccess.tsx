import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Btn from "../../../componentsBase/Btn";
import { colorTheme } from "../../../constants";
import useStyles from "../component/useStyles";

interface IContentSuccess {
  onConfirm: () => void;
  confirmLabel: string;
}

const ContentSuccess = ({ onConfirm, confirmLabel }: IContentSuccess) => {
  const classes = useStyles({});
  return (
    <>
      <Typography variant="body1" className={classes.title} children="🔑" />
      <Typography
        style={{ textAlign: "center", marginBottom: 40 }}
        variant="subtitle2"
        children="Your Warda password has been set!"
      />
      <Btn
        style={{ margin: "auto" }}
        variant="bold"
        color={colorTheme}
        label={confirmLabel}
        onClick={onConfirm}
      />
    </>
  );
};

export default ContentSuccess;
