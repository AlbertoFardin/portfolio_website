import { IFacetBase } from "./componentsBase/Facets";
import { IItemsSet } from "./componentsBase/ConfigManagement";
import { IAnnotation } from "./componentsBase/ImageAnnotation";
import * as Colors from "./componentsBase/style/Colors";
import { IItem as IItemFacetMultiSelection } from "./componentsBase/Facets/FacetMultiSelection";
import {
  IColumnWithGroupId,
  ISortOrder,
  ISortType,
  IUserColumn,
} from "./componentsBase/StickyGrid";
import {
  KEY_ASSIGNMENTS,
  KEY_ATTRIBUTE_SETS,
  KEY_CARRYOVER_PARENT,
  KEY_CATALOG,
  KEY_EDITED_ATTRIBUTES,
  KEY_ENTITY_ID,
  KEY_ENTITY_STRUCTURE_ID,
  KEY_ENTITY_TYPE,
  KEY_MEDIA,
  KEY_PUBLICATIONS,
  KEY_READY,
  KEY_ROOT_ID,
  KEY_VIEWS_EDITING_PERFORMED,
  KEY_VIEW_CHECK,
  KEY_VIEW_DATA,
  KEY_VIEW_STATUS,
} from "./constants";

export enum Service {
  DIGITALASSETS = "digitalassets",
  SEECOMMERCE = "seecommerce",
  USERS = "users",
  ARCHIVER = "archiver",
  NOTIFIER = "notifier",
}

export enum CellType {
  FOLDER = "folder",
  FILE = "file",
}

export interface IAggregationItem {
  key: string;
  doc_count: number;
}
export interface IAggregation {
  id: string;
  items: IAggregationItem[];
  sum_other_doc_count: number;
}
export interface IResultEs {
  items;
  itemsTotal: number;
  aggregations: IAggregation[];
}
export interface ISearchEs {
  aggs?;
  from?: number;
  size?: number;
  sort?: Array<{ [id: string]: { order: ISortOrder } }>;
  query?;
  _source?: boolean;
  fields?: string[];
}

export enum FiltersCondition {
  AND = "AND",
  OR = "OR",
}

export enum FileSection {
  MY_FILES = "myfiles",
  SHARES_PRIVATE = "privateshares",
}

export interface IWsCallbackViewport {
  id: string;
  callback: (
    itemsWs: IWsNotification[],
    dispatch: React.Dispatch<unknown>
  ) => void;
}

export enum ArchiverStatus {
  STARTED = "Started",
  COMPLETED = "Completed",
}

export enum AttributeType {
  SYSTEM = "SYSTEM",
  USER = "USER",
  MASTER = "MASTER",
}

export interface IReady {
  catalog: string;
  contentId: string;
  contentType: ContentType;
  language?: string;
  instant: number;
  user: string;
}

export enum ContentType {
  MEDIA = "Media",
  ATTRIBUTE = "Attribute",
}

export interface ICoordinates {
  product: string;
  environment: string;
  context: string;
  key?: string;
}

export enum DistributionStatus {
  DONE = "DONE",
  ADDITION_REQUESTED = "ADDITION_REQUESTED",
  REMOVAL_REQUESTED = "REMOVAL_REQUESTED",
}

export interface IMedia {
  fileId: string;
  annotations?: IAnnotation[];
  annotationsResolved?: boolean;
  filename: string;
  mediaType: MediaType;
  mimeType: string;
  uploaded: number;
  uploader: string;
  view: string;
  carryOverFatherId?: string;
  distributionStatus?: DistributionStatus;
  postProduce?: boolean;
  distribution?: {
    original?: string;
    identify?: string;
    xs?: string;
    s?: string;
    m?: string;
    l?: string;
    xl?: string;
    xxl?: string;
    mobileM?: string;
    mobileXL?: string;
  };
}

export interface IContentSort extends ISortType {
  label: string;
}

export enum ViewStatus {
  DEFAULT = "DEFAULT",
  REVIEW = "REVIEW",
}

export enum ViewCheck {
  NO_CHECK = "NO_CHECK",
  CHECK = "CHECK",
  CHECK_TO_VERIFY = "CHECK_TO_VERIFY",
}

// Media Type è un tipo usato a UI
// per dare un'inidicazione o linea guida
// all'utente su quale media caricare per quella data vista
// ad oggi, questo campo viene tradotto visivamente
// da un plaholder differente a seconda del MediaType
export enum MediaType {
  IMAGE_S = "SHOOTING",
  IMAGE_P = "POST_PRODUCED",
  VIDEO = "VIDEO",
  IMAGE = "IMAGE", // from BG
  MODEL = "MODEL", // from BG
}

export enum XlsType {
  UPLOAD_XLS_EDITOR = "editor",
  UPLOAD_XLS_PRO = "pro",
}

export enum ViewType {
  OPTIONAL = "OPTIONAL",
  MANDATORY = "MANDATORY",
}

export enum ViewStatusAnnotated {
  ANNOTATION_NOT_RESOLVED = "ANNOTATION_NOT_RESOLVED",
  ANNOTATION_RESOLVED = "ANNOTATION_RESOLVED",
  NOT_ANNOTATED = "NOT_ANNOTATED",
}

export interface IViewStatus {
  viewName: string;
  viewId: string;
  status: ViewStatus;
}

export interface IViewCheck {
  viewName: string;
  viewId: string;
  check: ViewCheck;
}

export interface IViewDetail extends IViewData, IViewStatus, IViewCheck {
  //
}

export interface IViewConf {
  viewName: string;
  category: Category;
  priority: number;
}

export interface IViewData {
  viewId: string;
  viewName: string;
  viewType: ViewType;
  viewStatusAnnotated?: ViewStatusAnnotated;
  category: Category;
  catalog: string[];
  mediaType: MediaType;
}

export interface IViewToAdd {
  viewName: string;
  category: Category;
  viewType: ViewType;
  catalogs: string[];
  mediaType: MediaType;
}

interface ICarryover {
  entityId?: string;
  documentId?: string;
}

export enum EditFieldType {
  TextField = "TextField",
  DateField = "DateField",
  BooleanField = "BooleanField",
  SelectField = "SelectField",
  TextAreaField = "TextAreaField",
  TimestampField = "TimestampField",
  MultiStringField = "MultiStringField",
  CategoryField = "CategoryField",
  MultiLinkField = "MultiLinkField",
}

export enum ATypeColumn {
  links = "links",
  link = "link",
  date = "date",
  text = "text",
  string = "string",
  strings = "strings",
  boolean = "boolean",
  timestamp = "timestamp",
  dictionaryEntry = "dictionaryEntry",
  dictionaryEntries = "dictionaryEntries",
  categories = "categories",
  passThrough = "passThrough",
}

export interface IEntityType {
  id: string;
  label: string;
  level?: number;
  struc?: string;
}

export interface IColumnSc extends IColumnWithGroupId {
  atype?: ATypeColumn;
  attributeName?: string;
  attributeSets?: string[];
  attributeFamily?: AttributeFamily;
  attributeType?: AttributeType;
  attributeStructureId?: string;
  editField?: {
    type: EditFieldType;
    multiSelectable?: boolean;
    dictionaryId?: string;
    dictionaryType?: DictionaryType;
  };
  entityPath?: string[];
  entityStructureId?: string;
  exportable?: boolean;
  mandatory?: boolean;
  multiCatalog?: boolean;
  multiLanguage?: boolean;
  scope: string[];
}

export interface IColumnExportTmp {
  attributeStructureId: string;
  label: string;
  attributeType: AttributeType;
  catalogsAndLanguages?: {
    [catalogId: string]: string[]; // array di languages id
  };
}

// LINK https://wardafactory.atlassian.net/wiki/spaces/SEEC/pages/1241939989/Dizionari
export enum DictionaryType {
  PLAIN = "plain", // A
  ENTRIES_BY_CATALOG = "entriesByCatalog", // B
  BY_CATALOG = "byCatalog", // C
  BY_CATALOG_MULTI_LANGUAGE = "byCatalogMultiLanguage", // D
  MULTI_LANGUAGE = "multiLanguage", // E
}

export interface IDictionary {
  dictionaryId: string;
  dictionaryType: DictionaryType;
  code: string;
  searchableValue: string;
  value: { [lang: string]: string };
  id: string;
  catalog: string;
}

export interface ICategory {
  id: string;
  root: string;
  parent: null | string;
  labels: { [lang: string]: string };
  catalog: string;
  searchableValue: string;
  attributeStructureId: string;
  displayOrder: number;
  depth?: number;
}

export interface IItemEs<T> {
  id: string;
  data: T;
}

export interface ICatalog {
  id: string;
  displayName: string;
  languages?: string[];
  fallback?: string;
}

export interface IFilter extends IFacetBase {
  keyword?: boolean;
  sortId?: string;
  sticky?: boolean;
  attributeStructureId?: string;
  dictionaryType?: DictionaryType;
  nested?: boolean;
  aggs?: IAggregationItem[];
  aggsMore?: number;
  showCaseSensitiveSwitch?: boolean;
  caseSensitive?: boolean;
  multiCatalog?: boolean;
  multiLanguage?: boolean;
  searchable?: boolean;
  dateFormat?: string;
  options?: IItemFacetMultiSelection[];
  attributeFamily?: AttributeFamily;
}

export interface IHashItemsSets {
  hash: string;
  saving?: boolean;
  itemsSets: IItemsSet[];
}

export interface IHashColumnsSets {
  hash: string;
  saving?: boolean;
  columsnSets: IColumnsOrderedSet[];
}

export const HASH_ITEMSSSETS = {
  hash: null,
  saving: false,
  itemsSets: [],
};

export const HASH_COLUMNSSETS = {
  hash: null,
  saving: false,
  columsnSets: [],
};

export interface IReadySetElement {
  id: string;
  idType: ContentType;
  catalogs: string[] | Array<{ catalogName: string; languages: string[] }>;
}
export interface IReadySet {
  entityId: string;
  elementsReady: IReadySetElement[];
  version: number;
}

export enum IAssignmentType {
  DEFAULT = "DEFAULT",
}

export enum IAssignmentStatus {
  DEFAULT = "DEFAULT",
}

export enum IAssignmentContentType {
  VIEW = "VIEW",
  ATTRIBUTE = "ATTRIBUTE",
  ENTITY = "ENTITY",
}

export interface IAnnotated {
  [viewName: string]: boolean;
}

export interface IAssignment {
  id: string;
  contentType: IAssignmentContentType;
  catalogs?: Array<{ catalogName: string; languages: string[] }>;
  assignee: string;
  assignmentType?: IAssignmentType;
  status?: IAssignmentStatus;
  notes?: string;
  instant?: number;
  user?: string;
}
export interface IAssignmentEntity {
  entityId: string;
  assignmentsToAdd?: IAssignment[];
  assignmentsToRemove?: IAssignment[];
  version: number;
}

export enum NotificationType {
  DEFAULT = "default",
  MENTION_IMG_SC = "MENTION_IMG_SC",
  MENTION_IMG_DA = "MENTION_IMG_DA",
  ASSIGNMENT = "ASSIGNMENT",
  IMPORT = "IMPORT",
  EXPORT = "EXPORT",
  STAGING_AREA = "STAGING_AREA",
  PRODUCT = "PRODUCT",
  CONFIGURATION = "CONFIGURATION",
  ARCHIVING = "ARCHIVING",
  CDN_STATUS = "CDN_STATUS",
  DELETE_MEDIA_CONTENT = "DELETE_MEDIA_CONTENT",
  SHARED_FILES = "SHARED_FILES",
  MULTI_PRODUCT_EDITING = "MULTI_PRODUCT_EDITING",
  FILE_PUBLICATION_SUCCESS = "FILE_PUBLICATION_SUCCESS",
  FILE_PUBLICATION_FAIL = "FILE_PUBLICATION_FAIL",
  FILE_UNPUBLICATION_SUCCESS = "FILE_UNPUBLICATION_SUCCESS",
  FILE_UNPUBLICATION_FAIL = "FILE_UNPUBLICATION_FAIL",
  FILE_COPYRIGHT_UPDATED = "FILE_COPYRIGHT_UPDATED",
}

export interface IWsNotification {
  connetionUUID: string;
  application: string;
  service: Service;
  notificationType: NotificationType;
  isError: boolean;
  tenantId: string;
  user: string;
  payload;
}

export interface INPayloadMentionImgSc {
  entityId: string;
  annotation: string;
  mediaView: string;
  mediaViewRequired: boolean;
  mediaFileId: string;
  mediaUploaded: number;
}

export interface INPayloadMentionImgDa {
  entityId: string;
  // NOTE Da gestire quando sarà richiesta tale feature
}
export interface INPayloadAssignment {
  assignedViews: Array<{
    entityId: string;
    viewName: string;
  }>;
  assignedEntity: Array<{ entityId: string }>;
  assignedAttributes: Array<{ entityId: string }>;
}

export interface INPayloadImport {
  filename: string;
  uploaded: string;
  successes: number;
  failures: number;
  error?: string;
}

export interface INPayloadSharedFile {
  assetDatas: Array<{
    id: string;
    name: string;
    mimeType: string;
  }>;
}

export enum RequestTypeBulkEditing {
  "ATTRIBUTE_EDITING" = "ATTRIBUTE_EDITING", // chiamata /multiProduct
  "ASSIGNMENT" = "ASSIGNMENT", // chiamata /multiAssignment
  "VIEW_EDITING" = "VIEW_EDITING", // chiamata /multiProductViews
  "VIEW_RESET" = "VIEW_RESET", // chiamata /multiResetViews
  "READY" = "READY", // chiamata /multiReady
  "PUBLISHED" = "PUBLISHED", // chiamata a cdmf/published
}

export interface INPayloadBulkEditing {
  hasErrors: boolean;
  message: string;
  success_keys: string[];
  failure_keys: string[];
  requestType: RequestTypeBulkEditing;
}

export enum RequestType {
  READY = "READY",
  READY_MEDIA = "READY_MEDIA",
  READY_ATTRIBUTE = "READY_ATTRIBUTE",
  ATTRIBUTE_EDITING = "ATTRIBUTE_EDITING",
  ASSIGNMENT = "ASSIGNMENT",
  VIEW_EDITING = "VIEW_EDITING",
  VIEW_RESET = "VIEW_RESET",
  PUBLISHED = "PUBLISHED",
}

export enum RequestStatus {
  error = "error",
  pending = "pending",
  done = "done",
  todo = "todo",
}

export interface IRequest {
  applicationId: string;
  tenantId: string;
  completed: string;
  creation: string;
  from: string;
  jobId: string;
  notificationType: "MULTI_PRODUCT_EDITING";
  payload: {
    hasErrors: boolean;
    requestType: RequestType;
    progress: Array<[key: string, status: RequestStatus]>;
  };
}

export interface INotification {
  id: string;
  creation: string;
  type: NotificationType;
  from: string;
  markedAsRead: boolean;
  markedAsViewed: boolean;
  payload:
    | INPayloadMentionImgSc
    | INPayloadMentionImgDa
    | INPayloadAssignment
    | INPayloadImport
    | INPayloadSharedFile
    | INPayloadBulkEditing;
}

export enum Category {
  DEFAULT = "DEFAULT",
  STILL_LIFE = "STILL-LIFE",
  WORN = "WORN",
}

export interface IFolder {
  id: string;
  label: string;
  createdOn?: string;
  lastModified?: string;
}

export interface ISort {
  id: string;
  label: string;
  order: ISortOrder;
  keyword: boolean;
}

export enum TagType {
  SIMPLE = 1,
  MARKETING = 2,
  PRODUCT = 3,
}

export const TagColor = {
  [TagType.SIMPLE]: Colors.Cyan,
  [TagType.MARKETING]: "#E96E8F",
  [TagType.PRODUCT]: Colors.Purple,
};

export interface ITag {
  id?: string;
  position?: {
    imgX: number;
    imgY: number;
  };
  name: string;
  type: TagType;
}

export enum CdnPublishedStatus {
  NOT_PUBLISHED = 0,
  IN_PUBLISHING = 1,
  PUBLISHED = 2,
  IN_UNPUBLISHING = 3,
}

export interface IPublicshare {
  accesscode: string;
  availability: boolean;
  root: boolean;
}

export interface ICdnUrls {
  original: string;
  identify: string;
  xs: string;
  s: string;
  l: string;
  xxl: string;
}

export interface IFile {
  id: string;
  documentRepoId: string;
  name: string;
  mimeType: string;
  cdnPublishedStatus: CdnPublishedStatus;
  parentFolder: string;
  owner: string;
  sharedWith?: IShared[];
  canEdit?: boolean;
  publicshares?: IPublicshare[];
  copyright?: ICopyright;
}

export interface IFileDetail extends IFile {
  createdOn: string;
  createdBy: string;
  lastModified: string;
  path: IPath[];
  tags?: ITag[];
  cdnUrls?: ICdnUrls;
}

export enum AttributeFamily {
  ALL_ATTRIBUTES = "ALL_ATTRIBUTES",
  CATEGORIES = "CATEGORIES",
  MEDIA = "MEDIA",
  MASTER = "MASTER",
  PLANNING = "PLANNING",
  EDITORIAL = "EDITORIAL",
  ASSOCIATION = "ASSOCIATION",
  MONITORING = "MONITORING",
  OTHERS = "OTHERS",
}

export interface IPermission {
  id: string;
  label: string;
}

export interface IRole {
  roleId: string;
  roleLabel: string;
}

export interface IItemStagingArea {
  businessId: string;
  fileId: string;
  filename: string;
  mediaType: MediaType;
  mediaTypeLabel: string;
  mimeType: string;
  uploaded: number;
  uploader: string;
  view: string;
}

export interface IEditedAttribute {
  name: string;
  catalog: string[]; // array con solo 1 valore
  language: string[]; // array con solo 1 valore
}

export interface EsPublications {
  id: string;
  [KEY_ENTITY_ID]?: string;
  [KEY_PUBLICATIONS]?: IReady[];
}
export interface EsReady {
  id: string;
  [KEY_ENTITY_ID]?: string;
  [KEY_READY]?: IReady[];
}
export interface EsMedia {
  id: string;
  [KEY_ENTITY_ID]?: string;
  [KEY_MEDIA]?: IMedia[];
}
export interface EsTabularRoot {
  id: string;
  version: number;
}
export interface EsTabular {
  id: string;
  [KEY_ROOT_ID]: string;
  [KEY_VIEW_DATA]?: IViewData[];
  [KEY_VIEW_STATUS]?: IViewStatus[];
  [KEY_VIEW_CHECK]?: IViewCheck[];
  [KEY_CATALOG]?: string[];
  [KEY_CARRYOVER_PARENT]?: ICarryover;
  [KEY_ATTRIBUTE_SETS]?: string[];
  [KEY_ASSIGNMENTS]?: IAssignment[];
  [KEY_ENTITY_ID]?: string;
  [KEY_ENTITY_TYPE]?: string;
  [KEY_ENTITY_STRUCTURE_ID]?: string;
  [KEY_VIEWS_EDITING_PERFORMED]?: boolean;
  [KEY_EDITED_ATTRIBUTES]?: IEditedAttribute[];
}

export interface IProduct
  extends EsTabular,
    EsTabularRoot,
    EsMedia,
    EsReady,
    EsPublications {}

export interface IUserProfile {
  id: string;
  sub: string;
  roles: { id: string; label: string }[];
  firstName: string;
  lastName: string;
  picture: string;
  createdAt: string;
  updatedAt: string;
  tenantId?: string;
  groupId?: string;
  email?: string;
  tenants?: { tenantId: string; label: string }[];
}

export interface IM2m {
  clientId: string;
  name: string;
  sub: string;
}

export enum Severity {
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
  ERROR = "ERROR",
  INFO = "INFO",
}

export interface IMenuViewReadys {
  open: boolean;
  positionTop: number;
  positionLeft: number;
  contentsCatalogs: string[];
  contentsPublication: IReady[];
  contentsReady: IReady[];
  mediaId: string;
}

export interface IMenuViewAssegnees {
  open: boolean;
  positionTop: number;
  positionLeft: number;
  viewAssegnees: IAssignment[];
  viewDetail: IViewDetail;
  item: IProduct;
}

export enum SheetLayout {
  CLOSED = "closed",
  OPENED = "opened",
  FULLSCREEN = "fullscreen",
}

export enum SheetStatus {
  PHOLDER = "pholder",
  LOADING = "loading",
  VISIBLE = "visible",
}

export interface IArea {
  refreshTime: number;
}

export interface IDataModifiedView {
  entityId: string;
  add: IViewToAdd[];
  remove: string[];
  version: number;
}

export interface IMediaInfo {
  geometry?: {
    width: number;
    height: number;
  };
  filesize?: string;
}

export interface ICopyright {
  agency?: string;
  author?: string;
  validFrom?: string;
  expirationDate?: string;
  copyrightNotes?: string;
}

export enum SharedRole {
  VIEWER = 0,
  EDITOR = 1,
  // ↓ need to UI
  OWNER = 9000,
  VARIES = 9001,
  TO_REMOVE_PRIVATE = 9002,
  TO_REMOVE_ORGANIZ = 9003,
}

export interface IShared {
  id: string;
  role: SharedRole;
}

export interface IPath {
  id: string;
  name: string;
  owner: string;
  sharedWith?: IShared[];
  canEdit?: boolean;
}

export interface IAttribute {
  id: string;
  label?: string;
  level?: string;
  atype?: ATypeColumn;
  groupId?: string;
  isDraft?: boolean;
  isEdited?: boolean;
  editable?: boolean;
  carryOver?: boolean;
  mandatory?: boolean;
  entityPath?: string[];
  dictionary?: DictionaryType;
  exportable?: boolean;
  attributeName?: string;
  attributeType?: AttributeType;
  attributeFamily?: AttributeFamily;
  attributeStructureId?: string;
  entityStructureId?: string;
  multiLanguage?: boolean;
  multiCatalog?: boolean;
}

export enum PermissionType {
  M2M_PERMISSION = "M2M_PERMISSION",
  USER_PERMISSION = "USER_PERMISSION",
}

export interface IPermissionData {
  id: string;
  owner: string;
  label: string;
  description: string;
  type: PermissionType;
  visibleInTenants: boolean;
}

export interface IUserProfileResponse {
  sub: string;
  userId: string;
  profileData: {
    firstName: string;
    lastName: string;
    email: string;
    group: string;
    picture: string;
    createdAt: string;
    updatedAt: string;
  };
  tenantId: string;
  roles: { roleId: string; roleLabel: string }[];
  permissions: { applicationId: string; permissions: string[] }[];
  tenants: { tenantId: string; label: string }[];
}

export interface IUsersResponse {
  tenantId: string;
  users: {
    sub: string;
    userId: string;
    profileData: {
      firstName: string;
      lastName: string;
      picture: string;
      createdAt: string;
      updatedAt: string;
      email?: string;
    };
    roles: IRole[];
  }[];
  m2m: IM2m[];
}

export interface IAdminUserProfile {
  sub: string;
  userId: string;
  profileData: {
    activated?: boolean;
    firstName: string;
    lastName: string;
    picture?: string;
    createdAt?: string;
    updatedAt?: string;
    email?: string;
    isWarda: boolean;
  };
  tenants: { tenantId: string; status: TenantStatus }[];
  roles: IRole[];
  applications?: string[];
}

export enum TenantStatus {
  ENABLED = "ENABLED",
  DISABLED = "DISABLED",
}

export interface IColumnsOrderedSet {
  id: string;
  label?: string;
  active?: boolean;
  default?: boolean;
  itemSorts: { id: string; order?: ISortOrder }[];
  items: IUserColumn[];
}

export interface ITenant {
  id: string;
  label: string;
  active: boolean;
}

export interface ISection {
  id: string;
  icon?: string;
  label: string;
  hidden?: boolean;
  disabled?: boolean;
  divider?: boolean;
}
