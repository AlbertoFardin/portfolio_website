import * as React from "react";
import * as Colors from "../../../../componentsBase/style/Colors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Icon from "@material-ui/core/Icon";
import { ContextCatalogs } from "../../contexts";

const color = Colors.Gray1;
const useStyles = makeStyles({
  icon: {
    color,
    "font-size": "15px !important",
    "vertical-align": "top",
  },
  text: {
    color,
    "font-size": 12,
    margin: "0 5px",
    "vertical-align": "top",
  },
});

interface ILabelCatalog {
  multiCatalog: boolean;
  multiLanguage: boolean;
  catalogId?: string;
  languageId?: string;
}

const LabelCatalog = ({
  multiCatalog,
  multiLanguage,
  catalogId,
  languageId,
}: ILabelCatalog) => {
  const classes = useStyles({});
  const catalogs = React.useContext(ContextCatalogs);

  const catalogName = catalogId
    ? catalogs.find((c) => c.id === catalogId).displayName
    : "-";
  const languageName = languageId ? languageId.toLocaleUpperCase() : "-";

  if (!multiCatalog && !multiLanguage) return null;

  return (
    <>
      <Icon className={classes.icon} children="auto_stories" />
      <span className={classes.text} children={catalogName} />
      {!languageId ? null : (
        <>
          <span className={classes.text} children=" " />
          <Icon className={classes.icon} children="flag" />
          <span className={classes.text} children={languageName} />
        </>
      )}
    </>
  );
};

export default LabelCatalog;
