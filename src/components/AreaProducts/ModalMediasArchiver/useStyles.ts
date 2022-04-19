import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(() => ({
  flex1: {
    flex: 1,
  },
  select: {
    width: 400,
    margin: "20px 0",
  },
  btnMaxWidth: {
    "max-width": 1000,
    "align-self": "flex-start",
  },
}));

export default useStyles;
