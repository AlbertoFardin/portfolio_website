import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import TypographyEllipsis from "../../TypographyEllipsis";
import * as Colors from "../../style/Colors";
import BtnCopyToClipboard from "../../StickyGrid/CellContent/CellString/BtnCopyToClipboard";

const useStyles = makeStyles({
  codeContainer: {
    height: 30,
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
  },
  typo: {
    "max-width": 210,
    color: Colors.Gray1,
  },
});

interface IContainerCode {
  code: string;
}

const ContainerCode = ({ code }: IContainerCode) => {
  const classes = useStyles();
  const [subtitleHover, setSubtitleHover] = React.useState(false);
  const subtitleMouseEnter = React.useCallback(
    () => setSubtitleHover(true),
    []
  );
  const subtitleMouseLeave = React.useCallback(
    () => setSubtitleHover(false),
    []
  );

  return (
    <div
      className={classes.codeContainer}
      onMouseEnter={subtitleMouseEnter}
      onMouseLeave={subtitleMouseLeave}
    >
      <Typography
        className={classes.typo}
        style={{ marginRight: 5 }}
        variant="caption"
        children="Code:"
      />
      <TypographyEllipsis
        className={classes.typo}
        variant="caption"
        children={code}
      />
      <BtnCopyToClipboard visibled={subtitleHover} value={code} />
    </div>
  );
};

export default ContainerCode;
