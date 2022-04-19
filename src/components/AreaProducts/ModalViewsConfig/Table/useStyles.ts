import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
  header: {
    padding: "0 30px",
    height: 50,
    display: "flex",
    "flex-direction": "row",
    "align-items": "stretch",
  },
  headerLabel: {
    padding: "0 10px",
  },
  row: {
    height: 40,
    display: "flex",
    "flex-direction": "row",
    "align-items": "stretch",
  },
  cell: {
    position: "relative",
    flex: 1,
    "min-width": 180,
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
  },
  cellFirst: {
    position: "relative",
    flex: 1,
    "min-width": 100,
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
  },
});

export default useStyles;
