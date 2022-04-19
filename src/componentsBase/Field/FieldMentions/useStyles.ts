import makeStyles from "@material-ui/core/styles/makeStyles";
import hexToRgbA from "../../utils/hexToRgbA";

export const suggestionsStyle = {
  boxShadow:
    "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
  borderRadius: 12,
};

interface IStyles {
  readOnly: boolean;
}

const useStyles = makeStyles(({ typography, palette }) => ({
  fieldMentions: {
    position: "relative",
    padding: "7px 10px",
    "border-radius": 5,
    border: "1px solid #ddd",
    "box-sizing": "border-box",
    "background-color": ({ readOnly }: IStyles) =>
      readOnly ? "#F5F5F5" : "#fff",
  },
  mentionsInput: {
    "& *": {
      outline: "none",
      "border-color": "transparent",
      "border-width": "2px !important",
      "overflow-y": "overlay !important",
      "max-height": "300px !important",
      ...typography.body1,
    },
    "& textarea": {
      "border-width": "0 !important",
      "min-height": "20px !important",
      "&::placeholder": {
        "font-style": "italic",
        opacity: 0.35,
      },
    },
  },
  mentionsUser: {
    "border-radius": 3,
    "background-color": hexToRgbA(palette.primary.main, 0.15),
  },
}));

export default useStyles;
