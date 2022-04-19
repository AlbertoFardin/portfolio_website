import * as React from "react";
import * as Colors from "../../../componentsBase/style/Colors";
import CircularProgress from "@material-ui/core/CircularProgress";

const Spinner = () => (
  <CircularProgress size={20} style={{ color: Colors.Green, marginRight: 6 }} />
);

export default Spinner;
