import List from "@material-ui/core/List";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import isEmpty from "lodash-es/isEmpty";
import Divider from "@material-ui/core/Divider";
import ListItem, { IListItem } from "../../ListItem";
import boldSearchText from "../../utils/boldSearchText";

const useStyles = makeStyles({
  menuActions: {
    "max-height": 200,
    overflow: "auto",
  },
  titleLabel: {
    "font-size": 12,
    "font-weight": "bold",
    "margin-top": 10,
    "margin-left": -5,
  },
  divider: {
    margin: "10px 20px 0",
  },
});

export interface IMenuAction extends IListItem {
  title?: string;
}

export interface IMenuActions {
  actions: IMenuAction[];
  actionsGroupedByTitle?: boolean;
  actionsGroupedByTitleNoLabel?: string;
  inputValue?: string;
}

const MenuActions = ({
  actions,
  actionsGroupedByTitle,
  actionsGroupedByTitleNoLabel,
  inputValue,
}: IMenuActions) => {
  const classes = useStyles({});
  const getLabel = React.useCallback(
    (text, bold = true) => {
      return inputValue && bold ? boldSearchText(inputValue, text) : text;
    },
    [inputValue]
  );
  const getListTitle = React.useCallback(
    (title: string, bold = true) => {
      return (
        <ListItem
          key={title}
          id={title}
          label={getLabel(title, bold)}
          classNameLabel={classes.titleLabel}
          disabled
        />
      );
    },
    [classes.titleLabel, getLabel]
  );
  const getListItem = React.useCallback(
    (v: IMenuAction) => {
      return (
        <ListItem
          key={v.id}
          id={v.id}
          label={getLabel(v.label)}
          subLabel={v.subLabel}
          className={v.className}
          classNameLabel={v.classNameLabel}
          classNameSubLabel={v.classNameSubLabel}
          style={v.style}
          styleLabel={v.styleLabel}
          styleSubLabel={v.styleSubLabel}
          avatar={v.avatar}
          active={v.active}
          onClick={v.onClick}
          buttonsLeftEverVisible={v.buttonsLeftEverVisible}
          buttonsLeft={v.buttonsLeft}
          disabled={v.disabled}
        />
      );
    },
    [getLabel]
  );

  if (isEmpty(actions)) return null;

  const content = [] as React.ReactNode[];

  if (!actionsGroupedByTitle) {
    // if NO group by title, all actions will render as ListItem
    actions.forEach((act) => content.push(getListItem(act)));
  } else {
    // if group by title, must divide action by title
    const actsTitled = actions.reduce((acc, cur) => {
      const { title } = cur;
      if (title) {
        if (!acc[title]) acc[title] = [];
        acc[title].push(cur);
      }
      return acc;
    }, {}) as { [title: string]: IMenuAction[] };
    const actsNoTitled = actions.filter(({ title }) => !title);

    Object.keys(actsTitled)
      .sort()
      .forEach((title: string) => {
        content.push(
          <React.Fragment key={title}>
            {getListTitle(title)}
            {actsTitled[title].map(getListItem)}
          </React.Fragment>
        );
      });

    if (!isEmpty(actsNoTitled)) {
      content.push(
        <Divider key="divider_notitled" className={classes.divider} />
      );
      content.push(getListTitle(actionsGroupedByTitleNoLabel, false));
      actsNoTitled.forEach((act) => content.push(getListItem(act)));
    }
  }

  return <List className={classes.menuActions} children={content} />;
};

export default MenuActions;
