import * as React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Btn from "../../../../componentsBase/Btn";
import { ACT_DETAIL } from "../reducer";
import { ContextDispatchDetail, ContextCatalogs } from "../../contexts";
import { IProduct } from "../../../../interfaces";
import { KEY_CATALOG } from "../../../../constants";
import classnames from "classnames";
import getMenuItem from "./getMenuItem";
import useStyles from "./useStyles";

interface IFieldCatalogId {
  assetdataMerge: IProduct;
  selectedCatalog: string;
}
const FieldCatalogId = ({
  assetdataMerge,
  selectedCatalog,
}: IFieldCatalogId) => {
  const classes = useStyles({});
  const dispatchDetail = React.useContext(ContextDispatchDetail);
  const catalogs = React.useContext(ContextCatalogs);

  const catalog = catalogs.find((c) => c.id === selectedCatalog);
  const assetdataCatalogs = (assetdataMerge[KEY_CATALOG] || []).sort();
  const onClick = React.useCallback(
    (e, catalogId: string) => {
      const catalog = catalogs.find((c) => c.id === catalogId);
      dispatchDetail({ type: ACT_DETAIL.SELECT_CATALOG, catalog });
    },
    [catalogs, dispatchDetail]
  );
  const disabled = !assetdataCatalogs.length;

  return (
    <Toolbar className={classes.toolbar}>
      <Btn
        className={classes.icon}
        icon="auto_stories"
        label="Catalog: "
        labelClassName={classes.label}
      />
      <Btn
        className={classes.selector}
        disabled={disabled}
        tooltip={
          disabled ? "There are no catalogs associated to this item" : undefined
        }
        icon="arrow_drop_down"
        label={catalog ? catalog.displayName : "Select catalog..."}
        labelPosition="left"
        labelClassName={classnames({
          [classes.label]: true,
          [classes.labelNoSelected]: !selectedCatalog,
        })}
        menu={{
          items: assetdataCatalogs.map((id) =>
            getMenuItem({
              id,
              label: catalogs.find((c) => c.id === id).displayName,
              active: id === selectedCatalog,
              onClick,
              iconChecked: "radio_button_checked",
              iconUncheckd: "radio_button_unchecked",
            })
          ),
        }}
      />
    </Toolbar>
  );
};

export default FieldCatalogId;
