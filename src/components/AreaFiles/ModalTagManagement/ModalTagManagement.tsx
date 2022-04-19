import * as React from "react";
import reducer, { reducerInitState, ACT_MODAL } from "./reducer";
import { ACT_VPORT } from "../reducer";
import Modal from "../../Modal";
import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";
import ModalDeleteTag from "./ModalDeleteTag";
import { ContextPermissions } from "../../contexts";
import PERMISSIONS from "../../../permissions";
import permissionsCheck from "../../../utils/permissionsCheck";
import { ITag } from "../../../interfaces";
import { ContextDispatchViewport } from "../contexts";
import { deleteTag, searchDiz } from "../../../api/fetchesApi";

interface ITagManagement {
  open: boolean;
}

const TagManagement = ({ open }: ITagManagement) => {
  const [stateModal, dispatchModal] = React.useReducer(
    reducer,
    reducerInitState
  );
  const {
    removing,
    removeConfirm,
    searchingTags,
    searchingInput,
    searchingPageValue,
    searchingPageSize,
    foundTags,
    foundTagsTotal,
    selectedTags,
  } = stateModal;

  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const permissions = React.useContext(ContextPermissions);
  const canEdit = permissionsCheck({
    keys: [PERMISSIONS.digitalassets_manage_tag],
    permissions,
  });
  const onClose = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.TAG_MANAGEMENT });
  }, [dispatchViewport]);

  // search tags
  React.useEffect(() => {
    if (open && searchingTags) {
      (async () => {
        const {
          items,
          total,
        }: { items: ITag[]; total: number } = await searchDiz({
          from: searchingPageSize * (searchingPageValue - 1),
          size: searchingPageSize,
          searchName: searchingInput,
        });
        dispatchModal({
          type: ACT_MODAL.SEARCH_END,
          foundTags: items,
          foundTagsTotal: total,
        });
      })();
    }
  }, [
    open,
    searchingInput,
    searchingPageSize,
    searchingPageValue,
    searchingTags,
  ]);

  // delete tags
  React.useEffect(() => {
    if (open && removing) {
      (async () => {
        await deleteTag({
          id: selectedTags[0].id,
          type: selectedTags[0].type,
        });
        dispatchModal({ type: ACT_MODAL.REMOVE_END });
      })();
    }
  }, [open, removing, selectedTags]);

  // reset on close
  React.useEffect(() => {
    if (!open) dispatchModal({ type: ACT_MODAL.RESET });
  }, [open]);

  return (
    <>
      <Modal
        open={open}
        title="Tag Management"
        onClose={onClose}
        loading={!!(searchingTags && !foundTags.length)}
        content={
          <>
            <Header
              dispatchCmp={dispatchModal}
              loading={searchingTags}
              searchingInput={searchingInput}
            />
            <Content
              dispatchModal={dispatchModal}
              foundTags={foundTags}
              searchingTags={searchingTags}
              selectedTags={selectedTags}
              canEdit={canEdit}
            />
            <Footer
              dispatchModal={dispatchModal}
              selectedTags={selectedTags}
              searchingPageValue={searchingPageValue}
              searchingPageSize={searchingPageSize}
              foundTagsTotal={foundTagsTotal}
              canEdit={canEdit}
            />
          </>
        }
      />
      <ModalDeleteTag dispatchModal={dispatchModal} open={removeConfirm} />
    </>
  );
};

export default TagManagement;
