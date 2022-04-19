import * as React from "react";
import * as Colors from "../../../../../componentsBase/style/Colors";
import IForm from "../../FieldEditor/IForm";
import Collapse from "@material-ui/core/Collapse";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import { ACT_FIELD, reducer, reducerInitState } from "./reducer";
import LinksList from "./LinksList";
import makeStyles from "@material-ui/core/styles/makeStyles";
import searchES from "../../../searchES";
import isEmpty from "lodash-es/isEmpty";
import mixColors from "../../../../../componentsBase/utils/mixColors";
import Btn from "../../../../../componentsBase/Btn";
import FieldText from "../../../../../componentsBase/Field/FieldText";
import { colorTheme } from "../../../../../constants";
import FieldLabel from "../../../../DrawerDetail/FieldLabel";
import { ACT_DETAIL } from "../../reducer";
import getProps from "../../FieldEditor/getProps";
import { ISortOrder } from "../../../../../componentsBase/StickyGrid";
import escapeKeyEs from "../../../../../utils/escapeKeyEs";
import {
  ContextCategories,
  ContextColumns,
  ContextDispatchDetail,
} from "../../../contexts";

const sort = [{ entityId: { order: ISortOrder.ASC } }];

interface IStyles {
  readOnly: boolean;
}
const useStyles = makeStyles({
  fieldlinks: {
    position: "relative",
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
    "align-self": "stretch",
    padding: "0 10px",
  },
  fieldlinksToolbar: {
    padding: 0,
  },
  fieldlinksContent: {
    position: "relative",
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
    "min-height": 225,
    "max-height": 225,
  },
  labelTitle: {
    color: ({ readOnly }: IStyles) => (readOnly ? "#999999" : "#333333"),
    "max-width": 250,
    overflow: "hidden",
    "text-overflow": "ellipsis",
    "white-space": "nowrap",
  },
  labelDirty: {
    fontStyle: "italic",
    color: colorTheme,
    backgroundColor: mixColors(0.1, "#ffffff", colorTheme),
    padding: "0 5px",
    borderRadius: 2,
    margin: 10,
  },
  fieldSearch: {
    margin: "0 1px",
    width: "inherit",
  },
  fieldSearchClear: {
    margin: 0,
  },
  diffValueButton: {
    width: "fit-content",
    margin: "0 auto",
  },
  diffValueLabel: {
    margin: "10px auto",
  },
  flex1: {
    flex: 1,
  },
  divider: {
    margin: "0 5px",
  },
});

interface IFieldLinks extends IForm {
  value: string[];
}

const FieldLinks = ({
  attributeKey,
  label,
  value = [],
  dirty,
  mandatory,
  readOnly,
  isReady,
  btnReadyVisibled,
  btnReadyDisabled,
  btnResetVisibled,
  btnResetDisabled,
  multiCatalog,
  multiLanguage,
  catalogId,
  languageId,
  placeholderDifferentValues,
  onMenuClose,
  onReadyClick,
  onReadyMouseHover,
  onResetClick,
  onResetMouseHover,
}: IFieldLinks) => {
  const dispatchDetail = React.useContext(ContextDispatchDetail);
  const columns = React.useContext(ContextColumns);
  const categories = React.useContext(ContextCategories);

  const classes = useStyles({ readOnly });
  const [stateField, dispatchField] = React.useReducer(
    reducer,
    reducerInitState
  );
  const { open, searching, searchInput, searchItems, searchTotal } = stateField;
  const valuedIds = JSON.stringify(value.sort());

  const onInputSearchChange = React.useCallback((text: string) => {
    dispatchField({ type: ACT_FIELD.SEARCH_INPUT, value: text });
  }, []);
  const onExpand = React.useCallback(() => {
    dispatchField({ type: ACT_FIELD.OPEN });
  }, []);
  const onListItemClick = React.useCallback(
    (itemIds: string[]) => {
      const newValue = Array.from(value);

      itemIds.forEach((itemId) => {
        const itemIndex = newValue.findIndex((x) => x === itemId);
        const itemSelected = itemIndex !== -1;

        if (itemSelected) {
          newValue.splice(itemIndex, 1);
        } else {
          newValue.push(itemId);
        }
      });

      dispatchDetail({
        type: ACT_DETAIL.EDITING_KEY_VALUE,
        attributeKey,
        attributeValue: isEmpty(newValue) ? undefined : newValue,
      });
    },
    [attributeKey, dispatchDetail, value]
  );
  const onClearValue = React.useCallback(() => {
    dispatchDetail({
      type: ACT_DETAIL.EDITING_KEY_CLEAN,
      attributeKey,
    });
  }, [attributeKey, dispatchDetail]);

  const { menu } = getProps({
    label,
    className: "",
    dirty,
    multiCatalog,
    multiLanguage,
    catalogId,
    languageId,
    isReady,
    btnReadyVisibled,
    btnReadyDisabled,
    btnResetVisibled,
    btnResetDisabled,
    mandatory,
    placeholderDifferentValues,
    readOnly,
    onClearValue,
    onMenuClose,
    onReadyClick,
    onReadyMouseHover,
    onResetClick,
    onResetMouseHover,
  });

  React.useEffect(() => {
    if (open && !dirty) {
      dispatchField({ type: ACT_FIELD.SEARCHING, valuedIds });
    }
  }, [dirty, open, valuedIds]);

  React.useEffect(() => {
    if (searching) {
      (async () => {
        let items;
        let total;

        if (!isEmpty(value) || searchInput) {
          const res = await searchES(
            !searchInput
              ? { sort, query: { terms: { _id: value } } }
              : {
                  sort,
                  size: 25,
                  query: {
                    bool: {
                      should: searchInput.split(/\r+|\n/).map((text) => ({
                        wildcard: {
                          entityId: {
                            value: `*${escapeKeyEs(text)}*`,
                            case_insensitive: true,
                          },
                        },
                      })),
                    },
                  },
                },
            columns,
            categories
          );
          items = res.items;
          total = res.itemsTotal;
        }

        dispatchField({ type: ACT_FIELD.SEARCH_ITEMS, items, total });
      })();
    }
  }, [categories, columns, searchInput, searching, value]);

  return (
    <div className={classes.fieldlinks}>
      <Toolbar className={classes.fieldlinksToolbar}>
        <Btn
          icon={open ? "keyboard_arrow_down" : "chevron_right"}
          onClick={onExpand}
        />
        <Typography
          variant="body1"
          className={classes.labelTitle}
          children={<FieldLabel label={label} mandatory={mandatory} />}
        />
        <div className={classes.flex1} />
        {!isReady ? null : (
          <Icon
            style={{
              fontSize: 12,
              bottom: "-22px",
              color: dirty ? "#aaa" : Colors.Cyan,
            }}
            children="public"
          />
        )}
        {!dirty ? null : (
          <Typography
            variant="body1"
            className={classes.labelDirty}
            children="Unsaved"
          />
        )}
        {isEmpty(menu) ? null : (
          <Btn
            icon="more_vert"
            menu={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "right",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "right",
              },
              items: menu,
            }}
          />
        )}
      </Toolbar>
      <Collapse in={open} mountOnEnter unmountOnExit>
        <div className={classes.fieldlinksContent}>
          {!open ? null : (
            <>
              <FieldText
                className={classes.fieldSearch}
                value={searchInput}
                onChange={onInputSearchChange}
                placeholder="Search keys..."
                multiline
              />
              {placeholderDifferentValues &&
              !searchInput &&
              !readOnly &&
              !dirty ? (
                <>
                  <Typography
                    className={classes.diffValueLabel}
                    variant="body1"
                    children={`There are ${placeholderDifferentValues} for selected catalog`}
                  />
                  <Btn
                    className={classes.diffValueButton}
                    color={colorTheme}
                    variant="bold"
                    icon="close"
                    label={`CLEAR - ${label}`}
                    onClick={onClearValue}
                  />
                </>
              ) : (
                <LinksList
                  searched={!!searchInput}
                  loading={searching}
                  items={searchItems}
                  itemsTotal={searchTotal}
                  itemsIdSelected={value}
                  readOnly={readOnly}
                  onClick={onListItemClick}
                />
              )}
              {searchItems.length < 4 ? null : (
                <Divider className={classes.divider} />
              )}
            </>
          )}
        </div>
      </Collapse>
    </div>
  );
};

export default FieldLinks;
