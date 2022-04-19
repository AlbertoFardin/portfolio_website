import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
  gridContainer: {
    height: "100%",
    flex: 1,
    display: "flex",
    "flex-direction": "column",
    position: "relative",
  },
  shadowSidebar: {
    "box-shadow": "rgba(0, 0, 0, 0.1) 2px 5px 5px -1px",
  },
});

export default useStyles;
