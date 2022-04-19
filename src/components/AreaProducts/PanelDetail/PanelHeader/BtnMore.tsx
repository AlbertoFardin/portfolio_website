import * as React from "react";
import Btn from "../../../../componentsBase/Btn/Btn";
import { ContextSetSnackbar } from "../../../contexts";
import {
  Severity,
  SheetLayout,
  AttributeFamily,
  IColumnSc,
  IProduct,
} from "../../../../interfaces";
import getSearchString from "../../getSearchString";
import { useLocation } from "react-router-dom";
import { ACT_VPORT } from "../../reducer";
import {
  ContextColumns,
  ContextDispatchDetail,
  ContextDispatchViewport,
} from "../../contexts";
import ConfigManagement, {
  IItem,
  IItemGroup,
  IItemsSet,
} from "../../../../componentsBase/ConfigManagement";
import { ACT_DETAIL } from "../reducer";
import last from "lodash-es/last";

const MANAGER_WIDTH = 270;
const MANAGER_GROUPS: IItemGroup[] = [
  AttributeFamily.MASTER,
  AttributeFamily.PLANNING,
  AttributeFamily.EDITORIAL,
  AttributeFamily.MONITORING,
  AttributeFamily.OTHERS,
].map((id) => ({
  id,
  label: id,
}));

const getManagerPosition = (managerRef): [number, number] => {
  if (!managerRef.current) return [0, 0];
  const { left, top } = managerRef.current.getBoundingClientRect();
  return [left - MANAGER_WIDTH, top];
};
const getManagerItemTooltip = (column: IColumnSc): string => {
  const { entityPath, attributeFamily } = column;
  const l = entityPath && !!entityPath.length ? last(entityPath) : "all";
  return `Level: ${l} - Family: ${attributeFamily}`;
};

interface IBtnMore {
  assetDatas: IProduct[];
  managerAttributesSets: IItemsSet[];
  managerAttributesOpen: boolean;
  disabled?: boolean;
}

const BtnMore = ({
  assetDatas,
  managerAttributesSets,
  managerAttributesOpen,
  disabled,
}: IBtnMore) => {
  const managerRef = React.useRef(null);

  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const dispatchDetail = React.useContext(ContextDispatchDetail);
  const setSnackbar = React.useContext(ContextSetSnackbar);
  const columns = React.useContext(ContextColumns);

  const search = useLocation().search;
  const assetDataId = last(assetDatas).id;
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
  const onManagerOpen = React.useCallback(() => {
    dispatchDetail({ type: ACT_DETAIL.MANAGER_OPEN, value: true });
  }, [dispatchDetail]);
  const onManagerClose = React.useCallback(() => {
    dispatchDetail({ type: ACT_DETAIL.MANAGER_OPEN, value: false });
  }, [dispatchDetail]);
  const onManagerChange = React.useCallback(
    (payload: IItemsSet[]) => {
      dispatchViewport({
        type: ACT_VPORT.HASHSETS_FIELDS_PANEL_DETAILS_SAVE,
        payload,
      });
    },
    [dispatchViewport]
  );

  const managerItems: IItem[] = React.useMemo(() => {
    return columns
      .filter((f) => {
        return !!f.attributeFamily;
      })
      .filter((f) => {
        const hideFamily = new Set([
          AttributeFamily.ASSOCIATION,
          AttributeFamily.CATEGORIES,
        ]);
        return !hideFamily.has(f.attributeFamily);
      })
      .map((c: IColumnSc) => ({
        id: c.id,
        label: c.label,
        column: c,
        groupId: c.attributeFamily,
        tooltip: getManagerItemTooltip(c),
      }));
  }, [columns]);
  const [positionX, positionY] = getManagerPosition(managerRef);

  return (
    <>
      <div ref={managerRef}>
        <Btn
          disabled={disabled}
          icon="more_vert"
          tooltip="More actions"
          menu={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            items: [
              {
                id: "open_in_new_tab",
                icon: "open_in_new",
                label: "Open item in a new tab",
                onClick: onOpenNewTab,
                disabled: assetDatas.length > 1,
              },
              {
                id: "copy_link",
                icon: "link",
                label: "Copy item link",
                copyToClipboard: window.location.origin + urlProduct,
                onClick: onCopyToClipboard,
              },
              {
                id: "field_set",
                icon: "text_snippet",
                label: "Attributes Sets",
                onClick: onManagerOpen,
              },
            ],
          }}
        />
      </div>
      <ConfigManagement
        title="Attributes Sets"
        open={managerAttributesOpen}
        items={managerItems}
        itemsGroups={MANAGER_GROUPS}
        itemsSets={managerAttributesSets}
        positionX={positionX}
        positionY={positionY}
        onClose={onManagerClose}
        onChange={onManagerChange}
        width={MANAGER_WIDTH}
      />
    </>
  );
};

export default BtnMore;
