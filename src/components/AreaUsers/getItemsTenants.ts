import { TenantStatus } from "../../interfaces";

interface IItem {
  id: string;
  label: string;
}

const getItemsTenants = (
  tenants: { tenantId: string; status: TenantStatus }[]
): IItem[] => {
  if (!tenants) return [];
  return tenants.map(({ tenantId, status }) => ({
    id: tenantId,
    label: (status === TenantStatus.ENABLED ? "🟢" : "🔴") + " " + tenantId,
  }));
};

export default getItemsTenants;
