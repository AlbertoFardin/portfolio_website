import * as React from "react";
import { ACT_MODAL } from "./reducer";
import Btn from "../../../componentsBase/Btn";
import Toolbar from "@material-ui/core/Toolbar";
import { ITag, TagType } from "../../../interfaces";
import * as Colors from "../../../componentsBase/style/Colors";
import Pagination from "../../../componentsBase/Pagination";
import { emptyFn } from "../../../componentsBase/utils/common";
import Divider from "@material-ui/core/Divider";

interface IFooter {
  dispatchModal: React.Dispatch<unknown>;
  selectedTags: ITag[];
  searchingPageValue: number;
  searchingPageSize: number;
  foundTagsTotal: number;
  canEdit: boolean;
}

const Footer = ({
  dispatchModal,
  selectedTags,
  searchingPageValue,
  searchingPageSize,
  foundTagsTotal,
  canEdit,
}: IFooter) => {
  const selectedCount = selectedTags.length;
  const onClickDelete = React.useCallback(() => {
    dispatchModal({ type: ACT_MODAL.REMOVE_CONFIRM });
  }, [dispatchModal]);
  const onChangePagination = React.useCallback(
    (value) => {
      dispatchModal({ type: ACT_MODAL.PAGINATION, value });
    },
    [dispatchModal]
  );
  const canRemoveSelection = !selectedTags.find(
    ({ type }: ITag) => type === TagType.PRODUCT
  );

  return (
    <>
      <Divider />
      <Toolbar style={{ padding: 0 }}>
        {!canEdit || !selectedCount ? null : (
          <>
            <Btn
              icon="local_offer"
              label={String(selectedCount)}
              disabled
              style={{ marginLeft: 3 }}
              tooltip={`${selectedCount} tag${
                selectedCount > 1 ? "s" : ""
              } selected`}
            />
            <Btn
              color={Colors.Red}
              icon="delete"
              disabled={!canRemoveSelection}
              tooltip={
                !canRemoveSelection
                  ? "Product tags can't be deleted, please check your selection"
                  : "Delete selection"
              }
              onClick={onClickDelete}
            />
          </>
        )}
        <div style={{ flex: 1 }} />
        <Pagination
          pageCurrent={searchingPageValue}
          pageSizes={[
            {
              value: searchingPageSize,
              label: `${searchingPageSize} Rows`,
              selected: true,
            },
          ]}
          onChangeCurrent={onChangePagination}
          onChangeSizes={emptyFn}
          itemsCount={foundTagsTotal}
          labelAdornmentEnd={`of ${foundTagsTotal} items`}
        />
      </Toolbar>
    </>
  );
};

export default Footer;
