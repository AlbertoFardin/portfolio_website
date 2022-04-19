import * as React from "react";
import * as Colors from "../../../../componentsBase/style/Colors";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Btn from "../../../../componentsBase/Btn";
import isEmpty from "lodash-es/isEmpty";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { colorTheme } from "../../../../constants";
import { ACT_DETAIL } from "../reducer";
import { IDialogCategory } from "../interfaces";
import Modal from "../../../Modal";
import FieldSearch from "../../../FieldSearch";
import TreeView from "../../../../componentsBase/TreeView";
import FieldSelect from "../../../../componentsBase/Field/FieldSelect";
import getCategoryPath from "../../../AreaCategories/getCategoryPath";
import {
  ContextCatalogs,
  ContextCategories,
  ContextColumns,
  ContextDispatchDetail,
} from "../../contexts";
import { getAttributeId } from "../../getAttributeKey";
import getCategoryData from "../../../AreaCategories/getCategoryData";
import { ICatalog, ICategory, IItemEs } from "../../../../interfaces";

interface IValueLang {
  path: string;
  label: string;
}

const useStyles = makeStyles({
  treeview: {
    position: "relative",
    height: 250,
    overflow: "auto",
  },
  flex1: {
    flex: 1,
  },
  labelCount: {
    "font-style": "italic",
    color: colorTheme,
  },
  field: {
    width: 350,
    margin: "0 0 10px 0",
  },
});

enum ACT_DIALOG {
  RESET = "RESET",
  SETUP = "SETUP",
  CHANGE_INPUT = "CHANGE_INPUT",
  CHANGE_LANG = "CHANGE_LANG",
  CHANGE_ROOT = "CHANGE_ROOT",
  SELECT_ITEM_ID = "SELECT_ITEM_ID",
  EXPAND_ITEM_ID = "EXPAND_ITEM_ID",
  SET_EXPAND_IDS = "SET_EXPAND_IDS",
}

interface IReducer {
  input: string;
  roots: string[];
  langs: string[];
  selectedIds: string[];
  expandedIds: string[];
  selectedRoot: string;
  selectedLang: string;
}

const reducerInitState: IReducer = {
  input: "",
  roots: [],
  langs: [],
  selectedIds: [],
  expandedIds: [],
  selectedRoot: "",
  selectedLang: "",
};

const reducer = (state: IReducer, action): IReducer => {
  const newState = { ...state };
  switch (action.type) {
    case ACT_DIALOG.SETUP: {
      const catalogId: string = action.catalogId;
      const catalogs: ICatalog[] = action.catalogs;
      const value: { [lang: string]: IValueLang[] } = action.value;
      const categories: IItemEs<ICategory>[] = action.categories;

      const catalog = catalogs.find((x) => x.id === catalogId);
      const langs: string[] = catalog.languages;

      newState.langs = langs;
      newState.selectedLang = langs[0];

      const roots = Array.from(
        new Set(
          categories
            .filter(({ data }) => {
              return data.catalog === catalogId;
            })
            .map(({ data }) => {
              return data.root;
            })
        )
      );
      newState.roots = roots;

      if (!isEmpty(value)) {
        const keyLang0 = Object.keys(value)[0];
        const selectedLang0 = value[keyLang0] || [];
        const selectedIds = selectedLang0.map(({ path }) => path);
        newState.selectedIds = selectedIds;
      }

      return newState;
    }
    case ACT_DIALOG.SET_EXPAND_IDS: {
      newState.expandedIds = action.ids;
      return newState;
    }
    case ACT_DIALOG.EXPAND_ITEM_ID: {
      const id = action.id;
      const ids = Array.from(newState.expandedIds);
      const index = ids.findIndex((i) => i === id);
      if (index === -1) {
        ids.push(id);
      } else {
        ids.splice(index, 1);
      }
      newState.expandedIds = ids;
      return newState;
    }
    case ACT_DIALOG.SELECT_ITEM_ID: {
      const id = action.id;
      const ids = Array.from(newState.selectedIds);
      const index = ids.findIndex((i) => i === id);
      if (index === -1) {
        ids.push(id);
      } else {
        ids.splice(index, 1);
      }
      newState.selectedIds = ids;
      return newState;
    }
    case ACT_DIALOG.CHANGE_INPUT:
      newState.input = action.value;
      return newState;
    case ACT_DIALOG.CHANGE_ROOT: {
      const id = action.value.id;
      const value = id === newState.selectedRoot ? "" : id;
      newState.selectedRoot = value;
      return newState;
    }
    case ACT_DIALOG.CHANGE_LANG: {
      newState.selectedLang = action.value;
      return newState;
    }
    case ACT_DIALOG.RESET:
      return reducerInitState;
    default:
      return state;
  }
};

interface ICmpDialogCategory extends IDialogCategory {
  value: { [lang: string]: IValueLang[] };
}

const DialogCategory = ({
  open,
  attributeKey,
  label,
  catalogId,
  value,
}: ICmpDialogCategory) => {
  const classes = useStyles();
  const dispatchDetail = React.useContext(ContextDispatchDetail);
  const categories = React.useContext(ContextCategories);
  const catalogs = React.useContext(ContextCatalogs);
  const columns = React.useContext(ContextColumns);

  const column = columns.find((c) => c.id === getAttributeId(attributeKey).id);

  const [stateDialog, dispatchDialog] = React.useReducer(
    reducer,
    reducerInitState
  );
  const {
    input,
    roots,
    langs,
    expandedIds,
    selectedIds,
    selectedRoot,
    selectedLang,
  } = stateDialog;

  const treeItems = React.useMemo(() => {
    return categories
      .filter((c) => {
        return c.data.catalog === catalogId;
      })
      .filter((c) => {
        if (!column) return true;
        return c.data.attributeStructureId === column.attributeStructureId;
      })
      .filter((c) => {
        if (!selectedRoot) return true;
        return c.data.root === selectedRoot;
      })
      .filter((c) => {
        if (!input) return true;
        return c.data.searchableValue
          .toLocaleUpperCase()
          .includes(input.toLocaleUpperCase());
      })
      .map(({ id, data }) => {
        const showTreeFlat = !!input;
        return {
          id: data.id,
          label: data.labels[selectedLang],
          parent: showTreeFlat ? null : data.parent,
          tooltip: getCategoryPath({
            categoryId: id,
            languageId: selectedLang,
            categories,
          }),
        };
      });
  }, [catalogId, categories, column, input, selectedLang, selectedRoot]);

  const onItemToggle = React.useCallback((id) => {
    dispatchDialog({ type: ACT_DIALOG.EXPAND_ITEM_ID, id });
  }, []);
  const onItemCheck = React.useCallback((id) => {
    dispatchDialog({ type: ACT_DIALOG.SELECT_ITEM_ID, id });
  }, []);
  const onClose = React.useCallback(() => {
    dispatchDetail({ type: ACT_DETAIL.SHOW_DIALOG_CATEGORY });
  }, [dispatchDetail]);
  const onConfirm = React.useCallback(() => {
    const { id } = getAttributeId(attributeKey);
    langs.forEach((l) => {
      const newValue: IValueLang[] = selectedIds.map((categoryDataId) => {
        const category = getCategoryData({
          categoryDataId,
          categoryDataCatalog: catalogId,
          categories,
        });
        const labels = category.data.labels;
        return {
          path: categoryDataId,
          label: labels[l],
        };
      });

      dispatchDetail({
        type: ACT_DETAIL.EDITING_KEY_VALUE,
        attributeKey: id + `.(${catalogId}).(${l})`,
        attributeValue: isEmpty(newValue) ? undefined : newValue,
      });
    });
  }, [attributeKey, catalogId, categories, dispatchDetail, langs, selectedIds]);
  const onChangeInput = React.useCallback((value) => {
    dispatchDialog({ type: ACT_DIALOG.CHANGE_INPUT, value });
  }, []);
  const onChangeRoot = React.useCallback((value) => {
    dispatchDialog({ type: ACT_DIALOG.CHANGE_ROOT, value });
  }, []);
  const onChangeLang = React.useCallback(({ id }) => {
    dispatchDialog({ type: ACT_DIALOG.CHANGE_LANG, value: id });
  }, []);

  React.useEffect(() => {
    if (!open) {
      dispatchDialog({ type: ACT_DIALOG.RESET });
    }
  }, [open]);

  React.useEffect(() => {
    if (open) {
      dispatchDialog({
        type: ACT_DIALOG.SETUP,
        categories,
        catalogId,
        catalogs,
        value,
      });
    }
  }, [catalogId, catalogs, categories, open, value]);

  React.useEffect(() => {
    if (open && !expandedIds.length) {
      const ids = treeItems.map((c) => c.id);
      dispatchDialog({ type: ACT_DIALOG.SET_EXPAND_IDS, ids });
    }
  }, [expandedIds.length, open, treeItems]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={label}
      content={
        <>
          <FieldSearch
            className={classes.field}
            value={input}
            onChange={onChangeInput}
            placeholder="Search category..."
          />
          <FieldSelect
            className={classes.field}
            placeholder="Select Root..."
            itemsSelectedMaxLength={1}
            onChange={onChangeRoot}
            value={roots.map((rootId) => ({
              id: rootId,
              label: rootId,
              selected: rootId === selectedRoot,
            }))}
          />
          {langs.length === 1 ? null : (
            <FieldSelect
              className={classes.field}
              placeholder="Select Language..."
              itemsSelectedMaxLength={1}
              onChange={onChangeLang}
              value={langs.map((l) => ({
                id: l,
                label: l.toUpperCase(),
                selected: l === selectedLang,
              }))}
            />
          )}
          <Divider />
          <TreeView
            className={classes.treeview}
            items={treeItems}
            onCheck={onItemCheck}
            onToggle={onItemToggle}
            selectable
            selected={selectedIds}
            expanded={expandedIds}
          />
          <Divider />
        </>
      }
      actions={
        <>
          {isEmpty(selectedIds) ? null : (
            <Typography
              className={classes.labelCount}
              variant="body1"
              children={`${selectedIds.length} selected`}
            />
          )}
          <div className={classes.flex1} />
          <Btn variant="bold" label="CANCEL" onClick={onClose} />
          <Btn
            variant="bold"
            color={Colors.Green}
            label="CONFIRM"
            onClick={onConfirm}
          />
        </>
      }
    />
  );
};

export default DialogCategory;
