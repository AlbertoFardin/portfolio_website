import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
interface IStyles {
  height: number;
  width: number;
  top: number;
  left: number;
  backgroundColor: string;
}
const useStyles = makeStyles({
  gridCanton: {
    height: 0,
    position: "sticky",
    top: ({ top }: IStyles) => top,
    left: ({ left }: IStyles) => left,
    "z-index": 2,
    "box-sizing": "border-box",
  },
  gridDivAbsolute: {
    display: "flex",
    "vertical-align": "middle",
    "justify-content": "center",
    "align-items": "center",
    position: "absolute",
    height: ({ height }: IStyles) => height,
    width: ({ width }: IStyles) => width,
    "background-color": ({ backgroundColor }: IStyles) => backgroundColor,
  },
  shadowHeader: {
    "box-shadow": "rgba(0, 0, 0, 0.1) -5px 2px 5px 0px",
  },
  shadowSidebar: {
    "box-shadow": "rgba(0, 0, 0, 0.1) 2px -5px 5px -1px",
  },
  shadowAll: {
    "box-shadow":
      "rgba(0, 0, 0, 0.1) 2px -5px 5px -1px, rgba(0, 0, 0, 0.1) -5px 2px 5px 0px",
  },
});

interface IGridCanton {
  backgroundColor: string;
  cellRender: () => JSX.Element;
  height: number;
  width: number;
  top: number;
  left: number;
  scrolledLeft?: boolean;
  scrolledTop?: boolean;
}
const GridCanton = ({
  backgroundColor,
  cellRender,
  height,
  width,
  scrolledLeft,
  scrolledTop,
  top,
  left,
}: IGridCanton) => {
  const classes = useStyles({
    backgroundColor,
    height,
    width,
    top,
    left,
  });
  return (
    <div className={classes.gridCanton}>
      <div
        className={classnames({
          [classes.gridDivAbsolute]: true,
          [classes.shadowHeader]: scrolledTop && !scrolledLeft,
          [classes.shadowSidebar]: scrolledLeft && !scrolledTop,
          [classes.shadowAll]: scrolledTop && scrolledLeft,
        })}
        children={cellRender()}
      />
    </div>
  );
};

export default React.memo(GridCanton);
