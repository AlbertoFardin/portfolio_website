import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
  stickyTableOuter: {
    position: "relative",
    overflow: "hidden",
  },

  fakeBorder: {
    position: "absolute",
    "z-index": 3,
  },

  stickyTable: {
    position: "relative",
    overflow: "auto",
  },
  innerGrid: {
    position: "relative",
    overflow: "hidden",

    "& > *": {
      overflow: "hidden",
    },
  },
  corner: {
    "z-index": 2,
    position: "sticky",
    overflow: "visible",
  },
  cornerInner: {
    "background-color": "white",
    position: "absolute",
  },
  topHeader: {
    top: 0,
  },
  leftHeader: {
    left: 0,
  },
  bottomHeader: {
    bottom: 0,
  },
  rightHeader: {
    right: 0,
  },
  stickyHeader: {
    position: "sticky",
    "z-index": 1,
  },
});

export default useStyles;
