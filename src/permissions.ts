// LINK https://wardafactory.atlassian.net/wiki/spaces/SEEC/pages/2160033804/Permessi+implementati+a+UI

enum PERMISSIONS {
  access_product_area = "access_product_area",
  access_performance_area = "access_performance_area",
  access_staging_area = "access_staging_area",
  access_digital_asset_area = "access_digital_asset_area",
  access_attributes_config = "access_attributes_config",
  access_catalogs_config = "access_catalogs_config",
  access_categories_config = "access_categories_config",
  access_users_config = "access_users_config",
  access_tags_config = "access_tags_config",
  access_look_area = "access_look_area",
  access_permissions_administration = "access_permissions_administration",
  seecommerce_manage_post_production_media = "seecommerce_manage_post_production_media",
  seecommerce_manage_shooting_media = "seecommerce_manage_shooting_media",
  seecommerce_uploadoad_xlsx_pro = "seecommerce_uploadoad_xlsx_pro",
  seecommerce_edit_product_attributes = "seecommerce_edit_product_attributes", // TBD: POST seecommerce/products/refresh
  seecommerce_manage_share_link = "seecommerce_manage_share_link",
  seecommerce_review_product_view = "seecommerce_review_product_view",
  seecommerce_check_view = "seecommerce_check_view",
  seecommerce_media_for_post_production = "seecommerce_media_for_post_production",
  seecommerce_manage_media_ready = "seecommerce_manage_media_ready",
  seecommerce_manage_attribute_ready = "seecommerce_manage_attribute_ready",
  manage_product_attribute = "manage_product_attribute",
  digitalassets_manage_tag = "digitalassets_manage_tag",
  seecommerce_assign = "seecommerce_assign",
  seecommerce_edit_product_view = "seecommerce_edit_product_view",
  seecommerce_download = "seecommerce_download",
  secommerce_export_xls = "secommerce_export_xls",
  seecommerce_annotation = "seecommerce_annotation",
  digitalassets_download = "digitalassets_download",
  seecommerce_manage_video_media = "seecommerce_manage_video_media", // TBD: gestire l'endpoin POST /seecommerce/upload/video/new PUT /seecommerce/upload/confirm/video/{id}, DELETE /seecommerce/media-content/video/{id}
  seecommerce_upload_xlsx_pro = "seecommerce_upload_xlsx_pro", // TBD: da applicare assieme seecommerce_edit_product_attributes POST /seecommerce/upload/xlsxpro/new, PUT /seecommerce/upload/confirm/xlsxpro/{id}
  seecommerce_upload_xlsx = "seecommerce_upload_xlsx", // TBD: da applicare assieme seecommerce_edit_product_attributes POST /seecommerce/upload/xlsx/new PUT /seecommerce/upload/confirm/xlsx/{id}
  digitalassets_manage_copyright = "digitalassets_manage_copyright", // TBD PUT digitalassets/copyright
  seecommerce_massive_download = "seecommerce_massive_download", // TBD POST seecommerce/massive-download/schedule e POST seecommerce/massive-download/scheduleWithRename
  seecommerce_warda_admin = "seecommerce_warda_admin", // TBD: POST seecommerce/config, PUT seecommerce/config, GET seecommerce/administration/events/product/{tenant}, GET seecommerce/administration/events/product/{tenant}/{aggregateId}, GET seecommerce/administration/state/configuration/{tenant}/{aggregateType}, GET seecommerce/administration/state/product/{tenant}, GET seecommerce/administration/state/product/{tenant}/{aggregateId}, GET seecommerce/administration/state/media-content-mappings/{tenant}/{fileId}, GET seecommerce/administration/state/staging-area/{tenant}, GET seecommerce/administration/state/staging-area/{tenant}/{businessId}, GET seecommerce/administration/state/broker/{tenant}/{aggregateType}
  seecommerce_update_config = "seecommerce_update_config", // TBD: POST seecommerce/config/attributes, POST seecommerce/config/dictionary, POST seecommerce/config/rules, POST seecommerce/config/businesskeys, POST seecommerce/config/mediaAlternativeNames, POST seecommerce/config/catalog, PUT seecommerce/config/catalog, POST seecommerce/config/catalog/languages, POST seecommerce/config/views
  seecommerce_edit_product_catalogs = "seecommerce_edit_product_catalogs", // TBD: POST seecommerce/products/resetCatalogs, POST seecommerce/products/catalogs
  users_get_tenant_data = "users_get_tenant_data", // TBD: GET users/tenant
  users_manage_tenant_roles = "users_manage_tenant_roles", // TBD: POST users/tenant/roles, DELETE users/tenant/roles
  users_resend_invitation = "users_resend_invitation", // TBD: POST users/resendInvitation
  users_create_user = "users_create_user",
  users_admin_get_users_data = "users_admin_get_users_data",
  users_get_user_data = "users_get_user_data", // TBD: GET users/user/{userId}
  users_update_user = "users_update_user", // TBD: PUT users/user/{userId}, PUT users/user/{userId}/email, PUT users/user/{userId}/tenant/statusToggle, PUT users/user/{userId}/permission, PUT users/user/{userId}/role
  users_update_user_applications = "users_update_user_applications", // TBD: PUT users/user/{userId}/application
  digitalassets_share = "digitalassets_share", // TBD: POST digitalassets/share share pubblico dentro seecommerce (area digitalassets)
  digitalassets_public_cdn = "digitalassets_public_cdn", // TBD: POST digitalassets/publiccdn share pubblico
  digitalassets_get_file = "digitalassets_get_file", // TBD: GET digitalassets/file
  digitalassets_manage_file = "digitalassets_manage_file", // TBD: POST digitalassets/file, DELETE digitalassets/file, PUT digitalassets/file
  digitalassets_private_share = "digitalassets_private_share", // TBD: PUT digitalassets/privateshares
  digitalassets_get_files = "digitalassets_get_files", // TBD: GET digitalassets/files
  digitalassets_manage_files = "digitalassets_manage_files", // TBD: DELETE digitalassets/files,PUT digitalassets/files,POST digitalassets/files
  digitalassets_get_tags = "digitalassets_get_tags", //TBD: GET digitalassets/tags
  digitalassets_manage_item_tag = "digitalassets_manage_item_tag", //TBD: PUT digitalassets/itemtag, DELETE digitalassets/itemtag
  digitalassets_manage_folder = "digitalassets_manage_folder", // TBD:POST digitalassets/folder, DELETE digitalassets/folder,PUT digitalassets/folder
  digital_assets_folder_download = "digital_assets_folder_download", // TBD: POST digitalassets/descendants
  digitalassets_manage_media = "digitalassets_manage_media", // TBD: DELETE /digitalassets/media-content/{id}, POST /digitalassets/upload/new, PUT /digitalassets/upload/confirm/{id}
  digitalassets_massive_download = "digitalassets_massive_download", // TBD: POST digitalassets/massive-download/scheduleWithRename
  conference_call_info = "conference_call_info", // TBD: GET /info
  conference_manage_call = "conference_manage_call", //TBD: POST /create, POST /end
  conference_join_call = "conference_join_call", // TBD: POST /join
  seecommerce_manage_copyright = "seecommerce_manage_copyright", // TBD: PUT seecommerce/copyright
  seecommerce_manage_bulk_media_ready = "seecommerce_manage_bulk_media_ready", // TBD: POST seecommerce /products/media/multiReady
  seecommerce_manage_bulk_attribute_ready = "seecommerce_manage_bulk_attribute_ready", // // TBD: seecommerce POST /products/attribute/multiReady
  users_admin_manage_is_warda_flag = "users_admin_manage_is_warda_flag",
  users_admin_get_permissions = "users_admin_get_permissions",
}

export default PERMISSIONS;