import * as React from "react";
import ListFacets from "../../PanelFilters/ListFacets";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import Icon from "@material-ui/core/Icon";
import { ACT_VPORT } from "../reducer";
import { IFilter } from "../../../interfaces";
import makeStyles from "@material-ui/core/styles/makeStyles";
import * as Colors from "../../../componentsBase/style/Colors";
import { colorTheme } from "../../../constants";
import { ContextDispatchViewport } from "../contexts";
import FacetSearchTags from "./FacetSearchTags";
import { FIELD_ID } from "../constants";
import { IFacetType } from "../../../componentsBase/Facets";

const useStyles = makeStyles({
  flex1: {
    flex: 1,
  },
  title: {
    color: colorTheme,
    padding: "12px 20px 12px",
  },
  titleIcon: {
    color: Colors.Gray2,
    margin: "0 10px 0 0px",
    "font-size": "18px !important",
  },
  titleLabel: {
    color: Colors.Gray1,
    "font-weight": "normal",
  },
});

interface IListFiltersBase {
  titleIcon: string;
  titleLabel: string;
  filters: IFilter[];
}

const ListFiltersBase = ({
  titleIcon,
  titleLabel,
  filters,
}: IListFiltersBase) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);

  const classes = useStyles({});
  const [collapsed, setCollapsed] = React.useState(false);
  const toggleCollapsed = React.useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);
  const onChangeFilter = React.useCallback(
    (payload: IFilter) => {
      if (
        payload.type !== IFacetType.DATEPICKER ||
        (payload.type === IFacetType.DATEPICKER &&
          !(
            payload.value?.startDate === null && payload.value?.endDate === null
          ))
      ) {
        dispatchViewport({ type: ACT_VPORT.FILTER_CHANGE, payload });
      }
    },
    [dispatchViewport]
  );

  return (
    <>
      <ButtonBase className={classes.title} onClick={toggleCollapsed}>
        <Icon className={classes.titleIcon} children={titleIcon} />
        <Typography
          className={classes.titleLabel}
          variant="body1"
          children={titleLabel}
        />
        <div className={classes.flex1} />
        <Icon
          className={classes.titleIcon}
          style={{ color: Colors.Gray1 }}
          children={collapsed ? "remove" : "keyboard_arrow_down"}
        />
      </ButtonBase>
      <div
      // Need to fix container style flex
      >
        <Collapse in={!collapsed} timeout="auto" unmountOnExit>
          <ListFacets
            facets={filters}
            facetsOverrideMap={{
              [FIELD_ID.TAGS]: FacetSearchTags,
            }}
            onChange={onChangeFilter}
          />
        </Collapse>
      </div>
    </>
  );
};

export default ListFiltersBase;
