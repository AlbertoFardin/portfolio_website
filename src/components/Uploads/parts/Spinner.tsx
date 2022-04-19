import CircularProgress from "@material-ui/core/CircularProgress";
import * as React from "react";

interface ISpinner {
  value?: number;
}

const Spinner = ({ value = 0 }: ISpinner) => (
  <CircularProgress
    variant={value ? "determinate" : "indeterminate"}
    value={value}
    size={16}
    style={{
      color: "#039BE5",
      padding: "0 9px",
    }}
  />
);

export default Spinner;
