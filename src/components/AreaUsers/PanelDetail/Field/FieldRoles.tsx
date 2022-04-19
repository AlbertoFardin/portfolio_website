import * as React from "react";
import FieldSelect, {
  IFieldSelectItem,
} from "../../../../componentsBase/Field/FieldSelect";
import useStyles from "./useStyles";
import Label from "./Label";
import { IRole } from "../../../../interfaces";
import { ACT_VPORT } from "../../reducer";
import { ContextDispatchViewport, ContextRoles } from "../../contexts";
import { ROLES_KEY } from "../../constants";

const id = ROLES_KEY;
const getItems = (roles: IRole[], value: IRole[]): IFieldSelectItem[] => {
  return roles.map(({ roleId, roleLabel }) => ({
    id: roleId,
    label: roleLabel,
    selected: new Set(value.map((r) => r.roleId)).has(roleId),
  }));
};

interface IFieldRoles {
  value?: IRole[];
  readOnly: boolean;
}

const FieldRoles = ({ value = [], readOnly }: IFieldRoles) => {
  const classes = useStyles({});
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const roles = React.useContext(ContextRoles);

  const [inputValue, setInputValue] = React.useState("");

  const items = getItems(roles, value);
  const onChange = React.useCallback(
    (item: IFieldSelectItem, array: IFieldSelectItem[]) => {
      dispatchViewport({
        type: ACT_VPORT.USER_CHANGE_ROLES,
        value: array.map((r) => ({
          roleId: r.id,
          roleLabel: r.label,
        })),
      });
    },
    [dispatchViewport]
  );

  return (
    <FieldSelect
      label={<Label id={id} readOnly={readOnly} />}
      className={classes.field}
      value={items.filter((s) => s.selected)}
      options={items.filter((r) => {
        const label = r.label.toLowerCase();
        const input = inputValue.toLowerCase();
        return label.includes(input);
      })}
      searchable
      readOnly={readOnly}
      onChange={onChange}
      onSearch={setInputValue}
    />
  );
};

export default FieldRoles;
