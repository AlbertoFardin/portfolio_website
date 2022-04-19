import * as React from "react";
import { FacetMultiSelection } from "../../../componentsBase/Facets";
import { IFacetMultiSelection } from "../../../componentsBase/Facets/FacetMultiSelection";
import { ContextRoles } from "../contexts";
import getItemsRoles from "../getItemsRoles";

const FacetSearch = ({
  id,
  label,
  subLabel,
  type,
  value = [],
  onChange,
  className,
  disabled,
  disabledInfo,
}: IFacetMultiSelection) => {
  const roles = React.useContext(ContextRoles);
  const [inputValue, setInputValue] = React.useState("");

  return (
    <FacetMultiSelection
      id={id}
      type={type}
      label={label}
      subLabel={subLabel}
      onChange={onChange}
      onSearch={setInputValue}
      options={getItemsRoles(roles).filter((o) => {
        const label = o.label.toLowerCase();
        const input = inputValue.toLowerCase();
        return label.includes(input);
      })}
      value={value}
      className={className}
      disabled={disabled}
      disabledInfo={disabledInfo}
    />
  );
};

export default FacetSearch;
