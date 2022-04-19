import * as React from "react";
import * as Colors from "../../../../componentsBase/style/Colors";
import Btn from "../../../../componentsBase/Btn";
import { FIELD_IDS, ACT_MODAL, ISelection } from "../reducer";
import FieldSearch from "../../../FieldSearch";
import Divider from "@material-ui/core/Divider";
import AttributeList from "./AttributeList";
import AttributeMenuItem from "./AttributeMenuItem";
import { ICON } from "./getListIcon";
import CircularProgress from "@material-ui/core/CircularProgress";

interface IFieldAttributes {
  dispatchModal: React.Dispatch<unknown>;
  attributesInputted: string;
  attributesSelected: string[];
  selections: ISelection[];
  attributesSaveSelection: boolean;
  selectionsHash: string;
}

const FieldAttributes = ({
  dispatchModal,
  attributesInputted,
  attributesSelected,
  selections,
  attributesSaveSelection,
  selectionsHash,
}: IFieldAttributes) => {
  const onSearchAttribute = React.useCallback(
    (value: string) => {
      dispatchModal({ type: ACT_MODAL.ATTRIBUTES_INPUTTED, value });
    },
    [dispatchModal]
  );
  const onSaveSelection = React.useCallback(() => {
    dispatchModal({ type: ACT_MODAL.ATTRIBUTES_SAVE_SELECTION });
  }, [dispatchModal]);
  const onFieldActiveId = React.useCallback(() => {
    dispatchModal({
      type: ACT_MODAL.FIELD_ACTIVE_ID,
      value: FIELD_IDS.SELECTIONS,
    });
  }, [dispatchModal]);

  return (
    <>
      <FieldSearch
        style={{ margin: 5, border: 0 }}
        value={attributesInputted}
        onChange={onSearchAttribute}
        placeholder="Search attributes..."
      />
      <Divider />
      <AttributeList
        attributesInputted={attributesInputted}
        attributesSelected={attributesSelected}
        dispatchModal={dispatchModal}
      />
      <Divider />
      <AttributeMenuItem
        id="saveSelection"
        style={{ height: 40, padding: "0 13px", backgroundColor: Colors.Gray4 }}
        icon={attributesSaveSelection ? ICON.SELECTED : ICON.NONE_SELECTED}
        label="Save the current selection in your preference"
        onClick={onSaveSelection}
        selected={attributesSaveSelection}
        title
      >
        {!selectionsHash ? (
          <CircularProgress size={20} style={{ marginRight: 6 }} />
        ) : !selections.length ? null : (
          <Btn
            icon="article"
            tooltip="Choose from saved selections"
            onClick={onFieldActiveId}
          />
        )}
      </AttributeMenuItem>
    </>
  );
};

export default FieldAttributes;
