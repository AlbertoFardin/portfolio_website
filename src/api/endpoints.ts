import * as queryString from "query-string";
import { ICoordinates, Service } from "../interfaces";
import { INDEX_NAME } from "../constants";
import serializeObject from "../utils/serializeObject";
import { ISearchFilesParams } from "../components/AreaFiles/useSearchFiles/ISearch";

export const BASE_URL = `${process.env.BASE_URL_GATEWAY || ""}`;

enum SEECOMMERCE_UPLOAD_TYPE {
  POST = "post",
  SHOOTING = "shooting",
  XLSX = "xlsx",
  XLSXPRO = "xlsxpro",
  VIDEO = "video",
}

export default {
  newUploadDA: {
    url: (): string => `${BASE_URL}/${Service.DIGITALASSETS}/upload/new`,
    method: "POST",
  },
  newUploadSC: {
    url: (type?: SEECOMMERCE_UPLOAD_TYPE): string =>
      `${BASE_URL}/${Service.SEECOMMERCE}/products/upload${
        type ? `/${type}` : ""
      }/new`,
    method: "POST",
  },
  profilePictureUpload: {
    url: (): string =>
      `${BASE_URL}/${Service.USERS}/user/profile/picture/upload`,
    method: "POST",
  },
  profilePictureConfirm: {
    url: (fileId: string): string =>
      `${BASE_URL}/${Service.USERS}/user/profile/picture/confirm/${fileId}`,
    method: "PUT",
  },
  newUploadConfirm: {
    url: (fileId: string, service: Service, type?: string): string =>
      `${BASE_URL}/${
        service === Service.SEECOMMERCE ? service + "/products" : service
      }/upload/confirm${type ? `/${type}` : ""}/${fileId}`,
    method: "PUT",
  },
  getRendition: {
    url: (docId: string, service: Service, rendId?: string): string =>
      `${BASE_URL}/${
        service === Service.SEECOMMERCE ? service + "/products" : service
      }/media-content/${docId}${rendId ? `/${rendId}` : ""}`,
    method: "GET",
  },
  getDownloadProductMedia: {
    url: (docId: string, rendId?: string): string =>
      `${BASE_URL}/${
        Service.SEECOMMERCE
      }/products/download/product/media-content/${docId}${
        rendId ? `/${rendId}` : ""
      }`,
    method: "GET",
  },
  getDownloadDAMedia: {
    url: (docId: string, rendId?: string): string =>
      `${BASE_URL}/${Service.DIGITALASSETS}/download/media-content/${docId}${
        rendId ? `/${rendId}` : ""
      }`,
    method: "GET",
  },
  getRenditionPublic: {
    url: (link: string, docId: string, rendId?: string): string =>
      `${BASE_URL}/${
        Service.DIGITALASSETS
      }/media-content/published/${link}/${docId}${rendId ? `/${rendId}` : ""}`,
    method: "GET",
  },
  deleteSeecommerceMedia: {
    url: (fileId: string, type?: string): string =>
      `${BASE_URL}/${Service.SEECOMMERCE}/products/media-content${
        type ? `/${type}` : ""
      }/${fileId}`,
    method: "DELETE",
  },
  getJsonstore: {
    url: (coord: ICoordinates) =>
      `${BASE_URL}/jsonstore?${queryString.stringify(coord)}`,
    method: "GET",
  },
  putJsonstore: {
    url: () => `${BASE_URL}/jsonstore`,
    method: "PUT",
  },
  msearch: {
    url: (): string => `${BASE_URL}/${Service.SEECOMMERCE}/msearch`,
    method: "POST",
  },
  search: {
    url: (index: string): string =>
      `${BASE_URL}/${Service.SEECOMMERCE}/search/${index}`,
    method: "POST",
  },
  postMultiReady: {
    url: (type: "media" | "attribute"): string =>
      `${BASE_URL}/${Service.SEECOMMERCE}/products/${type}/multiReady`,
    method: "POST",
  },
  postReady: {
    url: (type: "media" | "attribute"): string =>
      `${BASE_URL}/${Service.SEECOMMERCE}/products/${type}/ready`,
    method: "POST",
  },
  deleteReady: {
    url: (type: "media" | "attribute"): string =>
      `${BASE_URL}/${Service.SEECOMMERCE}/products/${type}/ready`,
    method: "DELETE",
  },
  postViewCheck: {
    url: (): string => `${BASE_URL}/${Service.SEECOMMERCE}/products/viewCheck`,
    method: "POST",
  },
  postViews: {
    url: (): string => `${BASE_URL}/${Service.SEECOMMERCE}/products/views`,
    method: "POST",
  },
  postProduction: {
    url: (): string =>
      `${BASE_URL}/${Service.SEECOMMERCE}/products/postProduction`,
    method: "POST",
  },
  postExportData: {
    url: (): string => `${BASE_URL}/${Service.SEECOMMERCE}/export`,
    method: "POST",
  },
  massiveDownloadRenamed: {
    url: (service: Service): string =>
      `${BASE_URL}/${
        service === Service.SEECOMMERCE ? service + "/products" : service
      }/massive-download/scheduleWithRename`,
    method: "POST",
  },
  editProduct: {
    url: (): string => `${BASE_URL}/${Service.SEECOMMERCE}/products`,
    method: "PUT",
  },
  editMultiProduct: {
    url: (): string =>
      `${BASE_URL}/${Service.SEECOMMERCE}/products/multiProduct`,
    method: "PUT",
  },
  searchDictionaries: {
    url: (): string =>
      `${BASE_URL}/${Service.SEECOMMERCE}/search/${INDEX_NAME.DICTIONARIES}`,
    method: "POST",
  },
  searchCatalogs: {
    url: (): string =>
      `${BASE_URL}/${Service.SEECOMMERCE}/search/${INDEX_NAME.CATALOGS}`,
    method: "POST",
  },
  searchCategories: {
    url: (): string =>
      `${BASE_URL}/${Service.SEECOMMERCE}/search/${INDEX_NAME.CATEGORIES}`,
    method: "POST",
  },
  endpointGraphql: {
    url: (): string => {
      switch (process.env.ENV) {
        case "prod":
          return "https://api-gql.wardacloud.com/graphql";
        default:
          return `https://api-gql-${process.env.ENV}.wardacloud.com/graphql`;
      }
    },
    method: "POST",
  },
  assignment: {
    url: (): string => `${BASE_URL}/${Service.SEECOMMERCE}/products/assignment`,
    method: "POST",
  },
  multiAssignment: {
    url: (): string =>
      `${BASE_URL}/${Service.SEECOMMERCE}/products/multiAssignment`,
    method: "POST",
  },
  distributions: {
    url: (): string =>
      `${BASE_URL}/${Service.SEECOMMERCE}/products/distributions`,
    method: "POST",
  },
  multiViewData: {
    url: (): string =>
      `${BASE_URL}/${Service.SEECOMMERCE}/products/multiViewData`,
    method: "POST",
  },
  multiResetViews: {
    url: (): string =>
      `${BASE_URL}/${Service.SEECOMMERCE}/products/multiResetViews`,
    method: "POST",
  },
  resetAttribute: {
    url: (): string =>
      `${BASE_URL}/${Service.SEECOMMERCE}/products/resetAttribute`,
    method: "POST",
  },
  searchFilesShared: {
    url: (): string => `${BASE_URL}/${Service.DIGITALASSETS}/share/search`,
    method: "POST",
  },
  putFolder: {
    url: (): string => `${BASE_URL}/${Service.DIGITALASSETS}/folder`,
    method: "PUT",
  },
  putFile: {
    url: (): string => `${BASE_URL}/${Service.DIGITALASSETS}/file`,
    method: "PUT",
  },
  moveFiles: {
    url: (): string => `${BASE_URL}/${Service.DIGITALASSETS}/files`,
    method: "POST",
  },
  deleteFile: {
    url: (): string => `${BASE_URL}/${Service.DIGITALASSETS}/files`,
    method: "DELETE",
  },
  postFolder: {
    url: (): string => `${BASE_URL}/${Service.DIGITALASSETS}/folder`,
    method: "POST",
  },
  postFile: {
    url: (): string => `${BASE_URL}/${Service.DIGITALASSETS}/file`,
    method: "POST",
  },
  publiccdn: {
    url: (): string => `${BASE_URL}/${Service.DIGITALASSETS}/publiccdn`,
    method: "POST",
  },
  share: {
    url: (): string => `${BASE_URL}/${Service.DIGITALASSETS}/share`,
    method: "POST",
  },
  searchDiz: {
    url: (): string => `${BASE_URL}/${Service.DIGITALASSETS}/search/diz`,
    method: "POST",
  },
  createItemTag: {
    url: (): string => `${BASE_URL}/${Service.DIGITALASSETS}/itemtag`,
    method: "PUT",
  },
  deleteItemTag: {
    url: (): string => `${BASE_URL}/${Service.DIGITALASSETS}/itemtag`,
    method: "DELETE",
  },
  deleteTag: {
    url: (): string => `${BASE_URL}/${Service.DIGITALASSETS}/tag`,
    method: "DELETE",
  },
  createNotification: {
    url: (): string =>
      `${BASE_URL}/notifier/notifications/${Service.SEECOMMERCE}`,
    method: "POST",
  },
  descendants: {
    url: (): string => `${BASE_URL}/${Service.DIGITALASSETS}/descendants`,
    method: "POST",
  },
  removeNotification: {
    url: (id: string): string =>
      `${BASE_URL}/notifier/notifications/${Service.SEECOMMERCE}/${id}`,
    method: "DELETE",
  },
  notificationMarkRead: {
    url: (id: string, mark: boolean): string =>
      `${BASE_URL}/notifier/notifications/${Service.SEECOMMERCE}/${id}/read?mark=${mark}`,
    method: "PUT",
  },
  notificationMarkAllRead: {
    url: (mark: boolean): string =>
      `${BASE_URL}/notifier/notifications/${Service.SEECOMMERCE}/read?mark=${mark}`,
    method: "PUT",
  },
  notificationMarkView: {
    url: (id: string, mark: boolean): string =>
      `${BASE_URL}/notifier/notifications/${Service.SEECOMMERCE}/${id}/view?mark=${mark}`,
    method: "PUT",
  },
  notificationMarkAllView: {
    url: (mark: boolean): string =>
      `${BASE_URL}/notifier/notifications/${Service.SEECOMMERCE}/view?mark=${mark}`,
    method: "PUT",
  },
  deleteNotifications: {
    url: (): string =>
      `${BASE_URL}/notifier/notifications/${Service.SEECOMMERCE}`,
    method: "DELETE",
  },
  getNotifications: {
    url: (size: number, from: number, filter?: string): string =>
      `${BASE_URL}/notifier/notifications/${
        Service.SEECOMMERCE
      }?size=${size}&from=${from}${!filter ? "" : `&filter=${filter}`}`,
    method: "GET",
  },
  getNotificationsCount: {
    url: (filter?: string): string =>
      `${BASE_URL}/notifier/notifications/${Service.SEECOMMERCE}/count?${
        !filter ? "" : `&filter=${filter}`
      }`,
    method: "GET",
  },
  getNotificationById: {
    url: (id: string): string =>
      `${BASE_URL}/notifier/notifications/${Service.SEECOMMERCE}/${id}`,
    method: "GET",
  },
  exportXlsx: {
    url: (): string => `${BASE_URL}/${Service.SEECOMMERCE}/export/v2`,
    method: "POST",
  },
  getFiles: {
    url: (p: ISearchFilesParams): string =>
      `${BASE_URL}/${Service.DIGITALASSETS}/files?${serializeObject(p)}`,
    method: "GET",
  },
  getFileDetail: {
    url: (ids: string[]): string =>
      `${BASE_URL}/${Service.DIGITALASSETS}/filesdetail?${serializeObject({
        ids: JSON.stringify(ids),
      })}`,
    method: "GET",
  },
  privateshares: {
    url: (): string => `${BASE_URL}/${Service.DIGITALASSETS}/privateshares`,
    method: "PUT",
  },
  getTags: {
    url: (name: string, size: number): string =>
      `${BASE_URL}/${Service.DIGITALASSETS}/tags?${serializeObject({
        name,
        size,
      })}`,
    method: "GET",
  },
  getSeecommerceProduct: {
    url: (product: string): string =>
      `${BASE_URL}/${Service.SEECOMMERCE}/products?product=${product}`,
    method: "GET",
  },
  putUserProfile: {
    url: (): string => `${BASE_URL}/${Service.USERS}/user/profile`,
    method: "PUT",
  },
  getUsers: {
    url: (): string =>
      `${BASE_URL}/${Service.USERS}/user?app=${process.env.PRODUCT_ID}`,
    method: "GET",
  },
  getAdminPermissions: {
    url: (): string => `${BASE_URL}/${Service.USERS}/admin/permissions`,
    method: "GET",
  },
  getAdminUsers: {
    url: (): string =>
      `${BASE_URL}/${Service.USERS}/admin/users?app=${process.env.PRODUCT_ID}`,
    method: "GET",
  },
  getTenantConfig: {
    url: (): string =>
      `${BASE_URL}/${Service.USERS}/tenant?app=${process.env.PRODUCT_ID}`,
    method: "GET",
  },
  getUserProfile: {
    url: (): string =>
      `${BASE_URL}/${Service.USERS}/user/profile?app=${process.env.PRODUCT_ID}`,
    method: "GET",
  },
  putCopyright: {
    url: (): string => `${BASE_URL}/${Service.DIGITALASSETS}/copyright`,
    method: "PUT",
  },
  createUser: {
    url: (): string => `${BASE_URL}/${Service.USERS}/user`,
    method: "POST",
  },
  createUserAdmin: {
    url: (): string => `${BASE_URL}/${Service.USERS}/admin/user`,
    method: "POST",
  },
  getProduct: {
    url: (id: string): string =>
      `${BASE_URL}/${Service.SEECOMMERCE}/products?product=${id}`,
    method: "GET",
  },
  getJobs: {
    url: (): string =>
      `${BASE_URL}/${Service.NOTIFIER}/jobs/${Service.SEECOMMERCE}?size=1000&from=0`,
    method: "GET",
  },
  getJobId: {
    url: (id: string): string =>
      `${BASE_URL}/${Service.NOTIFIER}/jobs/${Service.SEECOMMERCE}/${id}`,
    method: "GET",
  },
  deleteJobs: {
    url: (): string =>
      `${BASE_URL}/${Service.NOTIFIER}/jobs/${Service.SEECOMMERCE}`,
    method: "DELETE",
  },
  deleteJobId: {
    url: (id: string): string =>
      `${BASE_URL}/${Service.NOTIFIER}/jobs/${Service.SEECOMMERCE}/${id}`,
    method: "DELETE",
  },
};
