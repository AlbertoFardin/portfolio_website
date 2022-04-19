import * as React from "react";
import { IProduct } from "../../../../interfaces";
import FieldCatalogId from "./FieldCatalogId";
import FieldLanguageId from "./FieldLanguageId";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { ContextCatalogs } from "../../contexts";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles({
  selectCatLang: {
    position: "relative",
    display: "flex",
    "flex-direction": "column",
  },
  divider: {
    margin: "0 10px",
  },
});

interface ISelectCatLang {
  assetdataMerge: IProduct;
  selectedCatalog: string;
  selectedLanguages: string[];
}

const SelectCatLang = ({
  assetdataMerge,
  selectedCatalog,
  selectedLanguages,
}: ISelectCatLang) => {
  const classes = useStyles({});
  const catalogs = React.useContext(ContextCatalogs);

  const catalog = catalogs.find((c) => c.id === selectedCatalog);
  const languages = React.useMemo(() => {
    return catalog ? catalog.languages : [];
  }, [catalog]);

  const noFieldCat = catalogs.length <= 1;
  const noFieldLan = languages.length <= 1;

  return (
    <div className={classes.selectCatLang}>
      {noFieldCat ? null : (
        <FieldCatalogId
          assetdataMerge={assetdataMerge}
          selectedCatalog={selectedCatalog}
        />
      )}
      {noFieldLan ? null : (
        <FieldLanguageId
          selectedCatalog={selectedCatalog}
          selectedLanguages={selectedLanguages}
        />
      )}
      {noFieldCat && noFieldLan ? null : (
        <Divider className={classes.divider} />
      )}
    </div>
  );
};

export default SelectCatLang;
