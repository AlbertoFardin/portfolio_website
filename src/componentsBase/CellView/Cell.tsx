import Typography from "@material-ui/core/Typography";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { cellTypeHeader, cellTypePlaceholder } from "./utils";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
  },
  header: {
    color: "#000000",
    "font-size": 12,
    "font-weight": 500,
    "letter-spacing": "0.0075em",
    "white-space": "nowrap" as const,
    width: "85%",
    "align-self": "flex-end",
    "line-height": "30px",
    "user-select": "none",
  },
});

interface ICell {
  cellHeight: number;
  cellWidth: number;
  cellRender: (props: {
    cellHeight: number;
    cellWidth: number;
    data;
    colorTheme: string;
    selected: boolean;
  }) => JSX.Element;
  classes?: {
    root: string;
    header: string;
  };
  data?: {
    cellType?: string;
    label?: string;
  };
  index?: number;
  selected?: boolean;
  colorTheme: string;
  style?: React.CSSProperties;
}

const Cell = ({
  cellHeight = 0,
  cellWidth = 0,
  cellRender,
  colorTheme,
  index = 0,
  selected = false,
  data = {},
  style,
}: ICell) => {
  const classes = useStyles({});
  const { cellType } = data;
  const getChildren = React.useCallback(() => {
    if (!cellType) {
      // return if data is not loaded
      return null;
    }

    if (cellType === cellTypePlaceholder) {
      // return placeholder to empty cell
      return null;
    }

    if (cellType === cellTypeHeader) {
      // return header to header cell
      const { label } = data;
      return !label ? null : (
        <Typography className={classes.header} children={label} />
      );
    }

    return cellRender({
      cellHeight,
      cellWidth,
      data,
      colorTheme,
      selected,
    });
  }, [
    cellHeight,
    cellRender,
    cellType,
    cellWidth,
    classes.header,
    colorTheme,
    data,
    selected,
  ]);

  return (
    <div key={index} className={classes.root} style={style}>
      <div style={{ flex: 1 }} />
      {getChildren()}
      <div style={{ flex: 1 }} />
    </div>
  );
};

export default Cell;
