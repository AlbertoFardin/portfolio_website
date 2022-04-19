import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import * as React from "react";
import Draggable from "react-draggable";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import isEmpty from "lodash-es/isEmpty";
import { v4 as uuidv4 } from "uuid";
import TypographyEllipsis from "../TypographyEllipsis";
import Btn from "../Btn";
import LoadingMask from "../LoadingMask";
import { emptyItemSet } from "./interfaces";
import PanelRowItemsSet from "./PanelRowItemsSet";
import FieldSearch from "./FieldSearch";
import PanelChipSearch from "./PanelChipSearch";
import PanelChipGroup from "./PanelChipGroup";
import { IItem, IItemGroup, IItemsSet } from "./";
import Portal from "@material-ui/core/Portal";
import { ZINDEX_DRAGGABLED } from "../utils/zIndex";

const dragCls = `configmanager_drag_${uuidv4()}`;
const useStyles = makeStyles({
  configmanagement: {
    display: "flex",
    "flex-direction": "column",
    position: "fixed",
    "z-index": ZINDEX_DRAGGABLED,
    overflow: "hidden",
  },
  toolbar: {
    padding: "0 20px",
  },
  content: {
    position: "relative",
    "flex-direction": "column",
    display: "flex",
    flex: 1,
  },
  containerChips: {
    display: "flex",
    "flex-direction": "column",
    flex: 1,
    position: "relative",
  },
});

interface IConfigManagement {
  /** Items to manage */
  items?: IItem[];
  /** Groups of items */
  itemsGroups?: IItemGroup[];
  /** Sets of items */
  itemsSets?: IItemsSet[];
  /** Disable all component element with a fade mask */
  disabled?: boolean;
  /** Callback fired when itemsSet was changed */
  onChange: (newItemsSets: IItemsSet[]) => void;
  /** Callback fired when component close */
  onClose: () => void;
  /** Component visibility. If false, the component is hidden */
  open: boolean;
  /** Start floating position of component. Coordinate X */
  positionX?: number;
  /** Start floating position of component. Coordinate Y */
  positionY?: number;
  /** Title on the component header */
  title?: string;
  /** Width of the component */
  width?: number;
}

/**
 * **ConfigManagement** è un pannello flottante
 * utilizzato per creare/editare/cancellare Sets di oggetti.
 */
const ConfigManagement = ({
  items = [],
  itemsGroups = [],
  itemsSets = [],
  disabled,
  onChange,
  onClose,
  open,
  positionX = 0,
  positionY = 0,
  title = "Management",
  width = 300,
}: IConfigManagement) => {
  const classes = useStyles({});
  const [inputFocus, setInputFocus] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const setActive =
    itemsSets.find((item) => item.active) || itemsSets[0] || emptyItemSet;
  const setActiveId = setActive.id;
  const setActiveItems = setActive.items;
  const chipsIdSelected = setActiveItems.map(({ id }) => id);
  const itemsCheck = setActiveItems.filter(
    (col) => !!items.find((c) => c.id === col.id),
    []
  );
  const onInputFocus = React.useCallback(() => {
    setInputFocus(true);
  }, []);
  const onInputChange = React.useCallback((v: string) => {
    setInputValue(v);
  }, []);
  const onInputClean = React.useCallback(() => {
    setInputValue("");
    setInputFocus(false);
  }, []);
  const onClickChip = React.useCallback(
    (chipId: string) => {
      const chip = items.find((c) => c.id === chipId);
      let newSetItems = Array.from(setActiveItems);
      const chipIndex = newSetItems.findIndex((c) => c.id === chipId);
      if (chipIndex === -1) {
        // add item
        newSetItems = [{ id: chip.id }].concat(newSetItems);
      } else {
        // remove item
        newSetItems.splice(chipIndex, 1);
      }

      const newItemsSets = itemsSets.map((s) => {
        if (s.id !== setActiveId) return s;
        return {
          ...s,
          items: newSetItems,
        };
      });
      onChange(newItemsSets);
    },
    [items, itemsSets, onChange, setActiveId, setActiveItems]
  );

  React.useEffect(() => {
    // controllo se tutte gli items salvati nel itemsSet attivo esistono.
    // se ci sono items che non esistono, lancio l'evento onChange
    if (itemsCheck.length !== setActiveItems.length) {
      const newItemsSets = itemsSets.map((s) => {
        if (s.id !== setActiveId) return s;
        return {
          ...s,
          items: itemsCheck,
        };
      });
      onChange(newItemsSets);
    }
  }, [itemsCheck, setActiveId, setActiveItems.length, itemsSets, onChange]);

  React.useEffect(() => {
    if (!open) {
      setInputFocus(false);
      setInputValue("");
    }
  }, [open]);

  if (!open || isEmpty(itemsSets)) return null;

  return (
    <Portal>
      <Draggable handle={`.${dragCls}`} bounds="parent">
        <Paper
          style={{ width, left: positionX, top: positionY }}
          className={classes.configmanagement}
          elevation={2}
        >
          <LoadingMask
            spinner={false}
            open={disabled}
            backgroundColor="rgba(250,250,250,0.5)"
          />

          <Toolbar className={classnames([dragCls, classes.toolbar])}>
            <TypographyEllipsis variant="subtitle2" children={title} />
            <div style={{ flex: 1 }} />
            <Btn icon="close" onClick={onClose} style={{ margin: 0 }} />
          </Toolbar>

          <div className={classes.content}>
            <PanelRowItemsSet itemsSets={itemsSets} onChange={onChange} />

            <div className={classes.containerChips}>
              <FieldSearch
                focus={inputFocus}
                onChange={onInputChange}
                onFocus={onInputFocus}
                onClean={onInputClean}
              />

              {inputFocus || isEmpty(itemsGroups) ? (
                <PanelChipSearch
                  items={items}
                  inputValue={inputValue}
                  chipsIdSelected={chipsIdSelected}
                  onClickChip={onClickChip}
                />
              ) : (
                <PanelChipGroup
                  items={items}
                  itemsGroups={itemsGroups}
                  chipsIdSelected={chipsIdSelected}
                  onClickChip={onClickChip}
                />
              )}
            </div>
          </div>
        </Paper>
      </Draggable>
    </Portal>
  );
};

export default ConfigManagement;
