import * as React from "react";
import getItemsTenants from "../../getItemsTenants";
import { TenantStatus } from "../../../../interfaces";
import FieldMultiString from "../../../../componentsBase/Field/FieldMultiString";
import Label from "./Label";
import useStyles from "./useStyles";
import { TENANT_KEY } from "../../constants";

const id = TENANT_KEY;

interface IFieldTenants {
  value?: { tenantId: string; status: TenantStatus }[];
  readOnly?: boolean;
}

const FieldTenants = ({ value = [], readOnly = true }: IFieldTenants) => {
  const classes = useStyles({});
  return (
    <FieldMultiString
      label={<Label id={id} readOnly={readOnly} />}
      className={classes.field}
      value={getItemsTenants(value)}
      readOnly={readOnly}
    />
  );
};

export default FieldTenants;
