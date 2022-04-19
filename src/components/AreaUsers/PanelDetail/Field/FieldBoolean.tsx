import * as React from "react";
import FieldSelect, {
  IFieldSelectItem,
} from "../../../../componentsBase/Field/FieldSelect";
import useStyles from "./useStyles";
import { emptyFn } from "../../../../componentsBase/utils/common";
import Label from "./Label";

const idYes = "idYes";
const idNo = "idNo";

interface IFieldBoolean {
  id: string;
  value?: boolean;
  onChange?: (id: string, value: boolean) => void;
  readOnly: boolean;
}

const FieldBoolean = ({
  id,
  value = false,
  onChange = emptyFn,
  readOnly,
}: IFieldBoolean) => {
  const classes = useStyles({});
  const onChangeCb = React.useCallback(
    (newItem: IFieldSelectItem, newItems: IFieldSelectItem[]) => {
      const itemSelected = newItems.find((n) => n.selected);

      if (!!itemSelected) {
        onChange(id, itemSelected.id === idYes);
      }
    },
    [id, onChange]
  );

  return (
    <FieldSelect
      label={<Label id={id} readOnly={readOnly} />}
      className={classes.field}
      itemsSelectedMaxLength={1}
      value={[
        {
          id: idYes,
          label: "Yes",
          selected: value === true,
        },
        {
          id: idNo,
          label: "No",
          selected: value === false,
        },
      ]}
      onChange={onChangeCb}
      readOnly={readOnly}
    />
  );
};

export default FieldBoolean;
