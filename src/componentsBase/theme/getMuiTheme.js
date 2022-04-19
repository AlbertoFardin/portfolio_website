import { createTheme } from "@material-ui/core/styles";

export default (obj) =>
  createTheme({ typography: { useNextVariants: true }, ...obj });
