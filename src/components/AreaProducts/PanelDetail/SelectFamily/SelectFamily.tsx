import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Btn from "../../../../componentsBase/Btn";
import { useHistory, useLocation } from "react-router-dom";
import getSearchString from "../../getSearchString";
import { HEADER_COLOR_BULK, FAMILY_CONF } from "../constants";
import * as Colors from "../../../../componentsBase/style/Colors";
import classnames from "classnames";
import SearchAttribute from "../SearchAttribute";
import { ContextColumns } from "../../contexts";
import { IProduct } from "../../../../interfaces";
import getFamilies from "./getFamilies";

const useStyles = makeStyles({
  selector: {
    "border-radius": 5,
    margin: "10px 11px",
    "max-width": "inherit",
    border: `1px solid ${Colors.Gray2}`,
    "background-color": "#fff",
    "&:hover": {
      "background-color": HEADER_COLOR_BULK,
    },
  },
  selectorLabel: {
    "text-align": "left",
  },
  header: {
    display: "flex",
    "flex-direction": "column",
    "background-color": "#FAFBFC",
  },
  headerBulk: {
    "background-color": HEADER_COLOR_BULK,
  },
});

interface ISelectFamily {
  detailTabId: string;
  fullscreen: boolean;
  assetdataCount: number;
  assetdataMerge: IProduct;
  searchAttributeOpen: boolean;
  searchAttributeValue: string;
}

const SelectFamily = ({
  detailTabId,
  fullscreen,
  assetdataCount,
  assetdataMerge,
  searchAttributeOpen,
  searchAttributeValue,
}: ISelectFamily) => {
  const classes = useStyles({});
  const history = useHistory();
  const searchString = useLocation().search;
  const columns = React.useContext(ContextColumns);

  const pageActive = FAMILY_CONF.find(({ id }) => id === detailTabId);
  const onClick = React.useCallback(
    (e, detailTabId: string) => {
      history.push(getSearchString({ detailTabId }, searchString));
    },
    [history, searchString]
  );

  if (fullscreen) return null;

  return (
    <div
      className={classnames({
        [classes.header]: true,
        [classes.headerBulk]: assetdataCount > 1,
      })}
    >
      {searchAttributeOpen ? (
        <SearchAttribute searchAttributeValue={searchAttributeValue} />
      ) : (
        <Btn
          className={classes.selector}
          icon="arrow_drop_down"
          label={pageActive ? pageActive.label : detailTabId}
          labelPosition="left"
          labelClassName={classes.selectorLabel}
          menu={{
            items: getFamilies(columns, assetdataCount, assetdataMerge).map(
              ({ id, label, icon }) => ({
                id,
                label,
                icon,
                active: id === detailTabId,
                onClick,
              })
            ),
          }}
        />
      )}
    </div>
  );
};

export default SelectFamily;
