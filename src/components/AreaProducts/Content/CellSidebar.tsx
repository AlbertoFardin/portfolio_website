import * as React from "react";
import { KEY_ENTITY_ID } from "../../../constants";
import { IRenderCellSidebar } from "../../../componentsBase/StickyGrid";
import Btn from "../../../componentsBase/Btn";
import { ContextSetSnackbar } from "../../contexts";
import { Severity, SheetLayout } from "../../../interfaces";
import getSearchString from "../getSearchString";
import { useLocation } from "react-router-dom";

const CellSidebar = (prop: IRenderCellSidebar) => {
  const assetDataId = prop.rowData[KEY_ENTITY_ID];
  const setSnackbar = React.useContext(ContextSetSnackbar);

  const search = useLocation().search;
  const urlProduct: string = React.useMemo(() => {
    return getSearchString(
      {
        entityId: assetDataId,
        detailSheet: SheetLayout.FULLSCREEN,
      },
      search
    );
  }, [assetDataId, search]);

  const onCopyToClipboard = React.useCallback(() => {
    setSnackbar(Severity.INFO, "Link copied to clipboard");
  }, [setSnackbar]);
  const onOpenNewTab = React.useCallback(() => {
    window.open(urlProduct, "_blank");
  }, [urlProduct]);

  return (
    <Btn
      icon="more_vert"
      tooltip="More actions"
      menu={{
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
        transformOrigin: {
          vertical: "top",
          horizontal: "left",
        },
        items: [
          {
            id: "open_in_new_tab",
            icon: "open_in_new",
            label: "Open item in a new tab",
            onClick: onOpenNewTab,
          },
          {
            id: "copy_link",
            icon: "link",
            label: "Copy item link",
            copyToClipboard: window.location.origin + urlProduct,
            onClick: onCopyToClipboard,
          },
        ],
      }}
    />
  );
};

export default CellSidebar;
