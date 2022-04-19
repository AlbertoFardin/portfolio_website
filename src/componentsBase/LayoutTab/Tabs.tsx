import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ILayoutTabPanel from "./ILayoutTabPanel";
import * as Colors from "../style/Colors";
import classnames from "classnames";
import Tooltip from "../Tooltip";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  tabs: {
    height: 30,
  },
  tab: {
    "border-top-left-radius": 5,
    "border-top-right-radius": 5,
    padding: "0 10px",
    "min-width": 0,
    opacity: 0.5,
  },
  tabSelected: {
    opacity: 1,
  },
  tabLabel: {
    "font-size": 10,
    "font-weight": 500,
    color: Colors.Gray1,
  },
});

interface ICustomTabs {
  tabs: ILayoutTabPanel[];
  tabSelectedId: string;
  onSelectTab: (tabId: string) => void;
}

const CustomTabs = ({ tabSelectedId, tabs, onSelectTab }: ICustomTabs) => {
  const classes = useStyles({});
  const onChange = React.useCallback(
    (event, newId) => {
      onSelectTab(newId);
    },
    [onSelectTab]
  );
  return (
    <Tabs
      variant={tabs.length > 3 ? "scrollable" : undefined}
      scrollButtons="auto"
      value={tabSelectedId}
      onChange={onChange}
      className={classes.tabs}
    >
      {tabs.map((cur) => (
        <Tab
          key={cur.id}
          value={cur.id}
          className={classnames({
            [classes.tab]: true,
            [classes.tabSelected]: cur.id === tabSelectedId,
          })}
          label={
            <Tooltip title={cur.tooltip}>
              <Typography
                variant="body1"
                className={classes.tabLabel}
                children={cur.title || cur.id}
              />
            </Tooltip>
          }
        />
      ))}
    </Tabs>
  );
};

export default CustomTabs;
