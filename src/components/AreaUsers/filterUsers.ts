import intersectionBy from "lodash-es/intersectionBy";
import isEmpty from "lodash-es/isEmpty";
import { IFacetType } from "../../componentsBase/Facets";
import { IAdminUserProfile, IFilter } from "../../interfaces";
import { ID_KEY, ROLES_KEY, TENANT_KEY } from "./constants";

const filterUsers = (
  users: IAdminUserProfile[],
  filters: IFilter[]
): IAdminUserProfile[] => {
  let newUsers = Array.from(users);

  for (const valueFilter of filters) {
    if (valueFilter.type === IFacetType.TEXTAREA && valueFilter.id !== ID_KEY)
      newUsers = valueFilter.value
        ? newUsers.filter((u) =>
            (valueFilter.value as string[]).some(
              (v) =>
                u.profileData[valueFilter.id]
                  .toLowerCase()
                  .indexOf(v.toLowerCase()) !== -1
            )
          )
        : newUsers;
    if (valueFilter.type === IFacetType.TEXTAREA && valueFilter.id === ID_KEY)
      newUsers = valueFilter.value
        ? newUsers.filter((u) =>
            (valueFilter.value as string[]).some(
              (v) => u[ID_KEY].toLowerCase().indexOf(v.toLowerCase()) !== -1
            )
          )
        : newUsers;
    if (valueFilter.type === IFacetType.BOOLEAN) {
      newUsers =
        valueFilter.value !== undefined
          ? newUsers.filter(
              (u) => u.profileData[valueFilter.id] === valueFilter.value
            )
          : newUsers;
    }
    if (valueFilter.type === IFacetType.MULTISELECTION) {
      if (valueFilter.id === ROLES_KEY) {
        newUsers = !isEmpty(valueFilter.value)
          ? newUsers.filter(
              (u) =>
                intersectionBy(
                  u.roles.map(({ roleId }) => ({ id: roleId })),
                  valueFilter.value,
                  "id"
                ).length > 0
            )
          : newUsers;
      }
      if (valueFilter.id === TENANT_KEY) {
        newUsers = !isEmpty(valueFilter.value)
          ? newUsers.filter(
              (u) =>
                intersectionBy(
                  u.tenants.map(({ tenantId }) => ({ id: tenantId })),
                  valueFilter.value,
                  "id"
                ).length > 0
            )
          : newUsers;
      }
    }
    if (valueFilter.type === IFacetType.DATEPICKER) {
      const { value, id } = valueFilter;
      if (value && value.startDate && value.endDate) {
        const { startDate, endDate } = value;
        newUsers = newUsers.filter((u) => {
          const timeInMs = new Date(u.profileData[id]).getTime();
          return timeInMs > startDate && timeInMs < endDate;
        });
      }
    }
  }

  return newUsers;
};

export default filterUsers;
