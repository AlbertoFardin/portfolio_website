import * as React from "react";
import * as Colors from "../../../../componentsBase/style/Colors";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import Popover from "@material-ui/core/Popover";
import AttributeMenuItem from "./AttributeMenuItem";
import IAttributeMenuItem from "./IAttributeMenuItem";
import { ACT_MODAL } from "../reducer";
import getListIcon from "./getListIcon";

interface IAttributeMenu {
  dispatchModal: React.Dispatch<unknown>;
  open: boolean;
  items: IAttributeMenuItem[];
  anchorEl: Element | ((element: Element) => Element);
  titleIcon: string;
  titleLabel: string;
  onClose: () => void;
  attributesSelected: string[];
}

const AttributeMenu = ({
  dispatchModal,
  open,
  items,
  anchorEl,
  titleIcon,
  titleLabel,
  onClose,
  attributesSelected,
}: IAttributeMenu) => {
  const itemsIds = items.filter((c) => !c.title).map((c) => c.id);
  const onSelectAll = React.useCallback(() => {
    dispatchModal({ type: ACT_MODAL.ATTRIBUTES_SELECTED_ALL, ids: itemsIds });
  }, [dispatchModal, itemsIds]);
  const selectAllIcon = getListIcon(itemsIds, attributesSelected);

  if (!anchorEl) return null;

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <AttributeMenuItem
        id="titleMenu"
        icon={titleIcon}
        label={titleLabel}
        title
      />
      <AttributeMenuItem
        id="selectAll"
        icon={selectAllIcon[0]}
        selected={selectAllIcon[1] === Colors.Purple}
        label="Select all"
        onClick={onSelectAll}
      />
      <Divider style={{ margin: "0 10px" }} />
      <List style={{ maxHeight: 300, minWidth: 165, overflow: "auto" }}>
        {items.map((a) => (
          <AttributeMenuItem key={a.id} {...a} />
        ))}
      </List>
    </Popover>
  );
};

export default AttributeMenu;
