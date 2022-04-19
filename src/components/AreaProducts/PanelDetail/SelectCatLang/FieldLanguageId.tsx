import * as React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Btn from "../../../../componentsBase/Btn";
import { ACT_DETAIL } from "../reducer";
import { ContextDispatchDetail, ContextCatalogs } from "../../contexts";
import { colorTheme } from "../../../../constants";
import IAction from "../../../../componentsBase/ActionsMenu/IAction";
import classnames from "classnames";
import getMenuItem from "./getMenuItem";
import useStyles from "./useStyles";

const getLabel = (langId: string): string => {
  return langId.toLocaleUpperCase();
};

interface IGetMenuSelectAll {
  languages: string[];
  selectedLanguages: string[];
  onClick: () => void;
}
const getMenuSelectAll = ({
  languages,
  selectedLanguages,
  onClick,
}: IGetMenuSelectAll): IAction => {
  const countTotal = languages.length;
  const countSelected = selectedLanguages.length;
  const active = countSelected === countTotal;
  return {
    id: "all",
    label: "Select all",
    disableClose: true,
    onClick: onClick,
    icon:
      countSelected === 0
        ? "check_box_outline_blank"
        : active
        ? "check_box"
        : "indeterminate_check_box",
    styleIcon: active ? { color: colorTheme } : {},
  };
};

interface IFieldLanguageId {
  selectedCatalog: string;
  selectedLanguages: string[];
}
const FieldLanguageId = ({
  selectedCatalog,
  selectedLanguages,
}: IFieldLanguageId) => {
  const classes = useStyles({});
  const dispatchDetail = React.useContext(ContextDispatchDetail);
  const catalogs = React.useContext(ContextCatalogs);

  const catalog = catalogs.find((c) => c.id === selectedCatalog);
  const languages = React.useMemo(() => {
    return catalog ? catalog.languages : [];
  }, [catalog]);

  const onClickLanguage = React.useCallback(
    (e, languageId: string) => {
      dispatchDetail({ type: ACT_DETAIL.SELECT_LANGUAG, languageId });
    },
    [dispatchDetail]
  );
  const onClickSelectAll = React.useCallback(() => {
    dispatchDetail({ type: ACT_DETAIL.SELECT_LANGUAG_ALL, languages });
  }, [dispatchDetail, languages]);
  const disabled = !catalog;

  return (
    <Toolbar className={classes.toolbar}>
      <Btn
        className={classes.icon}
        icon="flag"
        label="Languages: "
        labelClassName={classes.label}
      />
      <Btn
        className={classes.selector}
        disabled={!catalog}
        tooltip={
          disabled ? "Select a catalog before select languages" : undefined
        }
        icon="arrow_drop_down"
        label={
          selectedLanguages.map(getLabel).join(", ") || "Select languages..."
        }
        labelPosition="left"
        labelClassName={classnames({
          [classes.label]: true,
          [classes.labelNoSelected]: !selectedLanguages.length,
        })}
        menu={{
          items: [].concat(
            [
              getMenuSelectAll({
                selectedLanguages,
                languages,
                onClick: onClickSelectAll,
              }),
            ],
            languages.map((langId, index) =>
              getMenuItem({
                id: langId,
                label: getLabel(langId),
                divider: index === 0,
                active: new Set(selectedLanguages).has(langId),
                onClick: onClickLanguage,
              })
            )
          ),
        }}
      />
    </Toolbar>
  );
};

export default FieldLanguageId;
