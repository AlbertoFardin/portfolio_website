import makeStyles from "@material-ui/core/styles/makeStyles";

interface IStyles {
  width: number;
  inputHide: boolean;
  readOnly: boolean;
  hasText: boolean;
  hasIcon: boolean;
  hasAvatar: boolean;
}

const btnSize = 30;
const inputPaddingX = 10;
const inputWidth = ({
  width,
  hasIcon,
  hasAvatar,
  readOnly,
  hasText,
  inputHide,
}: IStyles) =>
  width -
  inputPaddingX * 2 -
  (!readOnly && hasText && !inputHide ? btnSize : 0) -
  (hasIcon ? btnSize : 0) -
  (hasAvatar ? btnSize : 0);
const inputMargin = ({ hasIcon, hasAvatar }: IStyles) =>
  0 + (hasIcon ? btnSize : 0) + (hasAvatar ? btnSize : 0);

const useStyles = makeStyles(({ spacing, typography }) => ({
  container: {
    margin: spacing(1, 0, 0, 0),
    position: "relative",
    fontFamily: typography.body1.fontFamily,
    "& figure": {
      margin: 0,
    },
    cursor: "text",
    width: "100%",
    padding: spacing(0, 0, 1, 0),
    fontSize: "inherit",
    borderBottom: ({ readOnly }: IStyles) => (readOnly ? "none" : "initial"),
  },
  error: {
    borderBottom: "2px solid red",
  },
  linkPopover: {
    padding: spacing(2, 2, 2, 2),
  },
  linkTextField: {
    width: "100%",
  },
  inlineToolbar: {
    maxWidth: "180px",
    position: "absolute",
    padding: "5px",
    zIndex: 10,
  },
  field: {
    position: "relative",
    "box-sizing": "border-box",
    borderStyle: "solid",
    borderColor: "#dddddd",
    borderRadius: 5,
    borderWidth: "1px",
    fontSize: "12px",
    "background-color": "#FFFFFF",
    display: "inline-flex",
    padding: `4px ${inputPaddingX}px`,
    "min-height": ({ readOnly, hasText, inputHide }: IStyles) =>
      (readOnly && !hasText) || inputHide ? 42 : 75,
    "flex-direction": "column",
    "align-items": "stretch",
  },
  fieldReadonly: {
    "background-color": "#F5F5F5 !important",
  },
  divMuiRichEditor: {
    display: ({ inputHide }: IStyles) => (inputHide ? "none" : "block"),
    position: "relative",
    width: inputWidth,
    overflowX: "hidden",
    overflowY: "auto",
    flex: 1,
    "margin-left": inputMargin,
    "& div": {
      ...typography.body1,
      color: ({ hasText }: IStyles) =>
        hasText ? typography.body1.color : "#b3b3b3",
    },
  },
  divNotFocus: {
    position: "absolute",
    height: "100%",
    width: "100%",
    top: 0,
    left: 0,
    zIndex: 500,
  },
  btnShowToolbar: {
    display: ({ readOnly }: IStyles) => (readOnly ? "none" : "block"),
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 500,
    margin: 0,
  },
  adornmentIcon: {
    left: 5,
    bottom: 5,
    position: "absolute",
    margin: 0,
  },
  adornmentAvatar: {
    left: ({ hasIcon }: IStyles) => 5 + (hasIcon ? btnSize : 0),
    bottom: 5,
    position: "absolute",
    margin: 0,
  },
  adornmentElement: {
    width: inputWidth,
    "margin-left": inputMargin,
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
  },
}));

export default (p: IStyles) => useStyles(p);
