import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Btn from "../../../../componentsBase/Btn";
import LoadingMask from "../../../../componentsBase/LoadingMask";
import { FIELD_IDS, ACT_MODAL, ISelection } from "../reducer";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import FieldSelectionsItem from "./FieldSelectionsItem";
import { ContextColumns } from "../../contexts";

const useStyles = makeStyles({
  header: {
    padding: 5,
    height: 30,
    "min-height": 0,
  },
  list: {
    flex: 1,
    overflow: "auto",
  },
  backdrop: {
    "background-color": "rgba(0,0,0,0.05)",
  },
});

interface IFieldSelections {
  dispatchModal: React.Dispatch<unknown>;
  selections: ISelection[];
  selectionsSave: boolean;
}

const FieldSelections = ({
  dispatchModal,
  selections,
  selectionsSave,
}: IFieldSelections) => {
  const classes = useStyles({});
  const columns = React.useContext(ContextColumns);

  const [backdrop, setBackdrop] = React.useState(false);

  const onFieldActiveId = React.useCallback(() => {
    dispatchModal({
      type: ACT_MODAL.FIELD_ACTIVE_ID,
      value: FIELD_IDS.ATTRIBUTES,
    });
  }, [dispatchModal]);
  const onItemRename = React.useCallback(
    (id: string, label: string) => {
      dispatchModal({ type: ACT_MODAL.SELECTIONS_RENAME, id, label });
    },
    [dispatchModal]
  );
  const onItemRemove = React.useCallback(
    (id: string) => {
      dispatchModal({ type: ACT_MODAL.SELECTIONS_REMOVE, id });
    },
    [dispatchModal]
  );
  const onItemSelect = React.useCallback(
    (id: string) => {
      dispatchModal({ type: ACT_MODAL.SELECTIONS_SELECT, id, columns });
    },
    [dispatchModal, columns]
  );

  return (
    <>
      <Toolbar className={classes.header}>
        <Btn
          icon="arrow_back"
          tooltip="Return on attributes list"
          onClick={onFieldActiveId}
        />
        <Typography variant="body2" children="List of your saved selections" />
      </Toolbar>
      <Divider />
      <List className={classes.list}>
        {selections.map(({ id, label, items }) => (
          <FieldSelectionsItem
            key={id}
            id={id}
            label={label}
            items={items}
            setBackdrop={setBackdrop}
            onRename={onItemRename}
            onRemove={onItemRemove}
            onSelect={onItemSelect}
          />
        ))}
      </List>
      <LoadingMask
        open={backdrop || selectionsSave}
        spinner={selectionsSave}
        backgroundColor={"rgba(250,250,250,0.5)"}
      />
    </>
  );
};

export default FieldSelections;
