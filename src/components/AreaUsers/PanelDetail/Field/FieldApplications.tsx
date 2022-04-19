import * as React from "react";
import FieldSelect, {
  IFieldSelectItem,
} from "../../../../componentsBase/Field/FieldSelect";
import useStyles from "./useStyles";
import FieldLabel from "../../../DrawerDetail/FieldLabel";
import { ACT_VPORT } from "../../reducer";
import { ContextDispatchViewport, ContextApplications } from "../../contexts";

const getItems = (apps: string[], value: string[]): IFieldSelectItem[] => {
  return apps.map((id) => ({
    id,
    label: id,
    selected: new Set(value).has(id),
  }));
};

interface IFieldApplications {
  value?: string[];
  readOnly?: boolean;
}

const FieldApplications = ({
  value = [],
  readOnly = false,
}: IFieldApplications) => {
  const classes = useStyles({});
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const applications = React.useContext(ContextApplications);

  const [inputValue, setInputValue] = React.useState("");

  const items = getItems(applications, value);
  const onChange = React.useCallback(
    (item: IFieldSelectItem, array: IFieldSelectItem[]) => {
      dispatchViewport({
        type: ACT_VPORT.USER_CHANGE_APPLICATIONS,
        value: array.map((r) => r.id),
      });
    },
    [dispatchViewport]
  );

  if (applications.length === 1) return null;

  return (
    <FieldSelect
      label={<FieldLabel label="Applications" mandatory={!readOnly} />}
      className={classes.field}
      value={items.filter((s) => s.selected)}
      options={items.filter((r) => r.label.includes(inputValue))}
      searchable
      onChange={onChange}
      onSearch={setInputValue}
      readOnly={readOnly}
    />
  );
};

export default FieldApplications;
