import * as React from "react";
import * as Colors from "../../../../componentsBase/style/Colors";
import Divider from "@material-ui/core/Divider";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Btn from "../../../../componentsBase/Btn";
import isEmpty from "lodash-es/isEmpty";
import Radio from "@material-ui/core/Radio";
import Checkbox from "@material-ui/core/Checkbox";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { searchDictionaries } from "../../../../api/fetchesApi";
import { IDictionary, DictionaryType } from "../../../../interfaces";
import { colorTheme, DEFAULT_WIDTH_COLUMN } from "../../../../constants";
import { ACT_DETAIL } from "../reducer";
import { IDialogDictionary } from "../interfaces";
import Modal from "../../../Modal";
import FieldSearch from "../../../FieldSearch";
import {
  Grid,
  ICellClick,
  IRenderCellSidebar,
  TypeCell,
} from "../../../../componentsBase/StickyGrid";
import { getAttributeId } from "../../getAttributeKey";
import { ContextCatalogs, ContextDispatchDetail } from "../../contexts";

const gridWidth = 650;
const sidebarWidth = 50;
const rowHeight = () => 60;
const useStyles = makeStyles({
  flex1: {
    flex: 1,
  },
  toolbar: {
    padding: 0,
  },
  content: {
    position: "relative",
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
    "max-height": 400,
    "min-height": 400,
    "max-width": gridWidth,
    "min-width": gridWidth,
  },
  labelCount: {
    "font-style": "italic",
    color: colorTheme,
  },
});

enum ACT_DIALOG {
  RESET = "RESET",
  SEARCH_INPUT = "SEARCH_INPUT",
  SEARCH_FOUND = "SEARCH_FOUND",
  SELECT_ITEM = "SELECT_ITEM",
}

interface IReducer {
  initialized: boolean;
  searching: boolean;
  searchInput: string;
  searchItems: IDictionary[];
  selectedItems: IDictionary[];
}

const reducerInitState: IReducer = {
  initialized: false,
  searching: true,
  searchInput: "",
  searchItems: [],
  selectedItems: [],
};

const reducer = (state: IReducer, action): IReducer => {
  const newState = { ...state };

  switch (action.type) {
    case ACT_DIALOG.SEARCH_FOUND: {
      const { value, searchItems } = action;
      const needInit =
        !newState.initialized &&
        isEmpty(newState.selectedItems) &&
        !isEmpty(value);

      if (needInit) {
        const keyLang0 = Object.keys(value)[0];
        const selectedLang0 = value[keyLang0] || [];
        const selectedCodes = new Set(selectedLang0.map(({ code }) => code));
        const selectedItems = searchItems.filter(({ code }) => {
          return selectedCodes.has(code);
        });
        newState.selectedItems = selectedItems;
      }
      newState.searching = false;
      newState.searchItems = searchItems;
      newState.initialized = true;

      return newState;
    }
    case ACT_DIALOG.SEARCH_INPUT:
      newState.searching = true;
      newState.searchInput = action.payload;
      return newState;
    case ACT_DIALOG.SELECT_ITEM: {
      const { rowIndex, multiSelectable } = action.payload;
      const item = newState.searchItems[rowIndex];
      let newSelected = Array.from(newState.selectedItems);
      const index = newSelected.findIndex((x) => x.id === item.id);

      if (multiSelectable) {
        if (index !== -1) {
          newSelected.splice(index, 1);
        } else {
          newSelected.push(item);
        }
      } else {
        if (index !== -1) {
          newSelected = [];
        } else {
          newSelected = [item];
        }
      }

      newState.selectedItems = newSelected;
      return newState;
    }
    case ACT_DIALOG.RESET:
      return reducerInitState;
    default:
      return state;
  }
};

interface ICmpDialogDictionary extends IDialogDictionary {
  open: boolean;
  value: { [lang: string]: [{ code: string; value: string }] };
}

const DialogDictionary = ({
  open,
  attributeKey,
  label,
  multiSelectable,
  dictionaryId,
  dictionaryType,
  catalogId,
  value,
}: ICmpDialogDictionary) => {
  const classes = useStyles();
  const dispatchDetail = React.useContext(ContextDispatchDetail);
  const catalogs = React.useContext(ContextCatalogs);

  const [stateDialog, dispatchDialog] = React.useReducer(
    reducer,
    reducerInitState
  );
  const { searching, searchItems, searchInput, selectedItems } = stateDialog;

  const languages = React.useMemo(() => {
    if (!catalogId) return [];
    const catalog = catalogs.find((x) => x.id === catalogId);
    return catalog.languages;
  }, [catalogId, catalogs]);
  const gridColumns = React.useMemo(() => {
    return languages.reduce(
      (acc, langId, index) => {
        acc.push({
          id: langId,
          type: TypeCell.String,
          label: langId.toUpperCase(),
          width: DEFAULT_WIDTH_COLUMN,
        });

        const isLast = languages.length === index + 1;
        const columnsWidth =
          sidebarWidth + acc.reduce((w, c) => w + c.width, 0);

        if (isLast && columnsWidth < gridWidth) {
          const columnPlaceholder = {
            id: " ",
            type: TypeCell.String,
            label: " ",
            width: gridWidth - columnsWidth,
          };
          acc.push(columnPlaceholder);
        }

        return acc;
      },
      [
        {
          id: "code",
          type: TypeCell.String,
          label: "Code",
          width: DEFAULT_WIDTH_COLUMN,
        },
      ]
    );
  }, [languages]);
  const rows = React.useMemo(() => {
    return searchItems.map((op) => {
      const { id, code, value } = op;
      return {
        id,
        selected: selectedItems.findIndex((x) => x.id === id) !== -1,
        data: { ...value, code },
      };
    });
  }, [searchItems, selectedItems]);
  const renderCellSidebar = React.useCallback(
    ({ selected }: IRenderCellSidebar) => {
      return multiSelectable ? (
        <Checkbox checked={selected} />
      ) : (
        <Radio checked={selected} />
      );
    },
    [multiSelectable]
  );

  const onClose = React.useCallback(() => {
    dispatchDetail({ type: ACT_DETAIL.SHOW_DIALOG_DICTIONARY });
  }, [dispatchDetail]);
  const onConfirm = React.useCallback(() => {
    const { id } = getAttributeId(attributeKey);
    languages.forEach((langId) => {
      dispatchDetail({
        type: ACT_DETAIL.EDITING_KEY_VALUE,
        attributeKey: id + `.(${catalogId}).(${langId})`,
        attributeValue: isEmpty(selectedItems)
          ? undefined
          : selectedItems.map((x) => ({
              code: x.code,
              value: x.value[langId],
            })),
      });
    });
  }, [attributeKey, catalogId, dispatchDetail, languages, selectedItems]);
  const onSearch = React.useCallback((payload) => {
    dispatchDialog({ type: ACT_DIALOG.SEARCH_INPUT, payload });
  }, []);
  const onRowClick = React.useCallback(
    ({ rowIndex }: ICellClick) => {
      dispatchDialog({
        type: ACT_DIALOG.SELECT_ITEM,
        payload: {
          rowIndex,
          multiSelectable,
        },
      });
    },
    [multiSelectable]
  );

  React.useEffect(() => {
    if (!open) {
      dispatchDialog({ type: ACT_DIALOG.RESET });
    }
  }, [open]);

  React.useEffect(() => {
    if (open && searching && dictionaryId && dictionaryType) {
      (async () => {
        const searchItems = await searchDictionaries({
          dictionaryId,
          dictionaryType,
          catalog: catalogId,
          searchableValue: searchInput,
          code: searchInput,
        });
        dispatchDialog({ type: ACT_DIALOG.SEARCH_FOUND, value, searchItems });
      })();
    }
  }, [
    catalogId,
    dictionaryId,
    dictionaryType,
    open,
    searchInput,
    searching,
    value,
  ]);

  if (
    dictionaryType !== null &&
    dictionaryType !== DictionaryType.MULTI_LANGUAGE
  ) {
    console.error("NO RENDER", { dictionaryType });
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={label}
      content={
        <>
          <Toolbar className={classes.toolbar}>
            <FieldSearch
              className={classes.flex1}
              value={searchInput}
              onChange={onSearch}
              placeholder="Search dictionary..."
            />
          </Toolbar>
          <div className={classes.content}>
            <Grid
              rootLoading={searching}
              enabledColumnsMove={false}
              enabledColumnsMultiSort={false}
              enabledColumnsResize={false}
              enabledColumnsRemove={false}
              defaultColumns={gridColumns}
              rowHeight={rowHeight}
              onRowClick={onRowClick}
              rows={rows}
              sidebarWidth={sidebarWidth}
              renderCellSidebar={renderCellSidebar}
            />
          </div>
          <Divider />
        </>
      }
      actions={
        <>
          {!multiSelectable || isEmpty(selectedItems) ? null : (
            <Typography
              className={classes.labelCount}
              variant="body1"
              children={`${selectedItems.length} selected`}
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

export default DialogDictionary;
