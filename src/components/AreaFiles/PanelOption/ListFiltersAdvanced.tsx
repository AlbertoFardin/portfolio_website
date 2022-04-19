import * as React from "react";
import FacetToggle from "../../PanelFilters/FacetToggle";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import Icon from "@material-ui/core/Icon";
import { ACT_VPORT } from "../reducer";
import { FiltersCondition } from "../../../interfaces";
import makeStyles from "@material-ui/core/styles/makeStyles";
import * as Colors from "../../../componentsBase/style/Colors";
import { colorTheme } from "../../../constants";
import { ContextDispatchViewport } from "../contexts";

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
  list: {
    "padding-left": 20,
  },
});

interface IListFiltersAdvanced {
  titleIcon: string;
  titleLabel: string;
  filtersConditions: FiltersCondition;
  filtersThisFolder: boolean;
}

const ListFiltersAdvanced = ({
  titleIcon,
  titleLabel,
  filtersConditions,
  filtersThisFolder,
}: IListFiltersAdvanced) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const classes = useStyles({});
  const [collapsed, setCollapsed] = React.useState(true);
  const toggleCollapsed = React.useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);
  const actsFiltersConditions = React.useMemo(
    () => [
      {
        id: FiltersCondition.AND,
        label: "AND",
        selected: FiltersCondition.AND === filtersConditions,
      },
      {
        id: FiltersCondition.OR,
        label: "OR",
        selected: FiltersCondition.OR === filtersConditions,
      },
    ],
    [filtersConditions]
  );
  const actsFilterThisFolder = React.useMemo(
    () => [
      {
        id: "false",
        label: "All resources",
        selected: !filtersThisFolder,
      },
      {
        id: "true",
        label: "This folder",
        selected: filtersThisFolder,
      },
    ],
    [filtersThisFolder]
  );
  const onChangeFiltersConditions = React.useCallback(
    (payload: string) => {
      dispatchViewport({
        type: ACT_VPORT.CHANGE_FILTERING_CONDITIONS,
        payload,
      });
    },
    [dispatchViewport]
  );
  const onChangeFiltersThisFolder = React.useCallback(
    (value: string) => {
      const payload = JSON.parse(value);
      dispatchViewport({
        type: ACT_VPORT.CHANGE_FILTERING_THISFOLDER,
        payload,
      });
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
      <div className={classes.list}>
        <Collapse in={!collapsed} timeout="auto" unmountOnExit>
          <>
            <FacetToggle
              label="Condition"
              actions={actsFiltersConditions}
              onChange={onChangeFiltersConditions}
              help="How filters works among them"
            />
            <FacetToggle
              label="Search in"
              actions={actsFilterThisFolder}
              onChange={onChangeFiltersThisFolder}
              help="How filters search items"
            />
          </>
        </Collapse>
      </div>
    </>
  );
};

export default ListFiltersAdvanced;
