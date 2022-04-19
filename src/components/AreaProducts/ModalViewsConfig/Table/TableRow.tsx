import * as React from "react";
import SelectCatalog from "./SelectCatalog";
import SelectMediaType from "./SelectMediaType";
import SelectViewType from "./SelectViewType";
import BtnViewName from "./BtnViewName";
import { ACTION, IViewDraft, ViewStatus } from "../reducer";
import useStyles from "./useStyles";
import StatusLabel from "../StatusLabel";
import { IProduct } from "../../../../interfaces";

interface ITableRow {
  dispatch: React.Dispatch<unknown>;
  items: IProduct[];
  viewDraft: IViewDraft;
}

const TableRow = ({ dispatch, items, viewDraft }: ITableRow) => {
  const classes = useStyles({});
  const { id, status } = viewDraft;
  const disabled = status === ViewStatus.NONE || status === ViewStatus.REMOVE;
  const onChange = React.useCallback(
    (editedKey, editedValue) => {
      dispatch({
        type: ACTION.MODIFY_VIEW,
        viewName: id,
        items,
        editedKey,
        editedValue,
      });
    },
    [dispatch, id, items]
  );
  const onClick = React.useCallback(() => {
    const creationSet = new Set([ViewStatus.NONE, ViewStatus.CREATE]);
    const type = creationSet.has(status)
      ? ACTION.CREATE_VIEW
      : ACTION.REMOVE_VIEW;
    dispatch({ type, id });
  }, [dispatch, id, status]);

  return (
    <div className={classes.row}>
      <div className={classes.cellFirst}>
        <BtnViewName label={id} status={status} onClick={onClick} />
      </div>
      <div className={classes.cellFirst}>
        {new Set([ViewStatus.NONE, ViewStatus.VALUED]).has(status) ? null : (
          <StatusLabel status={status} />
        )}
      </div>
      <div className={classes.cell}>
        <SelectMediaType
          fieldKey="mediaType"
          viewDraft={viewDraft}
          items={items}
          disabled={disabled}
          onChange={onChange}
        />
      </div>
      <div className={classes.cell}>
        <SelectCatalog
          fieldKey="catalog"
          viewDraft={viewDraft}
          items={items}
          disabled={disabled}
          onChange={onChange}
        />
      </div>
      <div className={classes.cell}>
        <SelectViewType
          fieldKey="viewType"
          viewDraft={viewDraft}
          items={items}
          disabled={disabled}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default TableRow;
