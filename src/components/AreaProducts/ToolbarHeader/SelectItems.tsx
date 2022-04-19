import * as React from "react";
import Btn from "../../../componentsBase/Btn";
import mixColors from "../../../componentsBase/utils/mixColors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import { colorTheme, MAX_PRODUCTS_SELECTABLE } from "../../../constants";
import { IProduct } from "../../../interfaces";
import isEmpty from "lodash-es/isEmpty";

const idSelectAllCurrentPage = "idSelectAll";
const idDeselect = "idDeselect";
const idSelectMax = "idSelectMax";

const getPageSelectionCount = (
  items: IProduct[],
  itemsIdSelected: string[]
): number => {
  const selected = new Set(itemsIdSelected);
  return items.reduce((acc, { id }) => {
    if (selected.has(id)) acc = acc + 1;
    return acc;
  }, 0);
};
const getIcon = (sizeItems: number, sizePageSelection: number): string => {
  let icon = "check_box_outline_blank";
  if (sizePageSelection > 0) icon = "indeterminate_check_box";
  if (sizeItems > 0 && sizeItems === sizePageSelection) icon = "check_box";
  return icon;
};
const getTooltip = (sizeItems: number, sizePageSelection: number): string => {
  let icon = "Select all items of this page";
  if (sizePageSelection > 0) icon = "Deselect all items";
  if (sizeItems === sizePageSelection) icon = "Deselect all items";
  return icon;
};

interface IStyles {
  menu: boolean;
}
const useStyles = makeStyles({
  selectItems: {
    overflow: "hidden",
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
  },
  background: {
    "background-color": mixColors(0.15, "#fff", colorTheme),
  },
  btnLeft: {
    padding: "0px 5px",
    margin: "0 5px",
    "min-width": 0,
    "border-top-right-radius": ({ menu }: IStyles) => (menu ? 0 : 5),
    "border-bottom-right-radius": ({ menu }: IStyles) => (menu ? 0 : 5),
    "border-top-left-radius": 5,
    "border-bottom-left-radius": 5,
  },
  btnRight: {
    margin: 0,
    padding: 0,
    "min-width": 0,
    "border-top-right-radius": 5,
    "border-bottom-right-radius": 5,
    "border-top-left-radius": ({ menu }: IStyles) => (menu ? 0 : 5),
    "border-bottom-left-radius": ({ menu }: IStyles) => (menu ? 0 : 5),
    left: "-10px",
  },
});

interface ISelectItems {
  items: IProduct[];
  itemsIdSelected: string[];
  onSelectCurrentPage: () => void;
  onSelectMax?: () => void;
  onDeselect: () => void;
  itemsTotal: number;
}

const SelectItems = ({
  items,
  itemsIdSelected,
  onSelectCurrentPage,
  onSelectMax,
  onDeselect,
  itemsTotal,
}: ISelectItems) => {
  const [menu, setMenu] = React.useState(false);
  const classes = useStyles({ menu });

  const disabledSelectMax =
    itemsTotal <= MAX_PRODUCTS_SELECTABLE ? false : true;

  const pageSelection = getPageSelectionCount(items, itemsIdSelected);
  const onChange = React.useCallback(
    (event, actionId) => {
      switch (actionId) {
        case idSelectAllCurrentPage:
          onSelectCurrentPage();
          break;
        case idDeselect:
          onDeselect();
          break;
        case idSelectMax:
          onSelectMax();
          break;
        default:
          break;
      }
    },
    [onSelectCurrentPage, onDeselect, onSelectMax]
  );
  const onClick = React.useCallback(() => {
    onChange(undefined, !!pageSelection ? idDeselect : idSelectAllCurrentPage);
  }, [onChange, pageSelection]);
  const onMenu = React.useCallback(() => {
    setMenu(!menu);
  }, [menu]);

  return (
    <div className={classes.selectItems}>
      <Btn
        className={classnames({
          [classes.btnLeft]: true,
          [classes.background]: menu,
        })}
        disabled={isEmpty(items)}
        tooltip={getTooltip(items.length, pageSelection)}
        icon={getIcon(items.length, pageSelection)}
        onClick={onClick}
      />
      <Btn
        className={classnames({
          [classes.btnRight]: true,
          [classes.background]: menu,
        })}
        disabled={isEmpty(items)}
        icon="arrow_drop_down"
        onClick={onMenu}
        menu={{
          anchorOrigin: {
            vertical: "top",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          onClose: onMenu,
          items: [
            {
              id: idSelectMax,
              hidden: !onSelectMax,
              disabled: disabledSelectMax,
              label: `Select all (${
                itemsTotal < MAX_PRODUCTS_SELECTABLE
                  ? itemsTotal
                  : MAX_PRODUCTS_SELECTABLE
              } item${itemsTotal > 1 ? "s" : ""})`,
              onClick: onChange,
            },
            {
              id: idSelectAllCurrentPage,
              label: `Select current page (${items.length} item${
                items.length > 1 ? "s" : ""
              })`,
              onClick: onChange,
            },
            {
              id: idDeselect,
              label: "Deselect",
              onClick: onChange,
            },
          ],
        }}
      />
    </div>
  );
};

export default SelectItems;
