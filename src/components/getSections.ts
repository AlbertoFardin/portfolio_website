import {
  AREA_LOOK,
  AREA_PERFORMANCE,
  AREA_PRODUCTS,
  AREA_STAGING,
  AREA_ATTRIBUTES,
  AREA_CATALOGS,
  AREA_CATEGORIES,
  AREA_MY_WORK,
  AREA_PERMISSIONS,
  AREA_USERS,
  AREA_FILES,
} from "../constants";
import { IPermission, ISection } from "../interfaces";
import PERMISSIONS from "../permissions";
import permissionsCheck from "../utils/permissionsCheck";

const getSections = (permissions: IPermission[]): ISection[] => [
  {
    hidden: !permissionsCheck({
      keys: [PERMISSIONS.access_product_area],
      permissions,
    }),
    id: AREA_PRODUCTS,
    icon: "list_alt",
    label: "Products",
  },
  {
    hidden: !permissionsCheck({
      keys: [PERMISSIONS.access_look_area],
      permissions,
    }),
    disabled: true,
    id: AREA_LOOK,
    icon: "list_alt",
    label: "Look",
  },
  {
    hidden: !permissionsCheck({
      keys: [PERMISSIONS.access_performance_area],
      permissions,
    }),
    disabled: true,
    id: AREA_PERFORMANCE,
    icon: "insert_chart_outlined",
    label: "Performance",
  },
  {
    hidden: !permissionsCheck({
      keys: [PERMISSIONS.access_staging_area],
      permissions,
    }),
    id: AREA_STAGING,
    icon: "image_not_supported",
    label: "Staging Area",
  },
  {
    hidden: !permissionsCheck({
      keys: [PERMISSIONS.access_digital_asset_area],
      permissions,
    }),
    id: AREA_FILES,
    icon: "insert_drive_file",
    label: "Digital Assets",
  },
  {
    hidden: !permissionsCheck({
      keys: [
        PERMISSIONS.access_attributes_config,
        PERMISSIONS.access_catalogs_config,
        PERMISSIONS.access_categories_config,
        PERMISSIONS.access_users_config,
        PERMISSIONS.access_tags_config,
      ],
      condition: "OR",
      permissions,
    }),
    id: "_",
    divider: true,
    label: "Configuration",
  },
  {
    hidden: !permissionsCheck({
      keys: [PERMISSIONS.access_attributes_config],
      permissions,
    }),
    id: AREA_ATTRIBUTES,
    icon: "view_week",
    label: "Attributes",
  },
  {
    hidden: !permissionsCheck({
      keys: [PERMISSIONS.access_catalogs_config],
      permissions,
    }),
    id: AREA_CATALOGS,
    icon: "auto_stories",
    label: "Catalogs",
  },
  {
    hidden: !permissionsCheck({
      keys: [PERMISSIONS.access_categories_config],
      permissions,
    }),
    id: AREA_CATEGORIES,
    icon: "category",
    label: "Categories",
  },
  {
    hidden: !permissionsCheck({
      keys: [
        PERMISSIONS.access_users_config,
        PERMISSIONS.users_admin_get_users_data,
      ],
      permissions,
    }),
    id: AREA_USERS,
    icon: "people_alt",
    label: "Users",
  },
  {
    hidden: !permissionsCheck({
      keys: [
        PERMISSIONS.access_permissions_administration,
        PERMISSIONS.users_admin_get_permissions,
      ],
      permissions,
    }),
    id: AREA_PERMISSIONS,
    icon: "key",
    label: "Permissions",
  },
  {
    hidden: !permissionsCheck({
      keys: [PERMISSIONS.access_tags_config],
      permissions,
    }),
    disabled: true,
    id: "tag",
    icon: "local_offer",
    label: "Tags",
  },
  {
    hidden: !permissionsCheck({
      keys: [PERMISSIONS.access_product_area],
      permissions,
    }),
    disabled: false,
    id: AREA_MY_WORK,
    icon: "local_offer",
    label: "My Work Area",
  },
];

export default getSections;
