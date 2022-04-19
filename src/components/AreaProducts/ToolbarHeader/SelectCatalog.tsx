import * as React from "react";
import * as Colors from "../../../componentsBase/style/Colors";
import Btn from "../../../componentsBase/Btn";
import { ICatalog, IContentSort, IFilter } from "../../../interfaces";
import { PopoverOrigin } from "@material-ui/core/Popover/Popover";
import isEmpty from "lodash-es/isEmpty";
import { colorTheme } from "../../../constants";
import Modal from "../../Modal";
import Typography from "@material-ui/core/Typography";
import isFiltered from "../../FiltersChips/isFiltered";
import {
  ContextColumns,
  ContextCatalogs,
  ContextDispatchViewport,
} from "../contexts";
import { ACT_VPORT } from "../reducer";

const ORIGIN_ANCHOR: PopoverOrigin = {
  vertical: "bottom",
  horizontal: "left",
};
const ORIGIN_TRANSFORM: PopoverOrigin = {
  vertical: "top",
  horizontal: "left",
};
const NO_CATALOG: ICatalog = {
  id: "no_catalog_selected",
  displayName: "Select Catalog",
  languages: [],
};
const getMenuIcon = (active: boolean) => ({
  active,
  icon: active ? "radio_button_checked" : "radio_button_unchecked",
  styleIcon: active ? { color: colorTheme } : {},
});
const style: React.CSSProperties = {
  padding: "0px 5px 0 8px",
  borderRadius: 5,
};

enum ACT_SELECT {
  MODAL_OPENED = "MODAL_OPENED",
  MODAL_CLOSED = "MODAL_CLOSED",
}
interface IReducer {
  modalOpen: boolean;
  selectedCataId: string;
  selectedLangId: string;
}
const reducerInitState: IReducer = {
  modalOpen: false,
  selectedCataId: "",
  selectedLangId: "",
};
const reducer = (state: IReducer, action): IReducer => {
  const newState = { ...state };
  switch (action.type) {
    case ACT_SELECT.MODAL_OPENED:
      newState.modalOpen = true;
      newState.selectedCataId = action.cataId;
      newState.selectedLangId = action.langId;
      return newState;
    case ACT_SELECT.MODAL_CLOSED:
      return reducerInitState;
    default:
      return state;
  }
};

interface ISelectCatalog {
  catalogId: string;
  languageId: string;
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  filters: IFilter[];
  sortsContent: IContentSort[];
}

const SelectCatalog = ({
  catalogId,
  languageId,
  anchorOrigin = ORIGIN_ANCHOR,
  transformOrigin = ORIGIN_TRANSFORM,
  filters,
  sortsContent,
}: ISelectCatalog) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const columns = React.useContext(ContextColumns);
  const catalogs = React.useContext(ContextCatalogs);

  const [stateSelect, dispatchSelect] = React.useReducer(
    reducer,
    reducerInitState
  );
  const { modalOpen, selectedCataId, selectedLangId } = stateSelect;

  const catSelected = catalogs.find((c) => c.id === catalogId) || NO_CATALOG;

  const onChange = React.useCallback(
    (cId: string, lId: string) => {
      dispatchViewport({
        type: ACT_VPORT.CATALOGS_SELECT,
        catalogId: cId,
        languageId: lId,
      });
    },
    [dispatchViewport]
  );
  const onClick = React.useCallback(
    (cataId: string, langId: string) => {
      const attMultiCatalogSorted = !!sortsContent.find((s) => {
        const column = columns.find((c) => c.id === s.id);
        return column.multiCatalog || column.multiLanguage;
      });
      const attMultiCatalogfiltered = !!filters.find((f) => {
        return (f.multiCatalog || f.multiLanguage) && isFiltered([f]);
      });

      // controllo se è stato applicato un filtraggio o un ordinamento per un attributo
      // multiCatalog o multiLanguage, se si mostro un messaggio di conferma all'utente
      if (attMultiCatalogSorted || attMultiCatalogfiltered) {
        dispatchSelect({ type: ACT_SELECT.MODAL_OPENED, cataId, langId });
      } else {
        onChange(cataId, langId);
      }
    },
    [columns, filters, onChange, sortsContent]
  );
  const onClickCatalog = React.useCallback(
    (e, newCatId) => {
      let cataId = "";
      let langId = "";
      if (catalogId !== newCatId) {
        const newLangs = catalogs.find((c) => c.id === newCatId).languages;
        const newLangId = isEmpty(newLangs) ? undefined : newLangs[0];
        cataId = newCatId;
        langId = newLangId;
      }
      onClick(cataId, langId);
    },
    [catalogId, catalogs, onClick]
  );
  const onClickLanguage = React.useCallback(
    (e, newLangId) => {
      onClick(catalogId, newLangId);
    },
    [catalogId, onClick]
  );
  const onModalConfirm = React.useCallback(() => {
    onChange(selectedCataId, selectedLangId);
    dispatchSelect({ type: ACT_SELECT.MODAL_CLOSED });
  }, [onChange, selectedCataId, selectedLangId]);
  const onModalCancel = React.useCallback(() => {
    dispatchSelect({ type: ACT_SELECT.MODAL_CLOSED });
  }, []);

  React.useEffect(() => {
    if (!catalogId && catalogs.length === 1) {
      const { id, languages } = catalogs[0];
      const newLangId = isEmpty(languages) ? undefined : languages[0];
      onChange(id, newLangId);
    }
  }, [catalogId, catalogs, onChange]);

  if (isEmpty(catalogs)) return null;

  return (
    <>
      {catalogs.length < 2 ? null : (
        <Btn
          style={style}
          tooltip="Select Catalog"
          icon="auto_stories"
          label={catSelected.displayName}
          menu={{
            anchorOrigin,
            transformOrigin,
            items: catalogs.map((c) => ({
              id: c.id,
              label: c.displayName,
              onClick: onClickCatalog,
              ...getMenuIcon(c.id === catalogId),
            })),
          }}
        />
      )}
      {catSelected.languages.length < 2 ? null : (
        <Btn
          style={style}
          tooltip="Select Language"
          icon="flag"
          label={languageId.toLocaleUpperCase()}
          menu={{
            anchorOrigin,
            transformOrigin,
            items: catSelected.languages.map((l) => ({
              id: l,
              label: l.toLocaleUpperCase(),
              onClick: onClickLanguage,
              ...getMenuIcon(l === languageId),
            })),
          }}
        />
      )}
      <Modal
        open={modalOpen}
        onClose={onModalCancel}
        title="Change selected catalog or language"
        content={
          <Typography
            variant="body1"
            children={
              <>
                If you deselect the current catalog or language, relative <br />
                filters imputed and column sorts will be cleared.
                <br />
                <br />
                Are you sure you want to deselect it?
              </>
            }
          />
        }
        actions={
          <>
            <div style={{ flex: 1 }} />
            <Btn variant="bold" label="CANCEL" onClick={onModalCancel} />
            <Btn
              variant="bold"
              label="DESELECT"
              color={Colors.Red}
              onClick={onModalConfirm}
            />
          </>
        }
      />
    </>
  );
};

export default SelectCatalog;
