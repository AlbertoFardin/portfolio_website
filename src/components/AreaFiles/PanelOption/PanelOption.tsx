import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  IFilter,
  FiltersCondition,
  FileSection,
  IPath,
} from "../../../interfaces";
import { PANEL_FILTER_WIDTH } from "../../../constants";
import SectionBtn from "./SectionBtn";
import ListFiltersBase from "./ListFiltersBase";
import ListFiltersAdvanced from "./ListFiltersAdvanced";
import Divider from "@material-ui/core/Divider";
import { useLocation, useHistory } from "react-router-dom";
import { getPathId, getUpdatedPath } from "../getUpdatedPath";
import { ROOT_MYFILE_ID, ROOT_SHARED_ID } from "../constants";
import isEmpty from "lodash-es/isEmpty";
import isFiltered from "../../FiltersChips/isFiltered";
import { clearFilters, IFacet } from "../../../componentsBase/Facets";
import { ACT_VPORT } from "../reducer";
import { ContextDispatchViewport } from "../contexts";
import Drawer from "../../Drawer";

const useStyles = makeStyles({
  sectionBox: {
    display: "flex",
    "flex-direction": "column",
    margin: "30px 10px 30px 0",
    "border-radius": 10,
  },
  sectionBtn: {
    "border-top-left-radius": 0,
    "border-bottom-left-radius": 0,
  },
  divider: {
    margin: "0 10px",
  },
});

interface IPanelOption {
  path: IPath[];
  filters: IFilter[];
  filtersConditions: FiltersCondition;
  filtersThisFolder: boolean;
  filtersVisibled?: boolean;
}

const PanelOption = ({
  path,
  filters,
  filtersConditions,
  filtersThisFolder,
  filtersVisibled,
}: IPanelOption) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const classes = useStyles({});
  const history = useHistory();
  const location = useLocation();
  const rootPathId = isEmpty(path) ? undefined : path[0].id;
  const lastPathId = getPathId(location.pathname);
  const filtered = isFiltered(filters);
  const onClickSection = React.useCallback(
    (sectionId) => {
      if (sectionId === lastPathId) {
        if (filtered) {
          const payload = clearFilters(filters as IFacet[]);
          dispatchViewport({ type: ACT_VPORT.FILTERS_SET, payload });
        } else {
          dispatchViewport({ type: ACT_VPORT.REFRESH });
        }
      } else {
        history.push(getUpdatedPath(sectionId));
      }
    },
    [dispatchViewport, filtered, filters, history, lastPathId]
  );

  return (
    <Drawer direction="right" width={PANEL_FILTER_WIDTH}>
      <div className={classes.sectionBox}>
        <SectionBtn
          className={classes.sectionBtn}
          sectionId={FileSection.MY_FILES}
          selected={!filtered && rootPathId === ROOT_MYFILE_ID}
          onClick={onClickSection}
        />
        <SectionBtn
          className={classes.sectionBtn}
          sectionId={FileSection.SHARES_PRIVATE}
          selected={!filtered && rootPathId === ROOT_SHARED_ID}
          onClick={onClickSection}
        />
      </div>
      {!filtersVisibled ? null : (
        <>
          <Divider className={classes.divider} />
          <ListFiltersAdvanced
            titleIcon="settings"
            titleLabel="Filters Settings"
            filtersConditions={filtersConditions}
            filtersThisFolder={filtersThisFolder}
          />
          <Divider className={classes.divider} />
          <ListFiltersBase
            titleIcon="filter_list"
            titleLabel="Filters"
            filters={filters}
          />
          <Divider className={classes.divider} />
        </>
      )}
    </Drawer>
  );
};

export default PanelOption;
