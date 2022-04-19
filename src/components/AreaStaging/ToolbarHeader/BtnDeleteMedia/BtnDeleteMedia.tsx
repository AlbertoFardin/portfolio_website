import * as React from "react";
import Btn from "../../../../componentsBase/Btn";
import * as Colors from "../../../../componentsBase/style/Colors";
import isEmpty from "lodash-es/isEmpty";
import { deleteMedias } from "../../../../api/fetchesApi";
import ModalMediasDelete from "../../../ModalMediasDelete";
import reducer, { initState, ACTIONS, IReducer } from "./reducer";
import { ACT_VPORT } from "../../reducer";
import { ContextSetSnackbar } from "../../../contexts";
import { Severity } from "../../../../interfaces";
import { ContextDispatchViewport } from "../../contexts";
import searchES from "../../searchES";

interface IBtnDeleteMedia {
  itemsIdSelected: string[];
}

const BtnDeleteMedia = ({ itemsIdSelected }: IBtnDeleteMedia) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const setSnackbar = React.useContext(ContextSetSnackbar);

  const [state, dispatch] = React.useReducer(reducer, initState);
  const { items, modalOpen, modalLoading, deleting } = state as IReducer;
  const onModalOpen = React.useCallback(
    () => dispatch({ type: ACTIONS.MODAL_OPEN }),
    []
  );
  const onConfirm = React.useCallback(
    () => dispatch({ type: ACTIONS.DELETING }),
    []
  );
  const onReset = React.useCallback(
    () => dispatch({ type: ACTIONS.RESET }),
    []
  );

  React.useEffect(() => {
    if (modalOpen && isEmpty(items))
      (async () => {
        const { items } = await searchES({
          query: { terms: { _id: itemsIdSelected } },
        });
        dispatch({ type: ACTIONS.SET_ITEMS, items });
      })();
  }, [items, itemsIdSelected, modalOpen]);

  React.useEffect(() => {
    (async () => {
      if (deleting && !isEmpty(items)) {
        try {
          const ids = items.map((m) => m.id);
          const idWithMediatypeFiles = items.map((m) => ({
            id: m.data.fileId,
            mediatype: m.data.mediaType,
          }));
          await deleteMedias(idWithMediatypeFiles);
          dispatchViewport({ type: ACT_VPORT.ITEMS_REMOVE, ids });
          setSnackbar(
            Severity.SUCCESS,
            "Deletion selected media(s) started. Refresh to update list"
          );
        } catch (err) {
          setSnackbar(
            Severity.WARNING,
            "Unable to delete media(s), please refresh and retry"
          );
          console.log("BtnDeleteMedia ->", err);
        }

        dispatch({ type: ACTIONS.RESET });
      }
    })();
  }, [deleting, dispatchViewport, items, setSnackbar]);

  if (isEmpty(itemsIdSelected)) return null;

  return (
    <>
      <Btn
        color={Colors.Red}
        icon="delete"
        tooltip="Delete media file"
        onClick={onModalOpen}
      />
      <ModalMediasDelete
        open={modalOpen}
        loading={modalLoading}
        medias={items.map(({ data }) => data)}
        checks={[
          {
            id: "check1",
            label: "Media will be deleted from Staging Area",
          },
          {
            id: "check2",
            label:
              "Media will be deleted from all associated products (if any)",
          },
          {
            id: "check3",
            label:
              "Ready status we’ll be removed from all associated view (if any)",
          },
        ]}
        onCancel={onReset}
        onConfirm={onConfirm}
      />
    </>
  );
};

export default BtnDeleteMedia;
