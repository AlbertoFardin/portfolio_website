import * as React from "react";
import Typography from "@material-ui/core/Typography";
import useStyles from "./useStyles";

const TableHeader = () => {
  const classes = useStyles({});
  return (
    <div className={classes.header}>
      {["VIEW", "", "MEDIA TYPE", "CATALOG", "MANDATORY"].map(
        (label, index) => (
          <div
            key={label}
            className={index <= 1 ? classes.cellFirst : classes.cell}
          >
            <Typography
              className={classes.headerLabel}
              variant={"body2"}
              children={label}
            />
          </div>
        )
      )}
    </div>
  );
};

export default TableHeader;
