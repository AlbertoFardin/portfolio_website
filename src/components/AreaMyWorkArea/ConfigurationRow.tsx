import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

interface IStyles {
  backgroundColor: string;
}

const useStyles = makeStyles({
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: " center",
    backgroundColor: ({ backgroundColor }: IStyles) => backgroundColor,
    borderBottomStyle: "solid",
    borderWidth: "1px",
    borderColor: "lightgrey",
  },
  cell: {
    display: "flex",
    justifyContent: "center",
  },
});

const ConfigurationRow = ({
  title,
  level,
  filter,
  column,
  detailPanel,
  backgroundColor,
}: {
  title: JSX.Element | React.ReactNode;
  level?: JSX.Element | React.ReactNode;
  filter: JSX.Element | React.ReactNode;
  column: JSX.Element | React.ReactNode;
  detailPanel: JSX.Element | React.ReactNode;
  backgroundColor?: string;
}) => {
  const classes = useStyles({ backgroundColor });
  return (
    <div className={classes.row}>
      <div style={{ width: 250 }}>{title}</div>
      <div style={{ width: 100 }} className={classes.cell}>
        {level}
      </div>
      <div style={{ width: 100 }} className={classes.cell}>
        {filter}
      </div>
      <div style={{ width: 100 }} className={classes.cell}>
        {column}
      </div>
      <div style={{ width: 110 }} className={classes.cell}>
        {detailPanel}
      </div>
    </div>
  );
};

export default ConfigurationRow;
