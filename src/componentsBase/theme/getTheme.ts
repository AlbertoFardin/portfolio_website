import { createTheme } from "@material-ui/core/styles";
import IColorsTheme from "./IColorsTheme";

const getTheme = ({ color, colorLight, colorDark }: IColorsTheme) =>
  createTheme({
    props: {
      MuiTypography: {
        variantMapping: {
          subtitle1: "h6",
          subtitle2: "h6",
          body1: "p",
          body2: "p",
          caption: "p",
        },
      },
    },
    typography: {
      fontSize: 12,
      fontWeightLight: 300,
      fontWeightRegular: 300,
      fontWeightMedium: 400,
      fontWeightBold: 500,
      body1: {
        color: "#333333",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: "12px",
        fontWeight: 400,
        letterSpacing: "0.01em",
        lineHeight: 1.5,
      },
      body2: {
        color: "#333333",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: "12px",
        fontWeight: 500,
        letterSpacing: 0,
        lineHeight: 1.5,
      },
      subtitle1: {
        color: "#333333",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: "14px",
        fontWeight: 300,
        letterSpacing: "0.01em",
        lineHeight: 1.75,
      },
      subtitle2: {
        color: "#333333",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: 0,
        lineHeight: 1.75,
      },
      h3: {
        color: "#333333",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: "16px",
        fontWeight: 400,
        letterSpacing: 0,
        lineHeight: "normal",
      },
    },
    palette: {
      primary: {
        light: colorLight,
        main: color,
        dark: colorDark,
      },
      secondary: {
        light: colorLight,
        main: color,
        dark: colorDark,
      },
      action: {
        hover: "rgba(0, 0, 0, 0.05)",
      },
    },
    shape: {
      borderRadius: 10,
    },
    mixins: {
      toolbar: {
        height: 50,
        minHeight: 50,
      },
    },
  });

export default getTheme;
