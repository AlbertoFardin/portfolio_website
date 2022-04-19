import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(() => ({
  listContainer: {
    flex: 1,
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
    width: 270,
    height: 350,
    position: "relative",
  },
  listContainerScroll: {
    "overflow-y": "auto",
    flex: 1,
  },
  listContainerGroupTitle: {
    "margin-left": 5,
  },
  listItem: {
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
  },
  listItemSelectAll: {
    "& *": {
      "font-weight": "bold",
      "font-size": 11,
    },
  },
  listItemNested: {
    "margin-left": 15,
  },
  listItemLabelDisabled: {
    "font-style": "italic",
    opacity: 0.3,
    "margin-right": 10,
  },
}));

export default useStyles;
