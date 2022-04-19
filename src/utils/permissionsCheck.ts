// eslint-disable-next-line @typescript-eslint/no-var-requires
const memoize = require("fast-memoize");
import { IPermission } from "../interfaces";

interface IPermissionsCheck {
  keys: string[];
  condition?: "AND" | "OR";
  permissions: IPermission[];
}

const permissionsCheck = ({
  keys,
  condition = "AND",
  permissions,
}: IPermissionsCheck): boolean => {
  const permissionsSet = new Set(permissions.map((p) => p.id));
  return condition === "OR"
    ? keys.some((key) => permissionsSet.has(key))
    : !keys.some((key) => !permissionsSet.has(key));
};

const memoized = memoize(permissionsCheck);

export default memoized as (p: IPermissionsCheck) => boolean;
