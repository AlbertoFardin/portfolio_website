import CircularProgress from "@material-ui/core/CircularProgress";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Btn from "../../Btn";
import BtnDelete from "./BtnDelete";
import BtnMore from "./BtnMore";
import RowItemsSetLabel from "./RowItemsSetLabel";

const useStyles = makeStyles({
  rowItemset: {
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    padding: "0 20px",
    cursor: "pointer",
    position: "relative",
    height: 40,
    "&:last-child": {
      "border-width": 0,
    },
  },
  loading: {
    "margin-left": 7,
  },
  btnIcon: {
    "font-size": "15px !important",
  },
});

interface IRowItemsSet {
  id: string;
  isDefault?: boolean;
  label: string;
  labelCount: number;
  selected: boolean;
  onDelete?: () => void;
  onDuplicate: () => void;
  onRename: (text: string) => void;
  onSelect: () => void;
}

const RowItemsSet = ({
  id,
  isDefault = false,
  label,
  labelCount,
  onDelete,
  onDuplicate,
  onRename,
  onSelect,
  selected,
}: IRowItemsSet) => {
  const classes = useStyles({});
  const [formDelete, setFormDelete] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const onCbRename = React.useCallback(
    (newName: string) => {
      if (label !== newName) {
        setLoading(true);
        onRename(newName);
      }
    },
    [onRename, label]
  );
  const onCbOpenDeleteForm = React.useCallback(() => {
    setFormDelete(!formDelete);
  }, [formDelete]);
  const onCbDeleteSet = React.useCallback(() => {
    setFormDelete(false);
    setLoading(true);
    onDelete();
  }, [onDelete]);

  React.useEffect(() => {
    setLoading(false);
    setFormDelete(false);
  }, [label, id]);

  return (
    <div className={classes.rowItemset}>
      <RowItemsSetLabel
        isLoading={formDelete || loading}
        isSelected={selected}
        label={label}
        labelCount={labelCount}
        onSelect={onSelect}
        onRename={onCbRename}
      />

      {!loading ? null : (
        <CircularProgress className={classes.loading} size={23} />
      )}

      {loading ? null : (
        <>
          {!isDefault ? null : (
            <Btn
              tooltip="Duplicate"
              onClick={onDuplicate}
              icon="content_copy"
              iconClassName={classes.btnIcon}
              style={{ minWidth: 20, minHeight: 20 }}
            />
          )}

          {isDefault ? null : formDelete ? (
            <BtnDelete onDelete={onCbDeleteSet} onCancel={onCbOpenDeleteForm} />
          ) : (
            <BtnMore onDelete={onCbOpenDeleteForm} onDuplicate={onDuplicate} />
          )}
        </>
      )}
    </div>
  );
};

export default RowItemsSet;
